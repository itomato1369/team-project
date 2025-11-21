const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const queries = require(path.join(__dirname, "../database/sqlList"));
const fsPromises = require("fs/promises");
const fs = require("fs");
const { query, connectionPool } = require("../database/mappers/mapper.js");
const archiver = require("archiver");
const { fileSelectMulti } = require("../database/sqlList.js");

// ⭐ 공통 업로드 경로 설정
const uploadBase = path.join(__dirname, "..", "uploads", "board_files");

// ----------------------------------------------------
// Multer 설정
// ----------------------------------------------------
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fsPromises.mkdir(uploadBase, { recursive: true });
      console.log("Multer 최종 저장 경로:", uploadBase);
      cb(null, uploadBase);
    } catch (error) {
      console.error("폴더 생성 중 오류 발생:", error);
      cb(error, null);
    }
  },

  filename: (req, file, cb) => {
    const originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const ext = path.extname(originalname);
    const serverFileName = `${Date.now()}_${path.basename(
      originalname,
      ext
    )}${ext}`;
    cb(null, serverFileName);
  },
});

const upload = multer({ storage: storage });

// ----------------------------------------------------
// [GET] 자료 게시판 목록 조회
// ----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const rows = await query("dataBoard");
    res.json(rows);
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ----------------------------------------------------
// [POST] 자료 게시판 + 파일 업로드
// ----------------------------------------------------
router.post("/", upload.single("uploadFile"), async (req, res) => {
  console.log("[dataBoardRouter] POST / 요청 받음");

  const uploadedFile = req.file;

  const { institution_name, writer, title, parent_id, parent_tablename } =
    req.body;

  if (!uploadedFile) {
    return res.status(400).json({
      success: false,
      message: "파일 데이터가 누락되었습니다.",
    });
  }

  // DB 저장용 상대 경로
  const relativePath = `/uploads/board_files/${uploadedFile.filename}`;

  let conn;
  let newFileNo = null;

  try {
    conn = await connectionPool.getConnection();
    await conn.beginTransaction();

    // ---------- 1. 파일 번호 생성 ----------
    const fileNoRows = await conn.query(queries.createFileNo);

    if (fileNoRows && fileNoRows.length > 0 && fileNoRows[0].new_file_no) {
      newFileNo = fileNoRows[0].new_file_no;
    } else {
      const yearMonth = new Date().toISOString().slice(0, 7).replace("-", "");
      newFileNo = `FILE${yearMonth}001`;
    }

    // ---------- 2. files INSERT ----------
    const originalname = Buffer.from(
      uploadedFile.originalname,
      "latin1"
    ).toString("utf8");

    const fileParams = [
      newFileNo,
      writer,
      originalname,
      uploadedFile.filename, // server_file_name
      relativePath, // ⭐ 여기 수정됨 — DB에는 상대경로만 저장
      uploadedFile.size,
      path.extname(uploadedFile.originalname),
      parent_id,
      parent_tablename,
    ];

    await conn.query(queries.fileInsert, fileParams);

    // ---------- 3. board INSERT ----------
    const boardParams = [institution_name, writer, title, newFileNo];
    await conn.query(queries.boardInsert, boardParams);

    await conn.commit();

    console.log("등록 성공! file_no:", newFileNo);
    res.status(201).json({
      success: true,
      message: "게시글 및 파일 정보가 성공적으로 등록되었습니다.",
      fileNo: newFileNo,
    });
  } catch (err) {
    if (conn) await conn.rollback();

    // 파일 삭제
    try {
      if (uploadedFile && fs.existsSync(uploadedFile.path)) {
        await fsPromises.unlink(uploadedFile.path);
        console.log("트랜잭션 롤백 → 서버 파일 삭제:", uploadedFile.path);
      }
    } catch (unlinkErr) {
      console.error("서버 파일 삭제 실패:", unlinkErr);
    }

    console.error("DB 등록 트랜잭션 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------------------------------------
// [GET] 단일 파일 다운로드
// ----------------------------------------------------
// router.get("/download/:file_no", async (req, res) => {
//   try {
//     const fileNo = req.params.file_no;

//     const rows = await query("fileSelect", [fileNo]);
//     if (!rows || rows.length === 0)
//       return res.status(404).send("File not found");

//     const file = rows[0];

//     // 서버 실제 파일 위치
//     const filePath = path.join(uploadBase, file.server_file_name);

//     if (!fs.existsSync(filePath))
//       return res.status(404).send("File not found on server");

//     res.download(filePath, file.user_file_name);
//   } catch (err) {
//     console.error("파일 다운로드 실패:", err);
//     res.status(500).send("Server Error");
//   }
// });
// ===== 디버그용 단일 다운로드 라우터 =====
router.get("/download/:file_no", async (req, res) => {
  try {
    const fileNo = req.params.file_no;
    console.log("[DEBUG] download requested file_no:", fileNo);

    const rows = await query("fileSelect", [fileNo]);
    console.log("[DEBUG] DB rows:", JSON.stringify(rows, null, 2));

    if (!rows || rows.length === 0) {
      console.warn("[DEBUG] No DB record for file_no:", fileNo);
      return res.status(404).send(`File not found in DB: ${fileNo}`);
    }

    const file = rows[0];

    // 가능한 컬럼명들 체크 (DB 컬럼명이 다를 경우 대비)
    const serverFileName =
      file.server_file_name ||
      file.server_filename ||
      file.filename ||
      file.serverFileName ||
      file.file_name;
    const userFileName =
      file.user_file_name ||
      file.user_filename ||
      file.originalname ||
      file.userFileName ||
      file.user_file ||
      file.original_name;
    const dbFilePath = file.file_path || file.path || file.filepath;

    console.log(
      "[DEBUG] derived names => serverFileName:",
      serverFileName,
      "userFileName:",
      userFileName,
      "dbFilePath:",
      dbFilePath
    );

    // 1) 서버 기준 업로드 폴더(코드 상수와 동일하게)
    const uploadBase = path.join(__dirname, "..", "uploads", "board_files");

    // 2) 우선: serverFileName이 존재하면 uploadBase 기준으로 찾기
    let filePath;
    if (serverFileName) {
      filePath = path.join(uploadBase, serverFileName);
      console.log("[DEBUG] trying uploadBase path:", filePath);
      if (!fs.existsSync(filePath)) {
        console.warn("[DEBUG] not found at uploadBase:", filePath);
        filePath = null;
      }
    }

    // 3) fallback: DB에 저장된 상대경로(/uploads/...)이 있으면 절대경로로 변환해서 시도
    if (!filePath && dbFilePath) {
      // dbFilePath이 '/uploads/board_files/xxx' 형태라면 서버 기준으로 변환
      const maybeName = path.basename(dbFilePath);
      const maybePath = path.join(uploadBase, maybeName);
      console.log("[DEBUG] trying dbFilePath ->", maybePath);
      if (fs.existsSync(maybePath)) {
        filePath = maybePath;
      } else {
        console.warn("[DEBUG] not found at dbFilePath converted:", maybePath);
      }
    }

    // 4) 마지막 fallback: DB에 (잘못) 절대 경로가 들어가 있으면 그대로 시도 (로그 찍음)
    if (!filePath && dbFilePath && path.isAbsolute(dbFilePath)) {
      console.log("[DEBUG] trying absolute path from DB:", dbFilePath);
      if (fs.existsSync(dbFilePath)) filePath = dbFilePath;
      else console.warn("[DEBUG] absolute DB path does not exist:", dbFilePath);
    }

    if (!filePath) {
      console.error(
        "[DEBUG] final: file not found on server for file_no:",
        fileNo
      );
      return res.status(404).send("File not found on server");
    }

    // 파일 존재하면 전송
    console.log(
      "[DEBUG] sending file:",
      filePath,
      "as",
      userFileName || path.basename(filePath)
    );
    return res.download(filePath, userFileName || path.basename(filePath));
  } catch (err) {
    console.error("파일 다운로드 실패 (debug):", err);
    res.status(500).send("Server Error");
  }
});

// ----------------------------------------------------
// [POST] ZIP 다중 파일 다운로드
// ----------------------------------------------------
router.post("/download-multi/", async (req, res) => {
  try {
    const { fileNos } = req.body;

    if (!fileNos || !fileNos.length)
      return res.status(400).send("No files selected");

    const rows = await query(fileSelectMulti(fileNos.length), fileNos);
    if (!rows || !rows.length) return res.status(404).send("Files not found");

    res.setHeader("Content-Disposition", `attachment; filename=files.zip`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    rows.forEach((file) => {
      const filePath = path.join(uploadBase, file.server_file_name);

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
