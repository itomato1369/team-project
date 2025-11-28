// member TABLE에 회원 정보 등록

// 회원가입 시 입력되는 값
// 아이디, 비밀번호, 이름, 생년월일, 이메일, 전화번호, 주소, 가입일자
const signUpUser = `INSERT INTO member (user_id, password, user_name, birthday, email, phone, address, role, status, institution_no, created_at)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

// institution_no 가 필요한데 이게 회원가입할 때 필요한지 기억이 안남

// 아이디 중복 체크
const checkUserById = `SELECT user_id FROM member WHERE user_id = ? LIMIT 1`;

module.exports = {
  signUpUser,
  checkUserById,
};
