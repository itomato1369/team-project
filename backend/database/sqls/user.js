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
  s.writer, -- 작성자 user_id(ex: test555)
  w.ward_no,
  w.name,
  i.institution_name ,
  s.survey_no,
  s.business_name,
  s.created_at ,
  p.priority_no, -- survey를 통해 support_plan이 작성되었다면 그값을 찾기 위해선 우선순위PK값이 필요함
  sp.support_plan_no,
  sp.support_plan_status AS plan_status,
  sr.support_result_no
  FROM 
  member m
  INNER JOIN ward w ON w.guardian_id = m.user_id  -- 사용자 ward 필터링
  INNER JOIN survey s ON s.ward_no = w.ward_no  -- survey 필수 (없으면 행 제외)
  LEFT JOIN priority p ON p.survey_no = s.survey_no AND p.ward_no = w.ward_no  -- survey → priority (없을 수 있음)
  LEFT JOIN support_plan sp ON sp.priority_no = p.priority_no AND sp.ward_no = w.ward_no  -- priority → support_plan (없을 수 있음)
  LEFT JOIN support_result sr ON sr.support_plan_no = sp.support_plan_no  -- support_plan → support_result (없을 수 있음)
  JOIN institution i ON i.institution_no = m.institution_no
  WHERE 
  m.user_id = ?
  ORDER BY 
  w.ward_no,  -- ward별 그룹핑처럼 정렬
  s.survey_no, 
  sp.support_plan_no, 
  sr.support_result_no
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

  findSupportPlanDetailBySupportPlanNo: `
SELECT
    sp.business_name,
    sp.support_plan_goal,
    sp.plan,
    sp.support_plan_status
FROM
    support_plan sp
WHERE
    sp.support_plan_no = ?
    AND sp.ward_no = ?
`,

  findSurveyDataBySurveyNo: `
SELECT
    s.survey_no,
    s.business_name,
    s.purpose,
    s.content,
    s.writer,
    s.created_at,
    s.modify_reason,
    s.status,
    w.name AS ward_name,
    (SELECT i.inquiry_name
     FROM inquiry i
     JOIN inquiry_list il ON i.inquiry_no = il.inquiry_no
     JOIN survey_result sr ON il.business_no = sr.business_no
     WHERE sr.survey_no = s.survey_no
     LIMIT 1) AS inquiry_name,
    (SELECT sp.support_plan_status
     FROM support_plan sp
     JOIN priority p ON sp.priority_no = p.priority_no
     WHERE p.survey_no = s.survey_no
     LIMIT 1) AS plan_status
FROM survey s
JOIN ward w ON s.ward_no = w.ward_no
WHERE s.survey_no = ?
`,

  findQuestionsAndAnswersBySurveyNo: `
SELECT
    il.business_no,
    il.answer_list AS question_content,
    il.answer AS response_type,
    il.must AS is_required,
    il.priority,
    sr.survey_answer
FROM survey_result sr
JOIN inquiry_list il ON sr.business_no = il.business_no
WHERE sr.survey_no = ?
ORDER BY il.priority, il.business_no
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
  findAvailableWardsForInquiry: `
    SELECT w.name
    , w.ward_no
    FROM ward w
    JOIN member m 
      ON m.user_id = w.guardian_id
    WHERE m.user_id = ?
    AND NOT EXISTS (
    SELECT 1
    FROM survey s
    JOIN survey_result sr 
      ON sr.survey_no = s.survey_no
    JOIN inquiry_list il 
      ON il.business_no = sr.business_no
    WHERE s.ward_no = w.ward_no
    AND il.inquiry_no = ?)
    ORDER BY w.name;
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
