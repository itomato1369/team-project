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
router.post("/question", async (req, res) => {
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
module.exports = router;
