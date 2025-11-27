/**
 * 사용자 ID로 사용자 정보 조회 (로그인 시 비밀번호 검증용)
 * 'role' 컬럼을 'user_role'로 별칭하여 사용합니다.
 */

// ⭐ 기존: survey 테이블의 모든 컬럼을 조회하며, 조사 번호(survey_no)를 기준으로 최신순(내림차순)으로 정렬합니다.
const surveySelect = `
SELECT 
    survey_no, 
    business_name, 
    purpose, 
    content, 
    writer, 
    status, 
    modify_reason, 
    created_at, 
    updated_at
FROM survey
ORDER BY survey_no DESC`;

// ⭐ 추가: survey 테이블과 ward 테이블을 조인하여 목록 조회에 필요한 정보를 포함합니다.
const surveyWardJoinSelect = `
SELECT 
    T1.*, 
    T2.name AS ward_name, 
    T2.address AS ward_address
FROM 
    survey T1
INNER JOIN 
    ward T2 ON T1.ward_no = T2.ward_no
ORDER BY T1.survey_no DESC`;

const supportPlan = `
  SELECT 
      support_plan_no,
      notice_no,
      support_plan_goal AS title,
      staff_name AS writer,
      DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt,
      DATE_FORMAT(support_plan_accepted_at, '%Y-%m-%d') AS requestDate,
      priority_no AS priority,
      support_plan_status AS status
  FROM support_plan
  ORDER BY created_at DESC;
`;

const wardsearch = `
SELECT
    w.name AS '이름',
    w.age AS '나이',
    m.user_name AS '보호자', 
    CASE
        WHEN w.sex = 'MALE' THEN '남'
        WHEN w.sex = 'FEMALE' THEN '여'
        ELSE w.sex
    END AS '성별',
    w.disabled_level AS '장애유형',
    w.address AS '주소',
    w.ward_no AS '피보호자번호'
FROM survey s
INNER JOIN ward w ON s.ward_no = w.ward_no
INNER JOIN member m ON s.writer = m.user_id 
WHERE s.survey_no = ?
`;

const wardno = `SELECT * FROM survey WHERE survey_no = ?`;
//지원계획
const supportinsert = `
INSERT INTO support_plan (
  ward_no,
  notice_no,
  support_plan_goal,
  plan,
  business_name,
  spend,
  file_no,
  support_plan_status,
  staff_name,
  writer_date,
  priority_no
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
`;

/**
 * 담당자 아이디(staff_id)으로 '상담가능' 스케줄 조회
 * - at_no: 삭제 시 필요
 * - staff_id: 본인 확인용
 */
const getAvailableSlots = `
SELECT 
    at_no, 
    start_time, 
    end_time
FROM available_time
WHERE staff_id = ? 
  AND status = '상담가능'
  AND start_time >= NOW()
ORDER BY start_time`;

/**
 * 담당자 ID(staff_id)로 '예약확정'된 상담 건수 조회 (날짜별 그룹)
 */
const getReservationCounts = `
SELECT 
    DATE_FORMAT(res_start, '%Y-%m-%d') AS date, 
    COUNT(*) AS count
FROM reservation
WHERE staff_id = ?
  AND res_status = '예약확정'
  AND res_start >= NOW()
GROUP BY DATE_FORMAT(res_start, '%Y-%m-%d')`;

/**
 * '상담가능' 스케줄 신규 등록
 * - 참고: DB 스키마의 recurring_rules가 CHAR(1)이지만,
 * - 프론트엔드 UI(반복 없음, 매주)와 맞추기 위해 VARCHAR(10)로 가정함.
 */
const createStaffSchedule = `
INSERT INTO available_time (
    start_time, 
    end_time, 
    staff_id, 
    status, 
    recurring_rules,
    created_at
) VALUES (?, ?, ?, '상담가능', ?, NOW())`;

/**
 * '상담가능' 스케줄 삭제
 * - at_no와 staff_id가 모두 일치해야 삭제 (보안)
 */
const deleteStaffSchedule = `
DELETE FROM available_time 
WHERE at_no = ? AND staff_id = ? AND status = '상담가능'`;

//지원결과보고서 작성
const insertsupportresultquery = `
INSERT INTO support_result (
    ward_no,
    support_title,
    support_content,
    support_spend,
    support_plan_no,
    support_started_at,
    support_ended_at
) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

//지원결과보고서 조회
const supportsearch = `
SELECT
  support_result_no,
  support_title,
  support_spend,
  support_started_at,
  support_ended_at,
  support_content
FROM support_result
ORDER BY support_started_at DESC
`;

//지원결과상세값
const supportresultlistinfo = `
SELECT 
    support_content,
    support_title,
    support_spend,
    support_started_at,
    support_ended_at
FROM support_result
WHERE support_result_no = ?`;

//승인조회 정보
const planitem = `SELECT 
  support_plan_no,
  support_plan_goal,
  staff_name,
  created_at,
  writer_date,
  priority_no,
  plan,
  business_name,  
  spend,          
  support_plan_status
FROM support_plan
ORDER BY support_plan_no DESC`;

//담당자승인조회 정보
const Staffplanitem = `SELECT 
  support_plan_no,
  support_plan_goal,
  staff_name,
  created_at,
  writer_date,
  priority_no,
  plan,
  business_name,  
  spend,          
  support_plan_status,
  ward_no
FROM support_plan
WHERE ward_no = ?
ORDER BY support_plan_no DESC`;

//승인상세조회 승인
const updateplanstatus = `
UPDATE support_plan
SET support_plan_status = '승인',
    support_plan_accepted_at = NOW()
WHERE support_plan_no = ?
`;

// 오늘의 상담 일정 개수
const reservationCount = `
SELECT COUNT(*) AS total_count 
FROM reservation 
WHERE staff_id = ? 
  AND res_status = '예약확정'
  AND DATE(res_start) = CURDATE()
`;

// 신규 예약 신청 개수
const newReservationCount = `SELECT COUNT(*) AS total_count FROM reservation WHERE staff_id = ? AND res_status = '예약확정'`;

// 미작성 상담일지 개수
const notCompleteConsultCount = `SELECT COUNT(*) AS total_count FROM consult WHERE staff_id = ? AND consult_status = '진행중';`;

const findWardNoBySurveyNo = `
SELECT ward_no FROM survey WHERE survey_no = ?
`;

const findSurveysByWardNo = `
SELECT survey_no, created_at, business_name FROM survey WHERE ward_no = ? ORDER BY created_at DESC
`;

const getWardDetail = `
SELECT
    name AS '이름',
    age AS '나이',
    m.user_name AS '보호자',
    CASE
        WHEN sex = 'MALE' THEN '남'
        WHEN sex = 'FEMALE' THEN '여'
        ELSE sex
    END AS '성별',
    disabled_level AS '장애유형',
    ward.address AS '주소',
    ward_no AS '피보호자번호'
FROM ward
Join member m
on ward.guardian_id = m.user_id
WHERE ward_no = ?
`;

const supportResultByWardNoSurveyNo = `
SELECT
  support_result_no,
  support_title,
  support_spend,
  support_started_at,
  support_ended_at,
  support_content
FROM support_result
WHERE ward_no = ?
ORDER BY support_started_at DESC
`;

const supportPlanByWardNoSurveyNo = `
SELECT 
  support_plan_no,
  support_plan_goal,
  staff_name,
  created_at,
  writer_date,
  priority_no,
  plan,
  business_name,  
  spend,          
  support_plan_status,
  ward_no
FROM support_plan
WHERE ward_no = ?
ORDER BY support_plan_no DESC`;

const selectnotice = `
SELECT 
    notice_no,
    business_name
FROM notice
WHERE business_name IS NOT NULL
ORDER BY notice_no DESC
`;

const selectresultnotice = `
SELECT DISTINCT
    business_name,
    notice_no,
    support_plan_no
FROM support_plan
WHERE support_plan_status = '승인' and ward_no = ?
`;

/**
 * [신규] 담당자의 예정된 예약 목록 상세 조회 (캘린더용)
 */
const getStaffUpcomingReservations = `
SELECT 
    r.res_no,
    r.res_start,
    r.ward_no,
    w.name AS ward_name
FROM reservation r
JOIN ward w ON r.ward_no = w.ward_no
WHERE r.staff_id = ?
  AND r.res_status = '예약확정'
  AND r.res_start >= NOW()
ORDER BY r.res_start ASC
`;

/**
 * [신규] at_no 기준으로 확정된 예약 건수 조회
 */
const getReservationCountByAtNo = `
SELECT COUNT(*) AS count 
FROM reservation 
WHERE at_no = ? AND res_status = '예약확정'
`;

module.exports = {
  surveySelect,
  surveyWardJoinSelect,
  supportPlan,
  wardsearch,
  wardno,
  supportinsert,
  planitem,
  getAvailableSlots,
  getReservationCounts,
  createStaffSchedule,
  deleteStaffSchedule,
  insertsupportresultquery,
  supportsearch,
  supportresultlistinfo,
  updateplanstatus,
  Staffplanitem,
  reservationCount,
  newReservationCount,
  notCompleteConsultCount,
  findWardNoBySurveyNo,
  findSurveysByWardNo,
  getWardDetail,
  supportPlanByWardNoSurveyNo,
  supportResultByWardNoSurveyNo,
  notCompleteConsultCount,
  selectnotice,
  selectresultnotice,
  getStaffUpcomingReservations,
  getReservationCountByAtNo,
};
