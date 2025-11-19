// 데이터 베이스 로직을 institutionService.js로 넘긴다
// vue.js frontend로 부터 HTTP 요청을 받는 역할

const express = require("express");
// 비즈니스 로직을 가져옴
const systemService = require("../services/systemService.js");
const router = express.Router();

// 시스템 관리자 메인 권한 승인 건수
router.get("/approval/count", systemService.getApprovalCount);

// 권한 승인 목록을 조회는 GET방식 순서 중요함 구체적인 경로를 맨위에
// app.js 에서 이미 "/institutions을 설정함
router.get("/approval", async (req, res) => {
  console.log("systemRouter /approval요청 도착");
  try {
    const list = await systemService.getApprovalList();
    res.status(200).json(list);
  } catch (error) {
    console.error("systemRouter.js error", error);
    res.status(500).json({ message: "권한승인 목록 실패" });
  }
});

// 권한 상태 'READY' => 'ACTIVE' 1j
// patch를 사용한 이유는 부분 수정에 가장 적합하기 때문
// GET 조회 POST 생성 PUT 전체 수정 혹은 대체
router.patch("/approval/:id", async (req, res) => {
  try {
    console.log(`systemRouter.js /approval${req.params.id}도착`);
    // URL 에서 user_id를 추출
    const id = req.params.id;
    // 유효성 검사
    if (!id) {
      return res.status(400).json({
        error: "Bad Request",
        message: "member테이블의 user_id가 누락",
      });
    }
    // systemService.js의 acceptApproval 함수 호출
    const result = await systemService.acceptApproval(id);
    // 결과 응답 (DB에서 변경된 행이 1개 이상이면)
    if (result && result.affectedRows > 0) {
      return res.status(200).json({
        message: `${id}의 권한 요청이 승인되었습니다`,
      });
    } else if (result && result.affectedRows === 0) {
      // 이미 처리된 경우
      return res.status(404).json({
        error: "Not Found",
        message: `이미 처리된 요청입니다`,
      });
    }
  } catch (error) {
    console.error("systemRouter.js 권한 승인 오류", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "권한 승인 오류",
    });
  }
});

// 공고 목록 조회
router.get("/notices", async (req, res) => {
  console.log("systemRouter /notices 요청 도착");
  try {
    // 검색필터링
    const status = req.query.status;
    const institution_name = req.query.institution_name;
    // systemService.js에서 동적 검색함수 호출
    const noticeList = await systemService.getAllNoticeList(institution_name);
    res.status(200).json(noticeList);
  } catch (error) {
    console.error("systemRouter.js /noticeList 오류", error);
    res.status(500).json({ message: "공고 조회 실패" });
  }
});

// 공고 등록
router.post("/notices/register", async (req, res) => {
  console.log("systemRouter /notices/register 요청 도착");
  try {
    // vue에서 보낸 공고 등록 정보를 받음
    const noticeData = req.body;
    // systemService.js로 전달
    const result = await systemService.registerNotice(noticeData);
    res.status(201).json({
      message: "공고 등록 성공",
      data: result,
    });
  } catch (error) {
    console.error("systemRouter.js 공고 등록 오류", error);
    res.status(500).json({ message: "공고 등록 오류" });
  }
});

// 기관 등록 POST
router.post("/register", async (req, res) => {
  console.log("systemRouter.js /register 확인");
  try {
    // vue에서 보낸 기관 정보를 받음
    const institutionData = req.body;
    // systemService.js로 전달
    const result = await systemService.registerInstitution(institutionData);
    res.status(201).json({
      message: "기관 등록 성공",
      data: result,
    });
  } catch (error) {
    console.error("systemRouter.js 기관등록 오류", error);
    res.status(500).json({ message: "기관등록 오류" });
  }
});

// (GET /:id)
router.get("/:id", async (req, res) => {
  try {
    // URL 에서 ID 파라미터를 가져옴
    const id = req.params.id;
    // isystemService.js의 함수를 호출
    const institution = await systemService.getInstitutionById(id);

    if (institution) {
      res.status(200).json(institution);
    } else {
      res.status(404).json({ message: "해당 기관의 정보가 없습니다" });
    }
  } catch (error) {
    console.error("systemRouter.js 기관상세조회 에러", error);
    res.status(500).json({ message: "기관상세조회 에러" });
  }
});
// 기관 정보 수정하는 PUT
router.put("/:id", async (req, res) => {
  console.log(`systemRouter /institutions/${req.params.id} 확인`);
  try {
    // URL 파라미터에서 기관 ID 가져옴
    const id = req.params.id;
    // 수정된 데이터 가져옴
    const institutionData = req.body;
    // systemService.js로 넘김
    const result = await systemService.updateInstitution(id, institutionData);
    // 성공 응답
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "기관 정보 수정 성공" });
    } else {
      res.status(404).json({ message: `${id}해당 기관이 없음` });
    }
  } catch (error) {
    console.error("systemRouter.js 기관 정보 수정 에러", error);
    res.status(500).json({ message: "기관 정보 수정 에러" });
  }
});

// 목록 조회는 GET방식
// app.js 에서 이미 "/institutions"을 설정했음
router.get("/", async (req, res) => {
  console.log("systemRouter /institutions 요청 도착");
  try {
    const list = await systemService.getAllInstitutionList();
    res.status(200).json(list);
  } catch (error) {
    console.error("systemRouter.js error", error);
    res.status(500).json({ message: "기관 목록 조회 실패" });
  }
});

module.exports = router;
