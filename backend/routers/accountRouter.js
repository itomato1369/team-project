const express = require("express");
const accountService = require("../services/accountService.js");
const router = express.Router();

// app.js에 "/findaccount" 설정
// 이메일로 아이디 찾기
router.post("/id", async (req, res) => {
  const { name, email } = req.body;
});

module.exports = router;
