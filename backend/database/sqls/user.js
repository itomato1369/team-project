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

module.exports = {
  findUserById,
  findExpiringNotices,
  findSurveyToUserWard,

  findBoardList,
  findBoardListByData,
  findBoardListByHashtag,
};
