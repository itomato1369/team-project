// 비즈니스 로직
const db = require("../database/mappers/mapper.js");
const nodemailer = require("nodemailer");

// 등록된 이메일로 아이디를 전송
const sendUserIdEmail = async ({ name, email, phone }) => {
  console.log(`입력 파라미터 : ${name},${email},${phone}`);
  let rows = [];

  if (email) {
    rows = await db.query("findAccountByEmail", [name, email]);
  } else if (phone) {
    rows = await db.query("findAccountByPhone", [name, email]);
  }

  if (!rows || rows.length === 0) {
    console.log("계정 정보가 없음");
    return false;
  }
  const userId = rows[0].user_id;
  console.log(`사용자 아이디 확인${userId}`);

  // 이메일 발송
  const transporter = nodemailer.createTransport({
    host: "smtp.daum.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.DAUM_EMAIL,
      pass: process.env.DAUM_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.DAUM_EMAIL,
    to: email,
    subject: "회원 아이디 안내",
    text: `회원님의 아이디는 ${userId} 입니다`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("메일 발송 성공", info.response);
    return true;
  } catch (error) {
    console.error("메일 발송 실패", error);
    return false;
  }
};

module.exports = { sendUserIdEmail };
