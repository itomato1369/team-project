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

const findSupportNo = `SELECT sp.support_plan_no
FROM support_plan sp
JOIN ward w ON sp.ward_no = w.ward_no
JOIN member m ON m.user_id = w.guardian_id
WHERE m.user_id = 'usertest1'; -- 백틱 대신 작은따옴표 사용
`;

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
// const insertAnswer = `
// INSERT INTO answer (
//     writer,
//     content,
//     created_at  -- created_at 컬럼이 DEFAULT 값이 없다면, 여기에 NOW()를 사용합니다.
//     question_no,
//     user_id,
// )
// VALUES (
//     ?,          -- 1. writer (답변자 이름)
//     ?,          -- 2. content (답변 내용)
//     NOW()       -- 5. 현재 시각 (만약 created_at에 DEFAULT가 없다면 필요)
//     ?,          -- 3. question_no (FK)
//     ?,          -- 4. user_id (답변자 ID)
// );
// `;
const insertAnswer = `INSERT INTO answer (
    writer, 
    content, 
    created_at,
    question_no, 
    user_id
)
VALUES (
    (SELECT user_name FROM member WHERE user_id = ?),  -- writer: member에서 가져오기
    ?,                                                -- content
    NOW(),                                            -- created_at
    ?,                                                -- question_no
    ?                                                 -- user_id
);`;
// supportPlan: supportplan_no 컬럼을 id와 name으로 매핑합니다.
const supportPlan = `SELECT supportplan_no AS id, supportplan_no AS name FROM question`;

const answer = `SELECT answer_no,writer,content,created_at,question_no, user_id FROM answer`;
const insertAnswer1 = `
      UPDATE question
      SET answer_content = ?,
          answer_created_at = NOW()
      WHERE question_id = ?
    `;
module.exports = {
  qna,
  insertQna,
  supportPlan,
  readQuestion,
  answer,
  updateAnswer,
  countAnswers,
  insertAnswer,
};
