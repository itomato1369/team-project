const db = require("../database/mappers/mapper");

const surveySelect = async (req, res) => {
  console.log("서베이셀렉트 ");
  let result = await db.query("surveySelect", []);
  console.log("여기다, ", result);
  res.send(result);
};

const supportPlan = async (req, res) => {
  console.log("돌겠네");
  try {
    // 쿼리 이름 대신 SQL 문자열 자체를 db.query()에 전달 (db 모듈 설계에 따라 다름)
    let result = await db.query("supportPlan", []);
    console.log("-********************너 정말 핵심****************을 찔렀어");

    res.send(result);
  } catch (error) {
    console.error("DB 쿼리 실행 오류:", error);
    // res.status(500).send({ message: "데이터베이스 오류 발생" });
    res.send({ message: "데이터베이스 오류 발생" });
  }
};

const wardsearch = async (req, res) => {
  try {
    // 쿼리 이름 대신 SQL 문자열 자체를 db.query()에 전달 (db 모듈 설계에 따라 다름)
    let result = await db.query("wardsearch", []);
    res.send(result);
  } catch (error) {
    console.error("DB 쿼리 실행 오류:", error);
    // res.status(500).send({ message: "데이터베이스 오류 발생" });
    res.send({ message: "데이터베이스 오류 발생" });
  }
};

// 날짜 포맷팅 (YYYY-MM-DD) - 타임존 문제 방지
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 시간 포맷팅 (HH:MM)
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * [신규] 1. 담당자 스케줄 조회 (GET /api/staff/schedules)
 * - 인증된 담당자(req.user)의 '상담가능' 슬롯과 '예약건수'를 조합
 */
exports.getSchedules = async (req, res) => {
  // authMiddleware가 주입한 사용자 정보 (가정)
  const staff_id = req.user.id; // 예: 'staff_user_01' (member.user_id)
  const staff_name = req.user.name; // 예: '홍길동' (member.user_name)

  if (!staff_id || !staff_name) {
    return res.status(401).send({ message: "인증 정보가 없습니다." });
  }

  try {
    // 1. '상담가능' 슬롯 조회 (at_no 포함)
    const availableSlots = await db.query("getAvailableSlots", [staff_name]);
    // 2. '예약확정' 건수 조회
    const reservationCounts = await db.query("getReservationCounts", [
      staff_id,
    ]);

    // 3. 프론트엔드가 요구하는 scheduledData 객체로 가공
    const scheduledData = {};

    // 3-1. '상담가능' 슬롯 가공
    availableSlots.forEach((slot) => {
      const dateKey = formatDateISO(new Date(slot.start_time));
      if (!scheduledData[dateKey]) {
        scheduledData[dateKey] = [];
      }

      // 프론트엔드 모달에서 삭제/조회할 수 있도록 at_no와 label 전달
      scheduledData[dateKey].push({
        type: "available",
        label: `${formatTime(slot.start_time)} - ${formatTime(
          slot.end_time
        )} 상담가능`,
        at_no: slot.at_no, // [중요] 삭제 시 사용할 고유 ID
      });
    });

    // 3-2. '예약건수' 가공
    reservationCounts.forEach((item) => {
      const dateKey = item.date; // YYYY-MM-DD
      if (!scheduledData[dateKey]) {
        scheduledData[dateKey] = [];
      }
      scheduledData[dateKey].push({
        type: "reservation",
        label: `${item.count}건 예약`,
      });
    });

    res.status(200).json(scheduledData);
  } catch (error) {
    console.error("스케줄 조회 오류:", error);
    res.status(500).send({ message: "스케줄 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 2. 담당자 스케줄 생성 (POST /api/staff/schedule/create)
 */
exports.createSchedule = async (req, res) => {
  const staff_name = req.user.name; // 인증된 담당자 이름
  const { start_time, end_time, recurring_rules } = req.body;

  if (!start_time || !end_time) {
    return res
      .status(400)
      .send({ message: "시작 시간과 종료 시간이 필요합니다." });
  }

  try {
    const params = [
      start_time,
      end_time,
      staff_name,
      recurring_rules || "none",
    ];

    const result = await db.query("createStaffSchedule", params);

    // 새로 생성된 스케줄 정보 반환 (at_no 포함)
    res.status(201).json({
      message: "스케줄이 성공적으로 등록되었습니다.",
      insertedId: result.insertId,
      at_no: result.insertId, // at_no가 AI PK라고 가정
    });
  } catch (error) {
    console.error("스케줄 생성 오류:", error);
    res.status(500).send({ message: "스케줄 등록 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 3. 담당자 스케줄 삭제 (DELETE /api/staff/schedule/delete/:at_no)
 */
exports.deleteSchedule = async (req, res) => {
  const staff_name = req.user.name; // 인증된 담당자 이름
  const { at_no } = req.params; // URL 파라미터에서 at_no 추출

  if (!at_no) {
    return res.status(400).send({ message: "삭제할 스케줄 ID가 필요합니다." });
  }

  try {
    const result = await db.query("deleteStaffSchedule", [at_no, staff_name]);

    if (result.affectedRows === 0) {
      // 본인 스케줄이 아니거나, 이미 삭제되었거나, '상담가능' 상태가 아님
      return res
        .status(404)
        .send({ message: "스케줄을 찾을 수 없거나 삭제 권한이 없습니다." });
    }

    res.status(200).send({ message: "스케줄이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("스케줄 삭제 오류:", error);
    res.status(500).send({ message: "스케줄 삭제 중 오류가 발생했습니다." });
  }
};

module.exports = {
  surveySelect,
  supportPlan,
};
