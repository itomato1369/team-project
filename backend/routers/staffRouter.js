const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리
const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴
const staffService = require("../services/staffService.js");
// [신규] 인증 미들웨어 임포트
const { verifyAccessToken } = require("../middleware/authMiddleware");

router.get("/", staffService.surveySelect);

// wardsearch
router.get("/wardsearch", staffService.wardsearch);

// 1. 담당자 스케줄 조회 (캘린더 로드 시)
// (경로: /api/staff/schedules)
router.get("/schedules", verifyAccessToken, staffService.getSchedules);

// 2. 담당자 스케줄 생성 (모달 '적용' 버튼)
// (경로: /api/staff/schedule/create)
router.post("/schedule/create", verifyAccessToken, staffService.createSchedule);

// 3. 담당자 스케줄 삭제 (모달 '삭제' 버튼)
// (경로: /api/staff/schedule/delete/123)
router.delete(
  "/schedule/delete/:at_no",
  verifyAccessToken,
  staffService.deleteSchedule
);

// 담당자 예약 관리 (ReservationManagement.vue 연동)
/**
 * 4. 담당자 예약 목록 조회 (GET /api/staff/reservations)
 * - (요구사항 1, 2)
 */
router.get(
  "/reservations",
  verifyAccessToken,
  staffService.getStaffReservations
);

/**
 * 5. 담당자 예약 취소 (POST /api/staff/reservations/cancel/:res_no)
 * - (요구사항 3)
 */
router.post(
  "/reservations/cancel/:res_no",
  verifyAccessToken,
  staffService.cancelStaffReservation
);
// 실제 라우팅 등록 영역
// 해당 javascript 파일의 마지막 코드, 모듈화
// 위에 선언한 기능(변수, 함수 등)들 중 외부로 노출할 대상을 설정
// => 다른 파일에서 require()을 통해 가져옴

// 오늘의 상담 일정 개수
router.get(
  "/todays-count",
  verifyAccessToken,
  staffService.getReservationCount
);

// 신규 예약 신청 개수
router.get(
  "/reservations/new-count",
  verifyAccessToken,
  staffService.getNewReservationCount
);

// 미작성 상담일지 개수
router.get(
  "/reservations/pending-count",
  verifyAccessToken,
  staffService.getPendingReportsCount
);

//지원계획신청 데이터불러오기
router.get("/support-plan", staffService.supportPlan);

// 지원계획 추가
router.post("/support-plan", staffService.createSupportPlan);

// 지원 결과 추가
router.post("/support-result", staffService.createSupportResult);

// 지원 결과 목록 조회
router.get("/support-result", staffService.supportResultSearch);

// [신규] 필터링된 지원 결과서 조회
router.get(
  "/support-result/filtered",
  staffService.supportResultByWardSurveyNo
);

// [신규] 지원 결과 승인 및 지원 계획 상태 '지원종료'로 변경
router.post(
  "/support-result/approve",
  staffService.approveSupportResult
);

// 지원 결과 상세 조회 ← 여기 추가
router.get(
  "/support-result/:support_result_no",
  staffService.getSupportResultDetail
);

// [신규] 필터링된 지원 계획서 조회
router.get("/support-plan/filtered", staffService.supportPlanByWardSurveyNo);

router.get("/staff-plan-items", staffService.getStaffPlanItems);

// 설문 조회
router.get("/survey-select", staffService.surveySelect);

// surveyNo로 ward_no를 찾고, 해당 ward_no에 속한 모든 survey 목록 반환
router.get("/surveys-by-ward/:surveyNo", staffService.getSurveysByWard);

// 사업 조회
router.get("/ApplicationPlanForm", staffService.getNoticeList);

//상태를 승인으로 변경
router.post(
  "/support-plan/SupportPlanDetail/:support_plan_no",
  staffService.approveSupportPlan
);

// 특정 설문 상세 조회
router.get("/:surveyNo", staffService.getSurveyDetail);

// wardId로 피보ho자 상세 정보 조회
router.get("/ward-info/:wardId", staffService.getWardInfo);

router.get("/survey/:wardId", staffService.getApprovedBusinessNames);

module.exports = router;
