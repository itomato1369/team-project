const express = require("express");
const accountService = require("../services/accountService.js");
const router = express.Router();

// app.js에 "/findaccount" 설정
router.post("/id", async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const result = await accountService.sendUserIdEmail({ name, email, phone });

    if (result) {
      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "회원 정보를 찾을 수 없습니다",
      });
    }
  } catch (error) {
    console.error("accountRouter.js 오류", error);
    res.status(500).json({ success: false, message: "accountRouter.js 오류" });
  }
});

module.exports = router;
