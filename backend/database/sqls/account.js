// 아이디 비밀번호 찾기 쿼리문

const findAccountByEmail = `SELECT user_id FROM member
WHERE user_name = ? AND email = ?`;

const findAccountByPhone = `SELECT user_id FROM member
WHERE user_name = ? AND phone = ?;`;

module.exports = {
  findAccountByEmail,
  findAccountByPhone,
};
