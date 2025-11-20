// 비즈니스 로직
const db = require("../database/mappers/mapper.js");
// 동적 쿼리 구성을 위해 베이스 SQL문자열을 가져옴
const sqls = require("../database/sqls/system.js");

// 승인대기 건수
const getApprovalCount = async () => {
  // system.js에서 작성한 쿼리문
  // selectSystem
  const approvalCount = await db.query("selectApprovalCount");
  // 기본값 0
  let total_count = 0;
  // 쿼리 결과에서 실제 건수 (카운트 값)을 추출하여 반환
  if (approvalCount && approvalCount.length > 0) {
    total_count = approvalCount[0].total_count;
  }
  // 값을 반환
  return { total_count: total_count };
};

// 등록된 기관 수
const getInstitutionCount = async () => {
  // system.js에서 작성한 쿼리문
  const institutionCount = await db.query("selectInstitutionCount");
  // 기본값 0
  let total_count = 0;
  // 쿼리 결과에서 실제 등록된 기관 수를 추출하여 반환
  if (institutionCount && institutionCount.length > 0) {
    total_count = institutionCount[0].total_count;
  }
  // 값을 반환
  return { total_count: total_count };
};

// 등록된 공고 수
const getNoticeCount = async () => {
  // system.js에서 작성한 쿼리문
  const noticeCount = await db.query("selectNoticeCount");
  // 기본값 0
  let total_count = 0;
  // 쿼리 결과에서 실제 등록된 공고 개수를 추출하여 반환
  if (noticeCount && noticeCount.length > 0) {
    total_count = noticeCount[0].total_count;
  }
  // 값을 반환
  return { total_count: total_count };
};

// 기관 목록을 가져오기
const getAllInstitutionList = async () => {
  // system.js에서 작성한 쿼리문 가져오기에서 작성한 쿼리문 가져옴
  // "selectInstitutions"와 파라미터 배열을 전달[]
  const institutions = await db.query("selectInstitutions", []);
  return institutions;
};

// institution_no ID로 상세 정보를 가져옴
const getInstitutionById = async (id) => {
  // institution_no를 사용하여 쿼리를 실행
  // system.js에서 작성한 쿼리문 가져오기
  const institution = await db.query("selectInstitutionById", [id]);
  return institution[0];
};

// 조건에 따라 동적으로 SQL을 생성하여 목록 조회 검색기능
const getInstitutionListBySearch = async (status, institution_name) => {
  // 기본 쿼리 문자열 가져오기
  let sql = sqls.selectInstitutions;
  // '?'에 바인딩 할 값 배열
  const values = [];
  // WHERE 절에 들어갈 조건 배열
  const conditions = [];
  // 상태 필터링 조건 추가
  if (status && status !== "0S") {
    conditions.push("status = ?");
    values.push(status);

    // 기관명 검색 조건 추가 LIKE 검색
    if (institution_name && institution_name.trim() !== "") {
      conditions.push("institution_name LIKE ?");
      // LIKE 검색을 위해 '%' 문자를 앞 뒤에 붙임
      values.push(`%${institution_name.trim()}%`);
    }
    // 조건이 하나라도 있다면 WHERE 절을 SQL에 추가
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    // mapper.js의 dynamicQuery 함수를 활용하여 동적 쿼리 실행
    const institutions = await db.dynamicQuery(sql, values);
    return institutions;
  }
};

// 기관 등록
// 파라미터 타입 주의해서 가져오기
const registerInstitution = async (data) => {
  const institutionData = [
    data.institution_name,
    data.phone,
    data.road_address,
    data.detail_address,
    "1s", // 초기 상태를 운영으로 설정
  ];
  // system.js에서 작성한 쿼리문 가져오기
  const result = await db.query("registerInstitution", institutionData);
  // 결과 반환
  return result;
};

// 기관 수정
const updateInstitution = async (id, data) => {
  // system.js에서 작성한 쿼리문 가져오기
  // DB에 전달할 데이터 배열
  const updateData = [data.institution_name, data.phone, data.status, id];
  const result = await db.query("updateInstitution", updateData);
  return result;
};

// 권한 승인 요청한 목록 가져오기
const getApprovalList = async () => {
  // system.js에서 작성한 쿼리문 가져오기
  // "selectApproval"와 파라미터 배열을 전달
  const approvals = await db.query("selectApprovalList", []);
  return approvals;
};

// 공고 페이지 동적으로 목록 조회 검색
const getNoticeBySearch = async (notice_no, institution_name) => {
  // 기본 쿼리 문자열 가져오기
  let sql = sqls.selectNotice;
  // ?에 바인딩할 값 배열
  const values = [];
  // WHERE 절에 들어갈 조건 배열
  const conditions = [];
  // 상태 필터링 조건 추가
  if (support_plan_status && support_plan_status !== "0F") {
    conditions.push("support_plan_status = ?");
    values.push(support_plan_status);
    // 피보호자 검색 조건 추가 LIKE검색
    if (ward_name && ward_name.trim() !== "") {
      conditions.push("ward_name LIKE ?");
      // LIKE 검색을 위해 '%'를 문자 앞 뒤에 붙임
      values.push(`%${ward_name.trim()}%`);
    }
    // 조건에 하나라도 만족하면 WHERE절을 sql에 추가
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    // mapper.js 의 dynamicQuery 함수 활용
    const supportPlans = await db.dynamicQuery(sql, values);
    return supportPlans;
  }
};

// 권한 상태 'READY' => 'ACTIVE'
// user_id를 받아서 승인
const acceptApproval = async (id) => {
  // system.js에서 작성한 쿼리문 가져오기
  const result = await db.query("acceptApproval", [id]);
  // DB 업데이트 결과를 반환
  return result;
};

// 공고 조회
const getAllNoticeList = async () => {
  // sqls의 system.js에서 작성한 쿼리문 가져옴
  // "selectNotice"와 파라미터 배열을 전달[]
  const noticeList = await db.query("selectNotice", []);
  return noticeList;
};

// 공고 상세정보 보기
const getNoticeById = async (id) => {
  // notice_no를 사용하여 쿼리를 실행
  const notice = await db.query("selectedNoticeById", [id]);
  return notice[0];
};

// 새로운 공고 등록
const registerNotice = async (data) => {
  // registerNotice 로 INSERT할 데이터
  const noticeData = [
    data.business_name,
    data.institution_name,
    data.staff_name,
    data.disabled_type,
    data.business_start,
    data.business_end,
    data.content,
    data.budget,
    data.selected_count,
  ];
  // sql system.js에서 작성한 쿼리문 가져옴
  const result = await db.query("registerNotice", noticeData);
  // 결과 반환
  return result;
};

module.exports = {
  getApprovalCount,
  getInstitutionCount,
  getNoticeCount,
  getAllInstitutionList,
  getInstitutionById,
  getInstitutionListBySearch,
  registerInstitution,
  updateInstitution,
  getApprovalList,
  getNoticeBySearch,
  acceptApproval,
  getAllNoticeList,
  getNoticeById,
  registerNotice,
};
