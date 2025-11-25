const express = require("express");
const accountService = require("../services/accountService.js");
const router = express.Router();

// app.js에 "/findaccount" 설정
// 이메일로 아이디 찾기
router.post("/id", async (req, res) => {
  const { name, email, phone } = req.body; // phone도 전달될 수 있으므로 추가

  // 유효성 검사 (최소한 이름과 이메일 또는 전화번호 중 하나는 있어야 함)
  if (!name || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: "이름과 이메일 또는 전화번호를 입력해야 합니다.",
    });
  }
  try {
    const result = await accountService.sendUserIdEmail({ name, email, phone });
    if (result) {
      // 성공적으로 아이디를 찾아 이메일 발송 완료
      return res.json({
        success: true,
        message: "등록된 이메일로 아이디를 발송했습니다.",
      });
    } else {
      // DB에 일치하는 정보가 없거나, 이메일 발송에 실패했을 때
      return res.status(404).json({
        success: false,
        message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("아이디 찾기 중 서버 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
});

module.exports = router;
