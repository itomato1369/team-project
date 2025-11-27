/**
 * [수정] 예약 가능한 슬롯 조회 (JOIN으로 staff_id 확보)
 */
const getAvailableSchedules = `
SELECT
    at.at_no,
    m.user_id AS staff_id,
    at.start_time,
    at.end_time
FROM available_time at
JOIN member m ON at.staff_id = m.staff_id
WHERE at.status = '상담가능'
  AND at.end_time > NOW()
ORDER BY at.start_time`;

/**
 * [신규] 확정된 예약 슬롯 조회 (필터링용)
 */
const getUpcomingReservations = `
SELECT res_start
FROM reservation
WHERE res_status = '예약확정'
AND res_start > NOW()`;

/**
 * [수정] at_no로 staff_id 조회 (JOIN으로 staff_id 확보)
 */
const getStaffIdByAtNo = `
SELECT m.user_id AS staff_id
FROM available_time at
JOIN member m ON at.staff_id = m.user_id
WHERE at.at_no = ?`;

/**
 * [수정] reservation 테이블에 예약 정보 삽입
 * - `consult_category` 컬럼 및 값 제거
 */
const createReservation = `
INSERT INTO reservation (
    user_id, staff_id, ward_no,
    res_start, res_end, res_reason, at_no,
    res_status, created_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, '예약확정', NOW())`;

/**
 * [수정] user_id로 나의 모든 예약 내역 조회
 * - `consult_category`가 제거되었으므로, '상담유형(type)'을 정적 값('미지정')으로 반환
 */
const getMyReservations = `
SELECT
    r.res_no AS id,
    DATE_FORMAT(r.res_start, '%Y년 %m월 %d일 %H:%i') AS dateTime,
    IFNULL(m.user_name, '담당자 미지정') AS staff,
    '미지정' AS type,
    r.res_status AS status
FROM reservation r
LEFT JOIN member m ON r.staff_id = m.user_id
WHERE r.user_id = ?
ORDER BY r.res_start ASC;
`;

/**
 * [신규] user_id와 res_no로 예약을 '취소' 상태로 변경
 */
const cancelReservationById = `
UPDATE reservation
SET res_status = '취소'
WHERE res_no = ? AND user_id = ?;
`;

// --- [신규 추가] 담당자 예약 관리 SQL ---

// 기본 쿼리 (검색 조건 없음)
const getStaffReservationsBase = `
SELECT
    at.at_no AS atNo,
    at.start_time,
    res.res_status AS status,
    res.res_no AS id, 
    res.user_id,
    res.res_reason AS reason,            -- (수정) reservation.res_reason
    m.user_name AS applicantName,     -- (수정) member.user_name (보호자)
    res.ward_no AS wardNo,           -- (수정) reservation.ward_no (피보호자)
    w.name AS wardName
    FROM available_time at
JOIN reservation res ON at.at_no = res.at_no
JOIN member m ON res.user_id = m.user_id
JOIN ward w ON w.guardian_id = m.user_id
WHERE
    at.staff_id = ? AND at.status = '예약확정'
ORDER BY at.start_time ASC
`;

// '상담일시' 검색
const getStaffReservationsByDate = `
${getStaffReservationsBase.replace("ORDER BY at.start_time ASC", "")}
AND DATE(at.start_time) BETWEEN ? AND ?
ORDER BY at.start_time ASC
`;

// '보호자이름' 검색 (m.user_name)
const getStaffReservationsByApplicant = `
${getStaffReservationsBase.replace("ORDER BY at.start_time ASC", "")}
AND m.user_name LIKE ?
ORDER BY at.start_time ASC
`;

// '사유' 검색 (res.res_reason)
const getStaffReservationsByReason = `
${getStaffReservationsBase.replace("ORDER BY at.start_time ASC", "")}
AND res.res_reason LIKE ?
ORDER BY at.start_time ASC
`;

/**
 * 담당자가 예약을 취소 (상태를 '상담불가'로 변경)
 * - at_no와 staff_id이 일치하고, '예약' 상태일 때만
 */
const cancelStaffReservation = `
UPDATE available_time
SET status = '상담불가'
WHERE at_no = ? AND staff_id = ? AND status = '예약'
`;

/**
 * [신규 추가] 예약 생성 시 'available_time' 테이블의 상태를 '예약'으로 변경
 * - at_no를 기준으로 '상담가능' 상태일 때만 '예약'으로 변경 (중복 예약 방지)
 */
const updateAvailableTimeStatusToBooked = `
UPDATE available_time
SET status = '예약'
WHERE at_no = ? AND status = '상담가능'
`;

/**
 * [신규] 알림(alarm) 테이블에 알림 삽입
 */
const createAlarm = `
INSERT INTO alarm (
    content, to_id, from_id, status, res_no, created_at, read_yn
) 
VALUES (?, ?, ?, ?, ?, NOW(), 0)
`;

/**
 * [신규] 상담 일지 등록 (consult 테이블)
 * - content, consult_datetime, ward_no, ward_name, staff_id, consult_status, disabled_level
 */
const createConsultationLog = `
INSERT INTO consult (
    staff_id,
    ward_no,
    guardian_id,
    consult_datetime,
    disabled_level,
    consult_status,
    content,
    survey_no,
    res_no
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const getSurveysByWard = `
SELECT
    survey_no,
    ward_no,
    business_name
FROM survey
WHERE ward_no = ?;
`;

/**
 * [상태변경] 예약확정 -> 상담완료
 */
const updateReservationToBooked = `
UPDATE reservation
SET res_status = '상담완료'
WHERE res_no = ?
`;

/**
 * 상담 일지 목록 조회 (기본 - 담당자 기준 전체, 최신순)
 * consult(c), member(m:보호자), ward(w:피보호자), survey(s:조사지) 조인
 */
const getConsultBase = `
SELECT 
    c.consult_no,
    c.consult_datetime,
    c.consult_status,
    c.content,
    m.user_name AS guardian_name,
    w.name AS ward_name,
    IFNULL(s.business_name, '일반 상담') AS survey_type
FROM consult c
LEFT JOIN member m ON c.guardian_id = m.user_id
JOIN ward w ON c.ward_no = w.ward_no
LEFT JOIN survey s ON c.survey_no = s.survey_no
WHERE c.staff_id = ?
ORDER BY c.consult_datetime DESC
`;

/**
 * 상담 일지 검색 - 보호자명 (guardian_name)
 */
const getConsultByGuardian = `
SELECT 
    c.consult_no,
    c.consult_datetime,
    c.consult_status AS status,
    c.content,
    m.user_name AS guardian_name,
    w.name AS ward_name,
    IFNULL(s.business_name, '일반 상담') AS survey_type
FROM consult c
LEFT JOIN member m ON c.guardian_id = m.user_id
JOIN ward w ON c.ward_no = w.ward_no
LEFT JOIN survey s ON c.survey_no = s.survey_no
WHERE c.staff_id = ? AND m.user_name LIKE ?
ORDER BY c.consult_datetime DESC
`;

/**
 * 상담 일지 검색 - 피보호자명 (ward_name)
 */
const getConsultByWard = `
SELECT 
    c.consult_no,
    c.consult_datetime,
    c.consult_status AS status,
    c.content,
    m.user_name AS guardian_name,
    w.name AS ward_name,
    IFNULL(s.business_name, '일반 상담') AS survey_type
FROM consult c
LEFT JOIN member m ON c.guardian_id = m.user_id
JOIN ward w ON c.ward_no = w.ward_no
LEFT JOIN survey s ON c.survey_no = s.survey_no
WHERE c.staff_id = ? AND w.name LIKE ?
ORDER BY c.consult_datetime DESC
`;

/**
 * 상담 일지 검색 - 상담일시 (Date)
 * 입력된 날짜(YYYY-MM-DD)에 해당하는 기록 조회
 */
const getConsultByDate = `
SELECT 
    c.consult_no,
    c.consult_datetime,
    c.consult_status AS status,
    c.content,
    m.user_name AS guardian_name,
    w.name AS ward_name,
    IFNULL(s.business_name, '일반 상담') AS survey_type
FROM consult c
LEFT JOIN member m ON c.guardian_id = m.user_id
JOIN ward w ON c.ward_no = w.ward_no
LEFT JOIN survey s ON c.survey_no = s.survey_no
WHERE c.staff_id = ? AND DATE(c.consult_datetime) = ?
ORDER BY c.consult_datetime DESC
`;

const getConsultLogDetail = `
SELECT 
    c.consult_no,
    c.consult_datetime,
    c.consult_status,
    c.content,
    c.disabled_level,
    c.staff_id,
    c.ward_no,
    c.guardian_id,
    c.survey_no,
    c.res_no,
    m_staff.user_name AS staff_name,
    m_guard.user_name AS guardian_name,
    w.name AS ward_name,
    s.business_name AS survey_name
FROM consult c
LEFT JOIN member m_staff ON c.staff_id = m_staff.user_id
LEFT JOIN member m_guard ON c.guardian_id = m_guard.user_id
LEFT JOIN ward w ON c.ward_no = w.ward_no
LEFT JOIN survey s ON c.survey_no = s.survey_no
WHERE c.consult_no = ?
`;

/**
 * 6. 상담 일지 수정 (내용, 상태, 장애등급)
 */
const updateConsult = `
UPDATE consult
SET 
    content = ?,
    consult_status = ?,
    disabled_level = ?
WHERE consult_no = ?
`;

/**
 * [신규] 조사지 상태 변경
 */
const updateSurveyStatus = `
UPDATE survey
SET status = '심사중'
WHERE survey_no = ?
`;

module.exports = {
  getAvailableSchedules,
  getUpcomingReservations,
  getStaffIdByAtNo,
  createReservation,
  getMyReservations,
  cancelReservationById,
  getStaffReservationsBase,
  getStaffReservationsByDate,
  getStaffReservationsByApplicant,
  getStaffReservationsByReason,
  cancelStaffReservation,
  updateAvailableTimeStatusToBooked,
  createAlarm,
  createConsultationLog,
  getSurveysByWard,
  updateReservationToBooked,
  getConsultBase,
  getConsultByGuardian,
  getConsultByWard,
  getConsultByDate,
  getConsultLogDetail,
  updateConsult,
  updateSurveyStatus,
};
