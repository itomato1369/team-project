// instituion 테이블에서 기관 정보를 가져옴

const selectInstitutions = {
  selectInstitutions: `SELECT institution_no, institution_name, phone, road_address, status FROM institution`,

  // 기관 상세보기 페이지
  selectInstitutionById: `SELECT institution_no, institution_name, phone, road_address, detail_address, status, updated_at, closed_at FROM institution WHERE institution_no = ?`,

  // 기관 등록 //교수님이 도와주심
  registerInstitution: `INSERT INTO institution (institution_name, phone, road_address, detail_address, status)
  VALUES(?, ?, ?, ?, ?)`,

  // 기관 수정
  updateInstitution: `UPDATE institution SET institution_name = ?, phone = ?, status = ?, updated_at = NOW() WHERE institution_no = ?`,

  // 지원 계획 조회
  selectSupportPlans: `SELECT support_plan_goal, institution_name, ward_name, support_plan_status, created_at FROM support_plan`,
};

module.exports = selectInstitutions;
