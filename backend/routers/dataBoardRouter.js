const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// ⭐️ [수정] 쿼리 파일은 그대로 유지
const queries = require(path.join(__dirname, "../database/sqlList"));
// ⭐️ [수정] fs/promises와 fs(동기) 모듈을 분리하여 임포트
const fsPromises = require("fs/promises");
const fs = require("fs");
const { query, connectionPool } = require("../database/mappers/mapper.js");
const archiver = require("archiver");
const { fileSelectMulti } = require("../database/sqlList.js");

console.log("queries.fileSelect:", queries.fileSelect);

// ----------------------------------------------------
// Multer 설정
// --------------------------------------------------
// --

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads", "board_files");
    try {
      // ⭐️ [수정] fsPromises를 사용하여 비동기로 폴더 생성
      await fsPromises.mkdir(uploadPath, { recursive: true });
      console.log("Multer 최종 저장 경로:", uploadPath);
    } catch (error) {
      console.error("폴더 생성 중 오류 발생:", error);
      return cb(error, null);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const ext = path.extname(file.originalname);
    const serverFileName = `${Date.now()}_${path.basename(
      originalname,
      ext
    )}${ext}`;
    cb(null, serverFileName);
  },
});

// upload 변수 정의
const upload = multer({ storage: storage });
// ----------------------------------------------------

/**
 * [GET /api/dataBoard]
 * 자료 게시판 '목록'을 DB에서 조회합니다.
 */
router.get("/", async (req, res) => {
  try {
    // 'dataBoard'라는 쿼리가 sqlList.js에 정의되어 있다고 가정합니다.
    const rows = await query("dataBoard");
    res.json(rows);
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * [POST /api/dataBoard]
 * 게시글 및 파일 정보를 트랜잭션으로 처리합니다.
 */
router.post("/", upload.single("uploadFile"), async (req, res) => {
  console.log("[dataBoardRouter] POST / 요청 받음");

  const uploadedFile = req.file;

  const {
    institution_name,
    writer,
    title,
    parent_id, // files 테이블용
    parent_tablename, // files 테이블용
  } = req.body;

  if (!uploadedFile) {
    return res
      .status(400)
      .json({ success: false, message: "파일 데이터가 누락되었습니다." });
  }

  let conn;
  let newFileNo = null;

  try {
    conn = await connectionPool.getConnection();
    await conn.beginTransaction(); // 1. files 테이블을 위한 file_no 자동 생성 // queries.createFileNo가 정의되어 있고, 'FOR UPDATE'가 포함된 트랜잭션 안전 쿼리라고 가정합니다.

    const fileNoRows = await conn.query(queries.createFileNo);

    if (fileNoRows && fileNoRows.length > 0 && fileNoRows[0].new_file_no) {
      newFileNo = fileNoRows[0].new_file_no;
    } else {
      console.warn(
        "file_no 생성 쿼리가 빈 결과를 반환했습니다. 첫 번째 파일 번호를 수동 생성합니다."
      );
      const yearMonth = new Date().toISOString().slice(0, 7).replace("-", "");
      newFileNo = `FILE${yearMonth}001`;
    }

    if (!newFileNo) {
      throw new Error("파일 번호 생성에 최종적으로 실패했습니다.");
    } // 2. files 테이블에 파일 정보 INSERT (queries.fileInsert가 정의되어 있다고 가정)
    const originalname = Buffer.from(
      uploadedFile.originalname,
      "latin1"
    ).toString("utf8");
    const fileParams = [
      newFileNo,
      writer,
      originalname,
      uploadedFile.filename, // Multer destination은 절대 경로이므로 그대로 사용합니다.
      uploadedFile.destination,
      uploadedFile.size,
      path.extname(uploadedFile.originalname),
      parent_id,
      parent_tablename,
    ];
    await conn.query(queries.fileInsert, fileParams); // 3. board 테이블에 게시글 정보 INSERT (queries.boardInsert가 정의되어 있다고 가정)

    const boardParams = [institution_name, writer, title, newFileNo];
    await conn.query(queries.boardInsert, boardParams); // 4. [커밋]

    await conn.commit();

    console.log("등록 성공! file_no:", newFileNo);
    res.status(201).json({
      success: true,
      message: "게시글 및 파일 정보가 성공적으로 등록되었습니다.",
      fileNo: newFileNo,
    });
  } catch (err) {
    // 5. [롤백]
    if (conn) await conn.rollback(); // 🚨 트랜잭션 실패 시 파일 시스템에 저장된 파일도 삭제하는 로직을 추가할 수 있습니다.

    try {
      if (uploadedFile && fs.existsSync(uploadedFile.path)) {
        await fsPromises.unlink(uploadedFile.path);
        console.log(
          "트랜잭션 롤백으로 인해 서버 파일 삭제 완료:",
          uploadedFile.path
        );
      }
    } catch (unlinkErr) {
      console.error("서버 파일 삭제 실패:", unlinkErr);
    }

    console.error("DB 등록 트랜잭션 실패:", err);

    res
      .status(500)
      .json({ success: false, message: "서버 오류", error: err.message });
  } finally {
    // 6. [반환]
    if (conn) conn.release();
  }
});

// 단일 파일 다운로드
router.get("/download/:file_no", async (req, res) => {
  try {
    const fileNo = req.params.file_no; // ⭐️ [수정] queries.fileSelect가 undefined일 경우를 대비하여 SQL 쿼리를 직접 정의합니다.

    const fileSelectQuery = queries.fileSelect;

    const rows = await query("fileSelect", [fileNo]);
    console.log(fileNo);

    if (!rows || rows.length === 0)
      return res.status(404).send("File not found");

    const file = rows[0];
    const filePath = path.join(file.file_path, file.server_file_name); // ⭐️ [수정] fs.existsSync는 동기 fs 모듈에서 사용합니다.
    console.log(filePath);
    if (!fs.existsSync(filePath))
      return res.status(404).send("File not found on server");

    res.download(filePath, file.user_file_name);
  } catch (err) {
    console.error("파일 다운로드 실패:", err);
    res.status(500).send("Server Error");
  }
});

// 멀티 파일 다운로드 (ZIP)
router.post("/download-multi/", async (req, res) => {
  try {
    const { fileNos } = req.body; // ["FILE202511001", "FILE202511002", ...]

    if (!fileNos || !fileNos.length)
      return res.status(400).send("No files selected");

    // 다중 파일용 쿼리
    const rows = await query(fileSelectMulti(fileNos.length), fileNos);

    if (!rows || !rows.length) return res.status(404).send("Files not found");

    res.setHeader("Content-Disposition", `attachment; filename=files.zip`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    rows.forEach((file) => {
      const filePath = path.join(file.file_path, file.server_file_name);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.user_file_name });
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    });

    await archive.finalize();
  } catch (err) {
    console.error("ZIP 다운로드 실패:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
