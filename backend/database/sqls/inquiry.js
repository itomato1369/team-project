// const inquiry = `select
//  inquiry_no
// , inquiry_name
// , inquiry_writer
// , inquiry_status
// , created_at
// , updated_at
// , notice_no
// from inquiry`;
const inquiry = `
  SELECT 
      i.inquiry_no
    , i.inquiry_name
    , i.inquiry_writer
    , i.inquiry_status
    , i.created_at 
    , i.updated_at
    , i.notice_no
    , n.content AS notice_content
  FROM inquiry i
  LEFT JOIN notice n ON i.notice_no = n.notice_no
`;

const inquiryList = `select 
 business_no
, answer_list
, answer
, must 
from inquiry_list`;

const inquiryOrderBy = `
SELECT 
    inquiry_no
    , inquiry_name
    , inquiry_writer
    , inquiry_status
    , created_at
    , updated_at 
FROM inquiry 
WHERE inquiry_no = ?`;

const inquiryListOrderBy = `SELECT business_no, answer_list AS question_content, question_category, answer AS response_type, must AS is_required, inquiry_no FROM inquiry_list WHERE inquiry_no = ? ORDER BY inquiry_no ASC`;
// 👇 --- [신규] '조사지' (마스터) INSERT 쿼리 --- 👇
// const inquiryInsert = `
//   INSERT INTO inquiry (inquiry_name, inquiry_writer, inquiry_status, created_at, updated_at, notice_no)
//   VALUES (?, ?, ?, NOW(), NOW(), ?)
// `;
const inquiryInsert = `
  INSERT INTO inquiry (inquiry_name, inquiry_writer, inquiry_status, created_at, updated_at, notice_no)
  VALUES (
      ?,                                       -- 1. inquiry_name
      ?,                                       -- 2. inquiry_writer
      ?,                                       -- 3. inquiry_status
      NOW(), 
      NOW(), 
      (
          SELECT 
              n.notice_no 
          FROM notice n 
          ORDER BY n.notice_no ASC             -- notice 테이블의 notice_no를 오름차순 정렬
          LIMIT 1                              -- 가장 작은(첫 번째) notice_no를 선택
      )
  )
`;

// 👇 --- [신규] '질문 목록' (상세) INSERT 쿼리 --- 👇
const questionInsert = `
  INSERT INTO inquiry_list (answer_list, answer, must, inquiry_no, priority)
  VALUES (?, ?, ?, ?, ?)
`;

const noticeList = `
        SELECT 
            notice_no, 
            content
             
        FROM notice;
`;
module.exports = {
  inquiry,
  inquiryList,
  inquiryOrderBy,
  inquiryListOrderBy,
  inquiryInsert,
  questionInsert,
  noticeList,
};
