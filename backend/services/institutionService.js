// 비즈니스 로직
const db = require("../database/mappers/mapper.js");
// 동적 쿼리 구성을 위해 베이스 SQL문자열을 가져옴
const sqls = require("../database/sqls/institutions.js");

// 기관 목록을 가져오기
const getAllInstitutionList = async () => {
  // sqls의 institutions.js에서 작성한 쿼리문 가져옴
  // "selectInstitutions"와 파라미터 배열을 전달[]
  const institutions = await db.query("selectInstitutions", []);
  return institutions;
};

// institution_no ID로 상세 정보를 가져옴
const getInstitutionById = async (id) => {
  // institution_no를 사용하여 쿼리를 실행
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
// 파라미터 타입 주의해서 가져오기 //교수님이 도와주심
const registerInstitution = async (data) => {
  const institutionData = [
    data.institution_name,
    data.phone,
    data.road_address,
    data.detail_address,
    "1s", // 초기 상태를 운영으로 설정
  ];
  const result = await db.query("registerInstitution", institutionData);
  // 결과 반환
  return result;
};

// 기관 수정
const updateInstitution = async (id, data) => {
  // DB에 전달할 데이터 배열
  const updateData = [data.institution_name, data.phone, data.status, id];
  const result = await db.query("updateInstitution", updateData);
  return result;
};

// 지원계획 관련

module.exports = {
  getAllInstitutionList,
  getInstitutionById,
  getInstitutionListBySearch,
  registerInstitution,
  updateInstitution,
};
