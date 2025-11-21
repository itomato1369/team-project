const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const db = require("../database/mappers/mapper");

// Google Login
// 1. 구글 로그인 시작을 위한 라우트
router.get("/google", (req, res) => {
  console.log(
    "[AuthRouter] /google: Trying to redirect to Google. Client ID:",
    process.env.GOOGLE_CLIENT_ID
  ); // 디버깅 로그
  // Google OAuth 2.0 인증 페이지로 리디렉션
  const googleLoginRedirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=email profile`;
  res.redirect(googleLoginRedirectUrl);
});

// 2. 구글 로그인 콜백 처리를 위한 라우트
router.get("/google/callback", authService.googleCallback);

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log(`data : ${userId}, ${password}`);

    const { jsonResponse } = await authService.login(userId, password);
    console.log("dd: ", jsonResponse);

    res.status(200).json(jsonResponse);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// POST /auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Refresh token is required in body." });
    }

    const { jsonResponse } = await authService.refresh(refreshToken);

    res.status(200).json(jsonResponse);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// [신규] 소셜 로그인 추가 정보 제출

router.post("/complete-profile", authService.completeSocialSignup);

// [제거] /auth/logout

// 로그아웃은 이제 클라이언트(localStorage)에서 100% 처리되므로

// 백엔드 엔드포인트가 불필요합니다。

// GET /auth/me (인증 확인 및 사용자 정보)
// (이 파일은 변경 없음, Bearer 토큰을 이미 검사함)
router.get("/me", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await db.query("findUserById", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];
    res.status(200).json({
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.email,
        role: user.user_role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
