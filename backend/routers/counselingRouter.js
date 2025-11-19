const express = require("express");
const router = express.Router();

// 서비스 로직 임포트
const counselingService = require("../services/counselingService.js");
// 인증 미들웨어 임포트
const { verifyAccessToken } = require("../middleware/authMiddleware");

/**
 * 1. 상담 일지 등록 (POST /api/counseling/logs)
 */
router.post("/logs", verifyAccessToken, counselingService.createLog);

/**
 * 2. 상담 일지 임시저장 (POST /api/counseling/logs/draft)
 */
router.post("/logs/draft", verifyAccessToken, counselingService.saveDraft);

module.exports = router;
