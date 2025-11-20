const express = require("express");
const router = express.Router();
const consultService = require("../services/consultService");
const userService = require("../services/userService");
// const { verifyAccessToken } = require('../middleware/authMiddleware');

// router.use(verifyAccessToken);

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

// Called by: src/views/UserDashboard.vue
router.get("/userwiter-survey", async (req, res) => {
  const { userId } = req.query; // inquiry writer, PK
  if (!userId) {
    return res.status(400).send({ err: "Writer query parameter is required." });
  }
  let survey = [];
  try {
    survey = await userService.getSurveyToUserWard(userId);
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

// Called by: src/components/UserNotice.vue
router.get("/user-surveys", async (req, res) => {
  const { writer } = req.query;
  if (!writer) {
    return res.status(400).send({ err: "Writer query parameter is required." });
  }
  let surveys = [];
  console.log("user-surveys 호출: ");
  try {
    surveys = await userService.getUserSurveys(writer);
  } catch (err) {
    return res.status(500).send({ err: "Failed to get user surveys: " + err });
  }
  res.status(200).send({ result: surveys });
});

// Called by: src/components/UserInquiry.vue
router.get("/user-inquiries", async (req, res) => {
  let inquiries = [];
  try {
    inquiries = await userService.getInquiries();
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get user inquiries: " + err });
  }
  res.status(200).send({ result: inquiries });
});

// Called by: src/components/UserInquiryDetail.vue, src/components/SurveyDetail.vue
router.get("/user-inquiries/:id", async (req, res) => {
  console.log("조사지 입력페이지로 야무지게 이동해야쥐.");
  const inquiryNo = req.params.id;
  let inquiryDetail = null;
  try {
    inquiryDetail = await userService.getInquiryDetail(inquiryNo);
    if (!inquiryDetail) {
      return res.status(404).send({ message: "Inquiry not found." });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get inquiry detail: " + err });
  }
  console.log("내가 받아먹을 res는 뭐하는 res일까?", inquiryDetail);
  res.status(200).send({ result: inquiryDetail });
});

// Called by: src/components/UserInquiryDetail.vue, src/components/SurveyDetail.vue
router.get("/user-inquiries/:id/questions", async (req, res) => {
  const inquiryNo = req.params.id;
  try {
    const questions = await userService.getInquiryQuestions(inquiryNo);
    res.status(200).send({ result: questions });
  } catch (err) {
    return res.status(500).send({ err: "Failed to get questions: " + err });
  }
});

// Called by: src/components/UserInquiryDetail.vue, src/components/SurveyDetail.vue
router.post("/user-inquiries/answer", async (req, res) => {
  const saveData = req.body;

  if (!saveData || !saveData.answers || !saveData.inquiryDetail) {
    return res.status(400).send({ err: "Invalid data format." });
  }

  try {
    await userService.saveInquiryAnswers(saveData);
    res.status(201).send({ message: "Answers saved successfully." });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to save answers: " + err.message });
  }
});

router.get("/my-page-surveys", async (req, res) => {
  const { writer } = req.query;
  if (!writer) {
    return res.status(400).send({ err: "Writer query parameter is required." });
  }
  try {
    const surveys = await userService.getMyPageSurveys(writer);
    res.status(200).send({ result: surveys });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get my-page surveys: " + err.message });
  }
});

// Called by: src/components/UserInquiryDetail.vue, src/components/SurveyDetail.vue
router.put("/survey-results/:surveyNo", async (req, res) => {
  const { surveyNo } = req.params;
  const updateData = req.body;

  if (
    !updateData ||
    !updateData.answers ||
    !Array.isArray(updateData.answers)
  ) {
    return res.status(400).send({ err: "Invalid data format." });
  }

  try {
    await userService.updateSurveyAndResults(surveyNo, updateData);
    res.status(200).send({ message: "Survey updated successfully." });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to update survey: " + err.message });
  }
});

// Called by: src/components/UserInquiryDetail.vue, src/components/SurveyDetail.vue
router.get("/survey-results/:surveyNo", async (req, res) => {
  const { surveyNo } = req.params;
  try {
    const results = await userService.getSurveyResults(surveyNo);
    res.status(200).send({ result: results });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get survey results: " + err.message });
  }
});

// Called by: src/components/UserInquiryDetail.vue, src/components/SurveyDetail.vue
router.post("/survey-by-inquiry-content", async (req, res) => {
  const { inquiryName } = req.body;
  if (!inquiryName) {
    return res.status(400).send({ err: "inquiryName is required." });
  }
  try {
    const survey = await userService.getSurveyByInquiryContent(inquiryName);
    res.status(200).send({ result: survey });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get survey: " + err.message });
  }
});

router.get("/users/by-institution", async (req, res) => {
  const { institution_no } = req.query;
  if (!institution_no) {
    return res
      .status(400)
      .send({ err: "institution_no query parameter is required." });
  }
  try {
    const users = await userService.getUsersByInstitution(institution_no);
    res.status(200).send({ result: users });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get users by institution: " + err.message });
  }
});

// D:\Dev\git\team-project\frontend\src\views  UserMyPage.vue -> UserWardInfoUpdate.vue
router.get("/wards", async (req, res) => {
  const { guardianId } = req.query;
  if (!guardianId) {
    return res
      .status(400)
      .send({ err: "guardianId query parameter is required." });
  }
  try {
    const wards = await userService.getWardsByGuardianId(guardianId);
    res.status(200).send({ result: wards });
  } catch (err) {
    res.status(500).send({ err: "Failed to get wards: " + err.message });
  }
});

// D:\Dev\git\team-project\frontend\src\views  UserMyPage.vue -> UserWardInfoInsert.vue
router.post("/wards", async (req, res) => {
  try {
    const result = await userService.addWard(req.body);
    res.status(201).send({ result });
  } catch (err) {
    res.status(500).send({ err: "Failed to add ward: " + err.message });
  }
});

router.put("/wards/:ward_no", async (req, res) => {
  const { ward_no } = req.params;
  try {
    const result = await userService.updateWard(ward_no, req.body);
    res.status(200).send({ result });
  } catch (err) {
    res.status(500).send({ err: "Failed to update ward: " + err.message });
  }
});

router.put("/institution/:institutionNo/status", async (req, res) => {
  try {
    const { institutionNo } = req.params;
    const statusData = req.body;
    const result = await userService.updateInstitutionStatus(
      institutionNo,
      statusData
    );
    if (result.affectedRows > 0) {
      res.status(200).send({ message: "Institution status updated." });
    } else {
      res.status(404).send({ message: "Institution not found." });
    }
  } catch (err) {
    res
      .status(500)
      .send({ err: "Failed to update institution status: " + err.message });
  }
});

// My Info Management Routes
router.get("/institution-info/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const institutionInfo = await userService.getInstitutionInfo(userId);
    if (!institutionInfo) {
      return res.status(404).send({ message: "Institution info not found." });
    }
    res.status(200).send({ result: institutionInfo });
  } catch (err) {
    res
      .status(500)
      .send({ err: "Failed to get institution info: " + err.message });
  }
});

router.get("/me", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res
      .status(400)
      .send({ err: "username query parameter is required." });
  }
  try {
    const user = await userService.getUserByUserId(userId);
    // console.log("userRouter가 반환하는 user는?", user);
    res.status(200).send({ result: user });
  } catch (err) {
    res.status(500).send({ err: "Failed to get user info: " + err.message });
  }
});

router.put("/me", async (req, res) => {
  const { userId, ...userData } = req.body;
  if (!userId) {
    return res.status(400).send({ err: "userId is required." });
  }
  try {
    await userService.updateUserInfo(userId, userData);
    res.status(200).send({ message: "User info updated successfully." });
  } catch (err) {
    res.status(500).send({ err: "Failed to update user info: " + err.message });
  }
});

router.put("/password", async (req, res) => {
  const { userId, ...passwordData } = req.body;
  if (!userId) {
    return res.status(400).send({ err: "userId is required." });
  }
  try {
    await userService.changePassword(userId, passwordData);
    res.status(200).send({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).send({ err: "Failed to change password: " + err.message });
  }
});

router.get("/institutions", async (req, res) => {
  try {
    const institutions = await userService.getAllInstitutions();
    res.status(200).send({ result: institutions });
  } catch (err) {
    res.status(500).send({ err: "Failed to get institutions: " + err.message });
  }
});

router.post("/apply-institution", async (req, res) => {
  const { userId, institutionNo } = req.body;
  if (!userId || !institutionNo) {
    return res
      .status(400)
      .send({ err: "userId and institutionNo are required." });
  }
  try {
    await userService.applyToInstitution(userId, institutionNo);
    res.status(200).send({ message: "Application successful." });
  } catch (err) {
    res
      .status(500)
      .send({ err: "Failed to apply to institution: " + err.message });
  }
});

// Called by: src/views/UserSupportPlanDetail.vue
router.get("/support-plan", async (req, res) => {
  // const { inquiry_no, ward_no } = req.params;
  try {
    const supportPlan = await userService.getSupportPlanDetail(req.query);
    if (!supportPlan) {
      return res.status(404).send({ message: "Support plan not found." });
    }
    res.status(200).send({ result: supportPlan });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Failed to get support plan detail: " + err.message });
  }
});

module.exports = router;
