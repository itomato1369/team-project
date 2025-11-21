const qna = `select question_no
, title
, category
, writer
, content
, created_at
, supportplan_no
, user_id
, answer_yn
from question`;

// sqlList.js
// const insertQna = `
//   INSERT INTO question (title, category, content, supportplan_no)
//   VALUES (?, ?, ?, ?)
// `;
// ##################나중에 다시 살릴수도 있음############
const insertQna = `
INSERT INTO question (
  title,
  category,
  content,          -- 3번째 INSERT 컬럼
  supportplan_no,
  created_at,
  user_id,          -- 6번째 INSERT 컬럼 (조회 값)
  writer            -- 7번째 INSERT 컬럼 (조회 값)
  )
  SELECT
  ?,                -- 1. title
  ?,                -- 2. category
  ?,                -- 3. content
  ?,                -- 4. supportplan_no
  NOW(),
  m.user_id,          -- 5. user_id
  m.user_name         -- 6. writer
FROM member m
WHERE m.user_id = ?;    -- 7. WHERE 조건
`;
const readQuestion = `SELECT
    q.question_no,
    q.title,
    q.content,
    q.created_at,
    m.user_name AS writer,
    -- ⭐️ 1. 답변 내용과 답변 일시를 가져옵니다.
    a.content AS answer_content,          
    a.created_at AS answer_created_at,
    a.writer AS answer_writer,            -- 답변자의 이름
    a.user_id AS answer_user_id           -- 답변자의 ID (필요하다면)
FROM
    question q
LEFT JOIN
    member m ON q.user_id = m.user_id      -- 질문 작성자 JOIN
LEFT JOIN
    answer a ON q.question_no = a.question_no -- ⭐️ 2. answer 테이블 JOIN (일대일 답변을 가정)
WHERE
    q.question_no = ?;`;

const countAnswers = `
SELECT COUNT(*) AS answer_count
FROM answer
WHERE question_no = ?;
`;

// question 테이블의 answer_yn을 '1'로 업데이트하는 쿼리 (기존 사용)
const updateAnswer = `
UPDATE question
SET answer_yn = 1
WHERE question_no = ? AND answer_yn = 0;
`;

// supportPlan: supportplan_no 컬럼을 id와 name으로 매핑합니다.
const supportPlan = `SELECT supportplan_no AS id, supportplan_no AS name FROM question`;

const answer = `SELECT answer_no,writer,content,created_at,question_no, user_id FROM answer`;

module.exports = {
  qna,
  insertQna,
  supportPlan,
  readQuestion,
  answer,
  updateAnswer,
  countAnswers,
};
