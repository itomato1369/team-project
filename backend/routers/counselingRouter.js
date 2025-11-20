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

/**
 * 3.상담 일지 목록 조회 (GET /api/counseling/logs)
 * - 쿼리 파라미터: searchType, keyword, searchDate
 */
router.get("/logs", verifyAccessToken, counselingService.getConsultList);

// 4. 상세 조회 (GET /api/counseling/logs/:logId)
router.get("/logs/:consultNo", verifyAccessToken, counselingService.getDetail);

/**
 * 5. 조사지목록 조회 (GET /api/surveys/:wardId)
 */

router.get(
  "/surveys/:wardNo",
  verifyAccessToken,
  counselingService.getSurveysByWard
);

module.exports = router;
