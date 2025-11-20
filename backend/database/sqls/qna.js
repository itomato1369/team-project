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
         q.answer_content,
         q.answer_created_at,
         m.user_name AS writer
       FROM question q
       JOIN member m ON q.user_id = m.user_id
       WHERE q.question_no = ?`;

// supportPlan: supportplan_no 컬럼을 id와 name으로 매핑합니다.
const supportPlan = `SELECT supportplan_no AS id, supportplan_no AS name FROM question`;

module.exports = {
  qna,
  insertQna,
  supportPlan,
  readQuestion,
};
