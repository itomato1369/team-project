// 데이터 베이스 로직을 institutionService.js로 넘긴다
// vue.js frontend로 부터 HTTP 요청을 받는 역할

const express = require("express");
// 비즈니스 로직을 가져옴
const institutionService = require("../services/institutionService.js");
const approvalService = require("../services/approvalService.js");
const router = express.Router();

// 권한 승인 목록을 조회는 GET방식 순서 중요함 구체적인 경로를 맨위에
// app.js 에서 이미 "/institution을 설정함
router.get("/approval", async (req, res) => {
  console.log("systemRouter /approval요청 도착");
  try {
    const list = await approvalService.getApprovalList();
    res.status(200).json(list);
  } catch (error) {
    console.error("systemRouter.js error", error);
    res.status(500).json({ message: "권한승인 목록 실패" });
  }
});

// 지원계획 목록 조회
router.get("/supportplan", async (req, res) => {
  console.log("systemRouter /supportplan요청 도착");
  try {
    // 검색필터링
    const status = req.query.status;
    const institution_name = req.query.institution_name;
    // institutionService.js에서 동적 검색함수 호출
    const supportList = await institutionService.getSupportPlanList(
      status,
      institution_name
    );
    res.status(200).json(supportList);
  } catch (error) {
    console.error("systemRouter.js /supportplan 오류", error);
    res.status(500).json({ message: "지원계획 조회 실패" });
  }
});

// 기관 등록 POST
router.post("/register", async (req, res) => {
  console.log("systemRouter.js /register 확인");
  try {
    // vue에서 보낸 기관 정보를 받음
    const institutionData = req.body;
    // institutionService.js로 전달
    const result = await institutionService.registerInstitution(
      institutionData
    );
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
    // institutionService.js의 함수를 호출
    const institution = await institutionService.getInstitutionById(id);

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
    // institutionService.js로 넘김
    const result = await institutionService.updateInstitution(
      id,
      institutionData
    );
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
// app.js 에서 이미 "/institution"을 설정했음
router.get("/", async (req, res) => {
  console.log("systemRouter /institutions 요청 도착");
  try {
    const list = await institutionService.getAllInstitutionList();
    res.status(200).json(list);
  } catch (error) {
    console.error("systemRouter.js error", error);
    res.status(500).json({ message: "기관 목록 조회 실패" });
  }
});

module.exports = router;
