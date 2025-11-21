const express = require("express");
const router = express.Router();

const { query, connectionPool } = require("../database/mappers/mapper.js");
const sql = require("../database/sqlList.js");

/**
 *  [GET /api/qna]
 *  전체 QnA 조회
 */
router.get("/", async (req, res) => {
  console.log("[qnaRouter] GET / 요청 받음");
  try {
    const rows = await query("qna");
    res.json(rows);
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 *  [POST /api/qna/question]
 *  QnA 등록
 */
router.post("/question-answer/:question_no", async (req, res) => {
  console.log("[qnaRouter] POST /question 요청 받음");
  const tempId = "test";
  // 프론트에서 보낸 데이터
  const { title, category, content, supportplan_no, writer } = req.body;
  const result = await query("insertQna", [
    title,
    category,
    content,
    supportplan_no,
    tempId,
  ]);

  if (!title) {
    return res.status(400).json({ message: "제목누락" });
  }

  let conn;

  try {
    conn = await connectionPool.getConnection();
    await conn.beginTransaction();

    await conn.commit();

    console.log("QnA 등록 성공!", "insertId");

    res.status(201).json({
      message: "질문이 성공적으로 등록되었습니다.",
      question_no: result.insertId,
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("QnA 등록 실패:", err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

router.get("/supportplan", async (req, res) => {
  const rows = await query("supportPlan");
  res.json(rows);
});
router.get("/question-detail/:question_no", async (req, res) => {
  const questionId = req.params.question_no; // ✅ params 이름과 일치시킴

  try {
    const rows = await query("readQuestion", [questionId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "질문을 찾을 수 없습니다." });
    }

    res.json(rows[0]); // 1개 레코드 반환
  } catch (err) {
    console.error("QnA 상세 조회 실패:", err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});
/**
 * [POST /api/qna/answer]
 * 답변 등록 (answer 테이블 INSERT)
 * ⚠️ DB 트리거가 question.answer_yn 업데이트를 자동으로 처리함.
 */
// router.post("/answer", async (req, res) => {
//   console.log("[qnaRouter] POST /answer 요청 받음");

//   // ⭐️ 클라이언트(Vue)에서 전송한 데이터
//   const { question_no, content, writer, user_id } = req.body;

//   // 데이터 누락 검증
//   if (!question_no || !content || !user_id || !writer) {
//     return res
//       .status(400)
//       .json({ message: "필수 데이터(질문 번호, 내용, 작성자 이름/ID) 누락" });
//   }

//   let conn; // DB 연결 객체

//   try {
//     conn = await connectionPool.getConnection();
//     await conn.beginTransaction(); // 트랜잭션 시작 (원자성 확보)

//     // 1. 답변 INSERT 쿼리 실행
//     // 'insertAnswer'는 sqlList.js에 정의되어 있어야 합니다.
//     // 파라미터 순서: [writer, content, question_no, user_id]
//     await conn.query("insertAnswer", [writer, content, question_no, user_id]);

//     await conn.commit(); // 모든 작업 성공 시 커밋

//     console.log(`답변 등록 성공! Question ${question_no}`);

//     res.status(201).json({
//       message: "답변이 성공적으로 등록되었습니다.",
//     });
//   } catch (err) {
//     if (conn) await conn.rollback(); // 오류 발생 시 롤백
//     console.error("답변 등록 실패:", err);
//     res.status(500).json({ message: "서버 오류", error: err.message });
//   } finally {
//     if (conn) conn.release(); // 연결 반환
//   }
// });
router.post("/answer", async (req, res) => {
  console.log("[qnaRouter] POST /answer 요청 받음");

  const { question_no, content, user_id } = req.body; // writer는 쿼리 내부에서 조회하므로 제거 가능

  if (!question_no || !content || !user_id) {
    return res
      .status(400)
      .json({ message: "필수 데이터(질문 번호, 내용, 작성자 ID) 누락" });
  }

  let conn;

  try {
    conn = await connectionPool.getConnection();
    await conn.beginTransaction(); // 트랜잭션 시작

    // 1. 답변 INSERT 쿼리 실행
    // ⚠️ 문제 해결: sql.insertAnswer를 사용하여 실제 SQL 문자열 전달
    // 파라미터 순서: [user_id (writer 조회용), content, question_no, user_id (user_id 컬럼용)]
    await conn.query(sql.insertAnswer, [
      user_id, // 1. writer를 가져오기 위한 user_id (SELECT user_name FROM member WHERE user_id = ?)
      content, // 2. content
      question_no, // 3. question_no
      user_id, // 4. user_id
    ]);

    await conn.commit(); // 커밋

    console.log(`답변 등록 성공! Question ${question_no}`);

    res.status(201).json({
      message: "답변이 성공적으로 등록되었습니다.",
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("답변 등록 실패:", err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});
module.exports = router;
