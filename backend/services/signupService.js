// 비즈니스 로직
const db = require("../database/mappers/mapper.js");
const bcrypt = require("bcrypt"); // 비밀번호 보안
const jwt = require("jsonwebtoken"); // USER,STAFF,ADMIN,SYS확인

// 아이디 중복 체크 검사 버튼
const isUserIdCheck = async (userId) => {
  const rows = await db.query("checkUserById", [userId]);
  // 이미 가입된 이용자면true
  return rows.length > 0;
};

// 회원가입 시 전송할 데이터 처리 함수
const register = async (userData) => {
  const { userId, password, name, birthDate, email, phone, fullAddress, role } =
    userData;

  // 유효성 검사
  if (!userId || !password || !email || !name) {
    const error = new Error("필수 입력 항목이 누락되었습니다");
    error.statusCode = 400;
    throw error;
  }
  // 아이디 중복 검사
  const existingUser = await db.query("checkUserById", [userId]);
  if (existingUser && existingUser.length > 0) {
    const error = new Error("이미 가입된 이용자입니다");
    error.statusCode = 409;
    throw error;
  }
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 이용자 기본 상태값
  const defaultStatus = "READY";

  // DB에 저장할 값 배열
  const values = [
    userId,
    hashedPassword,
    name,
    birthDate, // mapper에서는 birthday
    email,
    phone,
    fullAddress, // mapper에서는 address
    role,
    defaultStatus,
  ];
  // DB 쿼리 실행
  await db.query("signUpUser", values);

  // 성공 응답 데이터 반환
  return {
    message: "회원가입이 완료되었습니다",
    user: { userId, name, email, role },
  };
};

module.exports = {
  register,
  isUserIdCheck,
};
