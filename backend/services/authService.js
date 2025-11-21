const db = require("../database/mappers/mapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("qs");

// [DB 스키마 기반]
const findUserById = async (userId) => {
  return await db.query("findUserById", [userId]);
};

// 토큰 생성 (동일)
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.user_id,
      role: user.user_role,
      name: user.user_name,
      institution: user.institution_no,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// [수정] 로그인 서비스 (로그 추가)
const login = async (userId, password) => {
  // 1. 사용자 조회
  const users = await db.query("findUserById", [userId]);
  if (users.length === 0) {
    // [로그 추가] 실패 원인 1
    console.warn(
      `[AuthService] Login Failed: User not found (userId: ${userId})`
    );
    throw new Error("User not found");
  }
  const user = users[0];
  console.log("[AuthService] User found:", user);
  console.log(
    "[AuthService] DB password hash length:",
    user.password?.length || "N/A"
  );

  // [추가] DB에 비밀번호가 없는 경우에 대한 방어 코드
  if (!user.password) {
    console.warn(
      `[AuthService] Login Failed: Password not set for user (userId: ${userId})`
    );
    throw new Error("Invalid credentials"); // 보안을 위해 동일한 에러 메시지 사용
  }

  // 2. 비밀번호 검증
  console.log(
    `[AuthService] DEBUG: Comparing password. Type: ${typeof password}, Value: '${password}'`
  );
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    // [로그 추가] 실패 원인 2
    console.warn(
      `[AuthService] Login Failed: Invalid credentials (userId: ${userId})`
    );
    throw new Error("Invalid credentials");
  }

  // [로그 추가] 로그인 성공
  console.log(
    `[AuthService] Login Success: Tokens generated (userId: ${userId})`
  );

  const { accessToken, refreshToken } = generateTokens(user);
  console.log("토큰값: ", accessToken, refreshToken);

  const userResponse = {
    id: user.user_id,
    name: user.user_name,
    email: user.email,
    role: user.user_role,
    institution: user.institution_no,
  };

  return {
    jsonResponse: { user: userResponse, accessToken, refreshToken },
  };
};

// [수정] 토큰 갱신 서비스 (로그 추가)
const refresh = async (refreshTokenFromBody) => {
  if (!refreshTokenFromBody) {
    // [로그 추가]
    console.warn("[AuthService] Refresh Failed: No refresh token provided.");
    throw new Error("No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshTokenFromBody,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    // [로그 추가]
    console.warn(
      "[AuthService] Refresh Failed: Invalid or expired refresh token."
    );
    throw new Error("Invalid or expired refresh token");
  }

  const users = await db.query("findUserById", [decoded.id]);
  if (users.length === 0) {
    // [로그 추가]
    console.warn(
      `[AuthService] Refresh Failed: User not found (userId: ${decoded.id})`
    );
    throw new Error("User not found");
  }
  const user = users[0];

  const newAccessToken = jwt.sign(
    { id: user.user_id, role: user.user_role, name: user.user_name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // [로그 추가]
  console.log(
    `[AuthService] Refresh Success: New AT generated (userId: ${decoded.id})`
  );
  return {
    jsonResponse: { accessToken: newAccessToken },
  };
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code is required");
  }

  try {
    // 1. 인증 코드로 구글에서 토큰 받기
    let tokenResponse;
    try {
      tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/auth/google/callback",
      });
    } catch (error) {
      console.error(
        "[AuthService] Step 1 Failed: Error exchanging token with Google."
      );
      throw error;
    }

    const { access_token } = tokenResponse.data;

    // 2. 받은 토큰으로 사용자 정보 가져오기
    let userInfoResponse;
    try {
      userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
    } catch (error) {
      console.error(
        "[AuthService] Step 2 Failed: Error fetching user info from Google."
      );
      throw error;
    }

    const { email, name, id: googleId } = userInfoResponse.data;

    // 3. DB에서 이메일로 사용자 확인
    let users;
    let isNewUser = false;
    try {
      users = await db.query("findUserByEmail", [email]);
    } catch (error) {
      console.error(
        "[AuthService] Step 3 Failed: Error finding user by email."
      );
      throw error;
    }

    // 4. 사용자가 없으면 새로 생성
    if (!users || users.length === 0) {
      isNewUser = true;
      console.log(
        `[AuthService] New Google user: ${email}. Creating new user.`
      );
      try {
        await db.query("createSocialUser", [email, name, email, googleId]);
        users = await db.query("findUserByEmail", [email]);
      } catch (error) {
        console.error(
          "[AuthService] Step 4 Failed: Error creating social user."
        );
        throw error;
      }
    }

    const user = users[0];

    // 5. 추가 정보가 필요한지 확인 (신규 사용자 또는 기존 사용자지만 정보가 없는 경우)
    const needsAdditionalInfo = isNewUser || !user.birthday; // 생년월일 정보가 없으면 추가 정보 필요

    if (needsAdditionalInfo) {
      console.log(`[AuthService] User ${user.user_id} needs additional info.`);
      // 임시 가입 토큰 생성 (유효시간 10분)
      const signupToken = jwt.sign(
        { id: user.user_id, name: user.user_name, email: user.email },
        process.env.SIGNUP_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      // 추가 정보 입력 페이지로 리디렉션
      return res.redirect(
        `http://localhost:5173/auth/additional-info?signupToken=${signupToken}`
      );
    }

    // 6. 추가 정보가 필요 없는 기존 사용자 -> 바로 로그인
    console.log(
      `[AuthService] Existing Google user ${user.user_id} logged in.`
    );
    const { accessToken, refreshToken } = generateTokens(user);
    res.redirect(
      `http://localhost:5173/login-success?token=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    console.error(
      "[AuthService] Google callback error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("소셜 로그인 중 오류가 발생했습니다.");
  }
};

const completeSocialSignup = async (req, res) => {
  const { signupToken, birthDate, phone, fullAddress } = req.body;

  if (!signupToken) {
    return res.status(401).json({ message: "No signup token provided." });
  }

  try {
    // 1. 임시 가입 토큰 검증
    const decoded = jwt.verify(signupToken, process.env.SIGNUP_TOKEN_SECRET);
    const userId = decoded.id;

    // 2. 추가 정보 DB에 저장 (UPDATE)
    const params = [birthDate, phone, fullAddress, userId];
    await db.query("updateSocialUser", params);

    // 3. 최종 로그인을 위한 사용자 정보 다시 조회
    const users = await db.query("findUserById", [userId]);
    if (users.length === 0) {
      throw new Error("User not found after update.");
    }
    const user = users[0];

    // 4. 최종 JWT 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user);

    // 5. 토큰 및 사용자 정보 반환
    res.status(200).json({
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.email,
        role: user.user_role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired signup token." });
    }
    console.error("[AuthService] completeSocialSignup error:", error);
    res.status(500).json({ message: "Failed to complete signup." });
  }
};

module.exports = {
  login,
  refresh,
  googleCallback,
  completeSocialSignup,
};
