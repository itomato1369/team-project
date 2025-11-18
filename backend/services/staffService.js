const db = require("../database/mappers/mapper");

// 1. surveySelect: 조사 목록 조회 (피보호자 이름/주소 포함)
const surveySelect = async (req, res) => {
  console.log("Survey List 조회");
  try {
    // sql_queries.js에 새로 추가된 surveyWardJoinSelect 쿼리를 사용
    let result = await db.query("surveyWardJoinSelect", []);
    console.log("Survey List 조회 결과:", result.length, "건");
    res.send(result);
  } catch (error) {
    console.error("surveySelect DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "조사 목록 조회 중 데이터베이스 오류 발생" });
  }
};

// 2. getSurveyDetail: 단일 조사지 상세 정보 조회 (front-end의 Survey 컴포넌트가 호출)
const getSurveyDetail = async (req, res) => {
  console.log(
    "*****************************************\n나는 서베이디테일을 조회할것입니다"
  );
  const { surveyNo } = req.params; // URL 파라미터에서 survey_no를 추출
  console.log(`Survey Detail 조회: surveyNo=${surveyNo}`);

  if (!surveyNo) {
    console.log("번호가없다고합니다.");
    return res.status(400).send({ message: "조사 번호가 필요합니다." });
  }

  try {
    // 상세 조회용 쿼리 이름(예: surveySelectDetail)과 파라미터 전달
    let result = await db.query("wardsearch", surveyNo);
    console.log("DB조회결과************************************\n", result);
    res.send({ result: result });
    // if (result && result.length > 0) {
    //   console.log("Survey Detail 조회 성공:", result[0].survey_no);
    //   res.send(result[0]); // 단일 객체 반환
    // } else {
    //   res.status(404).send({ message: "해당 조사지를 찾을 수 없습니다." });
    // }
  } catch (error) {
    console.error("getSurveyDetail DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "조사 상세 조회 중 데이터베이스 오류 발생" });
  }
};

const supportPlan = async (req, res) => {
  console.log("지원 계획 목록 조회");
  try {
    let result = await db.query("supportPlan", []);
    console.log("지원 계획 목록 조회 성공");
    res.send(result);
  } catch (error) {
    console.error("supportPlan DB 쿼리 실행 오류:", error);
    res
      .status(500)
      .send({ message: "지원 계획 조회 중 데이터베이스 오류 발생" });
  }
};

// 3. wardsearch: 피보호자 상세 정보 조회 (front-end의 ApplicantInfo 컴포넌트가 호출)
const wardsearch = async (req, res) => {
  // URL 파라미터 또는 쿼리에서 ward_no 추출
  const ward_no = req.params.ward_no || req.query.ward_no;
  console.log(`Ward Search 조회: ward_no=${ward_no}`);

  if (!ward_no) {
    return res.status(400).send({ message: "피보호자 번호가 필요합니다." });
  }

  try {
    // wardsearch 쿼리 실행 시 ward_no를 매개변수로 전달
    let result = await db.query("wardsearch", [ward_no]);

    if (result && result.length > 0) {
      console.log("Ward Search 조회 성공:", result[0]["이름"]);
      res.send(result[0]); // 단일 객체 반환
    } else {
      res.status(404).send({ message: "해당 피보호자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("wardsearch DB 쿼리 실행 오류:", error);
    res
      .status(500)
      .send({ message: "피보호자 정보 조회 중 데이터베이스 오류 발생" });
  }
};

const createSupportPlan = async (req, res) => {
  console.log("승인요청 POST 데이터:", req.body);

  const {
    priority_no,
    support_plan_goal,
    business_name,
    spend,
    plan,
    file_no,
    support_plan_status,
  } = req.body;

  if (!support_plan_goal || !business_name) {
    return res.status(400).send({ message: "필수 데이터 누락" });
  }

  try {
    await db.query("spportinsert", [
      priority_no,
      support_plan_goal,
      business_name,
      spend,
      plan,
      file_no,
      support_plan_status,
    ]);

    console.log("지원 계획 INSERT 성공");
    res.send({ message: "승인요청 완료" });
  } catch (error) {
    console.error("createSupportPlan DB 오류:", error);
    res.status(500).send({ message: "지원 계획 등록 실패" });
  }
};

// 6. planItemList: support_plan 테이블에서 상세 항목 조회
const planItemList = async (req, res) => {
  console.log("지원 계획 항목 목록 조회");
  try {
    let result = await db.query("planitemtem", []);
    res.send(result);
  } catch (error) {
    console.error("planItemList DB 쿼리 실행 오류:", error);
    res.status(500).send({ message: "지원 계획 항목 조회 실패" });
  }
};

module.exports = {
  surveySelect,
  getSurveyDetail,
  supportPlan,
  wardsearch,
  createSupportPlan,
  planItemList, // 새로 추가된 함수
};
