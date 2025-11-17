const express = require("express");
const router = express.Router();
const consultService = require("../services/consultService");
const userService = require("../services/userService");
// const authMiddleware = require('../middleware/authMiddleware'); // [참고] 실제로는 로그인 인증 필요

// GET /api/schedule/available : 예약 가능한 모든 날짜/시간 조회
router.get("/schedule/available", consultService.getAvailableSchedules);

// [추가] POST /api/schedule/reserve : 신규 상담 예약 생성
// [참고] 실제로는 authMiddleware를 추가하여 로그인한 사용자만 접근하도록 해야 합니다.
// router.post('/reserve', authMiddleware, scheduleService.createReservation);
router.post("/schedule/reserve", consultService.createReservation);

// GET /api/reservations/my : 나의 상담 내역 조회 (UI 연동)
// (라우터 파일의 prefix가 /api 라면, 실제 경로는 /api/reservations/my)
router.get("/reservations/my", consultService.getMyReservations);

// POST /api/reservations/cancel/:res_no : 나의 상담 예약 취소 (UI 연동)
// (실제 경로는 /api/reservations/cancel/123)
router.post("/reservations/cancel/:res_no", consultService.cancelMyReservation);

// 일반 이용자 로그인 페이지에서 출력되는 마감 임박 공고 목록 조회.(데이터부족으로 2년치 조회 쿼리문으로 사용 중.)
router.get("/user-notices", async (req, res) => {
  let nowNotices = [];
  try {
    nowNotices = await userService.getExpiringNotices();
  } catch (err) {
    res.send({ err: "userServices Err: " + err });
  }
  res.status(200).send({ result: nowNotices });
});

router.get("/userwiter-survey", async (req, res) => {
  // req에서 받은 userName을 서비스로 전달
  let survey = [];
  try {
    // 임시로 "test" 사용자명 사용
    survey = await userService.getSurveyToUserWard("test");
  } catch (err) {
    res.send({ err: "userwiter-survey Err: " + err });
  }
  res.send({ result: survey });
});

router.get("/user-board", async (req, res) => {
  console.log("user-board query is called");
  const { term, type } = req.query;
  let boardList = await userService.getBoardList({ term, type });
  res.send({ result: boardList });
});

router.get("/user-surveys", async (req, res) => {
  let surveys = [];
  console.log("user-surveys 호출: ");
  try {
    // TODO: 추후 실제 로그인된 사용자 정보로 변경 필요
    surveys = await userService.getUserSurveys("test");
  } catch (err) {
    return res.status(500).send({ err: "Failed to get user surveys: " + err });
  }
  res.status(200).send({ result: surveys });
});

router.get("/user-inquiries", async (req, res) => {
  let inquiries = [];
  try {
    inquiries = await userService.getInquiries();
  } catch (err) {
    return res.status(500).send({ err: "Failed to get user inquiries: " + err });
  }
  res.status(200).send({ result: inquiries });
});

module.exports = router;
