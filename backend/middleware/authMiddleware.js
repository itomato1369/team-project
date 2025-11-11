const jwt = require("jsonwebtoken");

/**
 * Access Token (Bearer)을 검증하는 미들웨어
 */
const verifyAccessToken = (req, res, next) => {
  // 1. Authorization 헤더에서 토큰 추출
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format." });
  }
  const token = authHeader.split(" ")[1];

  // 2. 토큰 검증
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // 요청 객체에 디코딩된 사용자 정보(payload) 저장
    next();
  } catch (err) {
    // 3. 토큰 만료 또는 오류
    return res
      .status(401)
      .json({ message: "Invalid or expired access token." });
  }
};

module.exports = {
  verifyAccessToken,
};
