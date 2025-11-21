// instituion 테이블에서 기관 정보를 가져옴

const selectInstitutions = {
  // 승인 대기 건수
  selectApprovalCount: `SELECT COUNT(*) AS total_count FROM member m INNER JOIN institution i ON m.institution_no = i.institution_no WHERE m.status = 'READY'`,

  // 등록된 기관 수
  selectInstitutionCount: `SELECT COUNT (*) AS total_count FROM institution`,

  // 등록된 공고 개수
  selectNoticeCount: `SELECT COUNT(*) AS total_count FROM notice`,

  // 등록된 기관 조회
  selectInstitutions: `SELECT institution_no, institution_name, phone, road_address, status FROM institution`,

  // 기관 상세보기 페이지
  selectInstitutionById: `SELECT institution_no, institution_name, phone, road_address, detail_address, status, updated_at, closed_at FROM institution WHERE institution_no = ?`,

  // 새로운 기관 등록
  registerInstitution: `INSERT INTO institution (institution_name, phone, road_address, detail_address, status)
  VALUES(?, ?, ?, ?, ?)`,

  // 기관 수정
  updateInstitution: `UPDATE institution SET institution_name = ?, phone = ?, status = ?, updated_at = NOW() WHERE institution_no = ?`,

  // 권한 승인 목록 institution_no로 INNER JOIN
  selectApprovalList: `SELECT m.user_id, m.user_name, m.role, m.created_at, m.status, i.institution_no, i.institution_name FROM member m
  INNER JOIN institution i ON m.institution_no = i.institution_no
  WHERE m.status = 'READY' AND m.institution_no IS NOT NULL`,

  // 권한 승인 상태 'READY' => 'ACTIVE'
  acceptApproval: `UPDATE member SET status = 'ACTIVE' WHERE user_id = ?`,

  // 등록된 공고 조회
  selectNotice: `SELECT notice_no, institution_name, staff_name, disabled_type, business_name, business_start FROM notice`,

  // 새로운 공고 등록하기
  registerNotice: `INSERT INTO notice (business_name, institution_name, staff_name, disabled_type, business_start, business_end, content, budget, selected_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

  // 공고 상세보기
  selectedNoticeById: `SELECT notice_no, institution_name, staff_name, disabled_type, business_name, business_start, business_end, content, budget, selected_count FROM notice WHERE notice_no = ?`,
};
module.exports = selectInstitutions;
