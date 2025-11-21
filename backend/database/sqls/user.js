/**
 * 사용자 ID로 사용자 정보 조회 (로그인 시 비밀번호 검증용)
 * 'role' 컬럼을 'user_role'로 별칭하여 사용합니다.
 */
const findUserById = `
SELECT user_id, 
       password, 
       user_name,
       email,
       institution_no,
       role AS user_role
FROM member
WHERE user_id = ?`;

const findUserByEmail = `
SELECT user_id, 
       password, 
       user_name,
       email,
       role AS user_role
FROM member
WHERE email = ?`;

const createSocialUser = `
INSERT INTO member (user_id, user_name, email, role, status, provider, social_id, created_at)
VALUES (?, ?, ?, 'USER', 'READY', 'google', ?, NOW())
`;

const updateSocialUser = `
UPDATE member
SET
    birthday = ?,
    phone = ?,
    address = ?,
    status = 'ACTIVE'
WHERE
    user_id = ?;
`;

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
    s.created_at
FROM 
    member m
JOIN 
    ward w ON m.user_id = w.guardian_id 
JOIN 
    survey s ON w.ward_no = s.ward_no
WHERE 
    m.user_id = ?
ORDER BY s.created_at DESC
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
    s.status AS submission_status,
    n.notice_no,
    w.ward_no
FROM
    notice n
CROSS JOIN
    (SELECT ward_no, name FROM ward WHERE guardian_id = ( SELECT user_id FROM member WHERE user_id = ? )) w
LEFT JOIN
    survey s ON w.ward_no = s.ward_no AND n.business_name = s.business_name
ORDER BY
    w.name, n.business_end
`;

const userInquirySqls = {
  findSurveysForMyPage: `
SELECT
    s.content,
    n.institution_name,
    s.business_name,
    s.created_at,
    s.status,
    i.inquiry_no,
    s.ward_no
FROM survey s
LEFT JOIN notice n ON s.business_name = n.business_name
LEFT JOIN inquiry i ON s.content = i.inquiry_name
WHERE s.writer = ?
ORDER BY s.created_at DESC
`,

  findSurveyByInquiryContent: `
select 
  s.*
from survey s
join 
  inquiry i on s.content = i.inquiry_name
where i.inquiry_no = ?
`,

  updateSurvey: `
UPDATE survey SET updated_at = NOW(), modify_reason = ?, purpose = ?, content = ? WHERE survey_no = ?
`,

  deleteSurveyResultsBySurveyNo: `
DELETE FROM survey_result WHERE survey_no = ?
`,

  findSurveyResultsBySurveyNo: `
SELECT * FROM survey_result WHERE survey_no = ?
`,

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
`,

  findSupportPlanDetailByInquiryNo: `
SELECT
    sp.business_name,
    sp.support_plan_goal,
    sp.plan,
    sp.support_plan_status
FROM
    support_plan sp
WHERE
    sp.notice_no = (SELECT notice_no FROM inquiry WHERE inquiry_no = ?)
    AND sp.ward_name = (SELECT name FROM ward WHERE ward_no = ?)
ORDER BY
    sp.created_at DESC
LIMIT 1
`,
};

const getUsersByInstitutionNo = `
SELECT
    user_id,
    user_name,
    phone,
    status
FROM
    member
WHERE
    institution_no = ? AND role = 'USER'
`;

const wardSqls = {
  findWardsByGuardianId: `
    SELECT
      w.*,
      p.priority_status
    FROM
      ward w
    LEFT JOIN
      priority p ON w.ward_no = p.ward_no
    WHERE
      w.guardian_id = ?
  `,
  insertWard: `
    INSERT INTO ward (ward_rrn, name, sex, address, guardian_id, guardian_relation, disabled_level, age, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `,
  updateWard: `
    UPDATE ward 
    SET address = ?, disabled_level = ?
    WHERE ward_no = ?
  `,
};

const myInfoSqls = {
  findUserByUserId: `
    SELECT 
    m.user_id,
    m.user_name,
    m.email,
    m.phone,
    m.address,
    m.birthday,
    m.role,
    m.status,
    m.institution_no,
    i.institution_name,
    i.status as institution_status,
    i.closed_at,
    i.closed_notice
    FROM member m
    LEFT JOIN institution i ON m.institution_no = i.institution_no
    WHERE m.user_id = ?
  `,
  getInstitutionInfo: `
    SELECT
      m.user_id,
      m.user_name,
      m.email,
      m.phone,
      m.role,
      m.status,
      i.institution_no,
      i.institution_name,
      i.status as institution_status,
      i.closed_at
    FROM member m
    LEFT JOIN institution i ON m.institution_no = i.institution_no
    WHERE m.user_id = ?
  `,
  applyToInstitution: `
    UPDATE member SET institution_no = ?, status = 'READY' WHERE user_id = ?
  `,
  findAllInstitutions: `
    SELECT institution_no, institution_name FROM institution
  `,
  updateUser: `
    UPDATE member SET phone = ?, address = ?, email = ? WHERE user_id = ?
  `,
  updatePassword: `
    UPDATE member SET password = ? WHERE user_id = ?
  `,
  updateInstitutionStatus: `
    UPDATE institution SET status = ?, closed_at = ?, closed_notice = ?, updated_at = NOW() WHERE institution_no = ?
  `,
};

module.exports = {
  findUserById,
  findUserByEmail,
  createSocialUser,
  updateSocialUser,
  findExpiringNotices,
  findSurveyToUserWard,

  findBoardList,
  findBoardListByData,
  findBoardListByHashtag,
  findUserSurveys,

  ...userInquirySqls,

  getUsersByInstitutionNo,

  ...wardSqls,

  ...myInfoSqls,
};
