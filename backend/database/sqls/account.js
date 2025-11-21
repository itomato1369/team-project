// 아이디 비밀번호 찾기 쿼리문

// 이메일로 아이디 찾기
const findAccountByEmail = `SELECT user_id, email FROM member
WHERE user_name = ? AND email = ?`;

// 이메일로 비밀번호 찾기
const findAccountForPw = `SELECT user_id, email FROM member
WHERE user_name = ? AND user_id = ? AND email = ?`;

// 전화번호로 아이디 찾기
// const findAccountByPhone = `SELECT user_id FROM member
// WHERE user_name = ? AND phone = ?;`;

module.exports = {
  findAccountByEmail,
  findAccountForPw,
};
