// 비즈니스 로직
const db = require("../database/mappers/mapper.js");
// 동적 쿼리 구성을 위해 베이스 SQL문자열을 가져옴
const sqls = require("../database/sqls/account.js");
const nodemailer = require("nodemailer");

// 등록된 이메일로 아이디를 전송
const sendUserIdEmail = async ({ name, email, phone }) => {
  let rows;

  if (email) {
    rows = await db.query("findAccountByEmail", [name, email]);
  } else if (phone) {
    rows = await db.query("findAccountByPhone", [name, email]);
  }

  if (!rows || rows.length === 0) return false;

  const userId = rows[0].user_id;

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
    text: `회원님의 아이디는 ${user_id} 입니다`,
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
