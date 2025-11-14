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
JOIN member m ON at.staff_id = m.user_id AND m.role = 'STAFF'
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
JOIN member m ON at.staff_id = m.user_id AND m.role = 'STAFF'
WHERE at.at_no = ?`;

/**
 * [수정] reservation 테이블에 예약 정보 삽입
 * - `consult_category` 컬럼 및 값 제거
 */
const createReservation = `
INSERT INTO reservation (
    user_id, staff_id, name,
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

module.exports = {
  getAvailableSchedules,
  getUpcomingReservations,
  getStaffIdByAtNo,
  createReservation,
  getMyReservations,
  cancelReservationById,
};
