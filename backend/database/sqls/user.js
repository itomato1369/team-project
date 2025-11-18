/**
 * 사용자 ID로 사용자 정보 조회 (로그인 시 비밀번호 검증용)
 * 'role' 컬럼을 'user_role'로 별칭하여 사용합니다.
 */
const findUserById = `
SELECT user_id, 
       password, 
       user_name,
       email,
       role AS user_role
FROM member
WHERE user_id = ?`;

const findExpiringNotices = `
SELECT notice_no
  , business_name
  , content
  , business_end
FROM notice
WHERE business_end BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 700 DAY)
ORDER BY business_end ASC
`;

const findSurveyToUserWard = `
SELECT 
    s.survey_no, 
    s.business_name, 
    s.updated_at
FROM 
    member m
JOIN 
    ward w ON m.user_id = w.guardian_name 
JOIN 
    survey s ON w.ward_no = s.ward_no
WHERE 
    m.user_name = ?
ORDER BY s.updated_at DESC
`;

const findBoardList = `
SELECT 
    board_no
    , institution_name
    , category
    , writer
    , title
    , content
    , hashtag
    , file_no
    , created_at
    , updated_at
FROM board
ORDER BY created_at DESC
`;

const findBoardListByHashtag = `
SELECT 
    board_no
    , institution_name
    , category
    , writer
    , title
    , content
    , hashtag
    , file_no
    , created_at
    , updated_at
FROM board
WHERE hashtag LIKE ?
ORDER BY created_at DESC
`;

const findBoardListByData = `
SELECT 
    board_no
    , institution_name
    , category
    , writer
    , title
    , content
    , hashtag
    , file_no
    , created_at
    , updated_at
FROM board
WHERE title LIKE ? OR content LIKE ?
ORDER BY created_at DESC
`;

const findUserSurveys = `
SELECT
    n.business_name,
    w.name AS ward_name,
    n.business_end AS deadline,
    CASE
        WHEN s.survey_no IS NOT NULL THEN s.status
        ELSE '미제출'
    END AS submission_status,
    n.notice_no,
    w.ward_no
FROM
    notice n
CROSS JOIN
    (SELECT ward_no, name FROM ward WHERE guardian_name = ( SELECT user_id FROM member WHERE user_name = ? )) w
LEFT JOIN
    survey s ON w.ward_no = s.ward_no AND n.business_name = s.business_name
ORDER BY
    w.name, n.business_end
`;

const userInquirySqls = {
    
findInquiries: `
SELECT
    i.inquiry_no,
    i.inquiry_name,
    i.inquiry_writer,
    i.inquiry_status,
    i.created_at,
    i.updated_at,
    i.notice_no,
    n.business_name
FROM inquiry i
LEFT JOIN notice n ON i.notice_no = n.notice_no
WHERE i.inquiry_status = 1`,
inquiryList: `select 
 business_no
, answer_list
, answer
, must 
from inquiry_list`,

findInquiryDetail: `
SELECT
    i.inquiry_no,
    i.inquiry_name,
    i.inquiry_writer,
    i.inquiry_status,
    i.created_at,
    i.updated_at,
    n.business_name,
    n.business_end
FROM inquiry i
LEFT JOIN notice n ON i.notice_no = n.notice_no
WHERE i.inquiry_no = ?`,

findInquiryQuestions: `SELECT business_no, answer_list AS question_content, question_category, answer AS response_type, must AS is_required, inquiry_no, priority FROM inquiry_list WHERE inquiry_no = ? ORDER BY inquiry_no ASC`,

insertSurvey: `
INSERT INTO survey (ward_no, business_name, purpose, content, writer, status, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
`,

insertSurveyResult: `
INSERT INTO survey_result (business_no, survey_answer, survey_no)
VALUES ?
`
}

module.exports = {
  findUserById,
  findExpiringNotices,
  findSurveyToUserWard,

  findBoardList,
  findBoardListByData,
  findBoardListByHashtag,
  findUserSurveys,

  ...userInquirySqls,
};
