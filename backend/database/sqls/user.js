/**
 * 사용자 ID로 사용자 정보 조회 (로그인 시 비밀번호 검증용)
 * 'role' 컬럼을 'user_role'로 별칭하여 사용합니다.
 */
const findUserById = `
SELECT user_id, 
       password, 
       role AS user_role
FROM member
WHERE user_id = ?`;

module.exports = {
  findUserById,
};
