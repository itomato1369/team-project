// vue.js frontend로 부터 HTTP 요청을 받는 역할
// 데이터베이스 로직을 signupService.js로 넘김

const express = require("express");
const signupService = require("../services/signupService.js");
const router = express.Router();

// // POST /signup
router.post("/", async (req, res) => {
  try {
    // body에서 vue.js가 보낸 데이터 추출
    const userData = req.body;
    // 디버깅을 위해 콘솔에 로그를 남김
    console.log("회원가입 요청", { userId: userData.userId });
    // signupService의 signUpUser함수 호출
    const result = await signupService.register(userData);
    // 성공 응답
    res.status(201).json({
      message: result.message,
      user: result.user,
    });
  } catch (err) {
    // 실패 응답
    console.error("signupRouter.js 오류", err.message);
    // 서비스 계층에서 사용자 정의 오류를 던졌을 경우 처리
    const statusCode = err.statusCode || 500;
    const message = err.message || "회원가입 중 signupRouter.js의 에러메세지";
    res.status(statusCode).json({
      error: message,
    });
  }
});

module.exports = router;
