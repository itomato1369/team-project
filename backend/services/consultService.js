const db = require("../database/mappers/mapper"); // (경로는 실제 환경에 맞게 조정)

// (formatToTime, formatDateToISO 함수는 변경 없음... 생략)
function formatToTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * [v15 수정] 30분 단위 시간 슬롯 생성 (예약된 슬롯 필터링)
 * (변경 없음)
 */
module.exports.getAvailableSchedules = async (req, res) => {
  console.log("--- getAvailableSchedules Service ---");
  try {
    // 1. 상담가능 블록 조회
    const schedules = await db.query("getAvailableSchedules");
    console.log("DB Result (getAvailableSchedules):", schedules);

    // 2. [신규] 이미 예약된 슬롯 조회
    const existingReservations = await db.query("getUpcomingReservations");
    const reservedSlots = new Set(
      existingReservations.map((r) => new Date(r.res_start).toISOString())
    );
    console.log("Existing Reserved Slots (ISO):", reservedSlots);

    const formattedSchedules = {};
    const thirtyMinutes = 30 * 60 * 1000; // 30분을 밀리초로

    schedules.forEach((slot) => {
      const startDate = slot.start_time;
      const endDate = slot.end_time;

      console.log(
        `Processing block at_no ${slot.at_no}: ${startDate} to ${endDate}`
      );

      let currentTime = new Date(startDate.getTime());

      while (currentTime < endDate) {
        const isoTimestamp = currentTime.toISOString();
        const dateKey = formatDateToISO(currentTime);
        const timeStr = formatToTime(currentTime);

        if (!reservedSlots.has(isoTimestamp)) {
          const timeObj = {
            time: timeStr,
            at_no: slot.at_no,
            staff_id: slot.staff_id,
            start_time_stamp: isoTimestamp,
          };

          if (!formattedSchedules[dateKey]) {
            formattedSchedules[dateKey] = [];
          }
          formattedSchedules[dateKey].push(timeObj);
        }
        currentTime = new Date(currentTime.getTime() + thirtyMinutes);
      }
    });

    console.log("Formatted Response:", formattedSchedules);
    res.status(200).json(formattedSchedules);
  } catch (error) {
    console.error("스케줄 조회 오류:", error);
    res.status(500).send({ message: "스케줄 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [수정] 신규 상담 예약을 생성
 */
module.exports.createReservation = async (req, res) => {
  console.log("--- createReservation Service ---");

  try {
    const { at_no, start_time_stamp, name, res_reason } = req.body;

    console.log("Request Payload:", req.body);

    const user_id = "test"; // (임시 하드코딩)

    if (!at_no || !start_time_stamp) {
      return res.status(400).send({
        message: "필수 정보(at_no, start_time_stamp)가 누락되었습니다.",
      });
    }
    // 1. staff_id 조회
    console.log(`Executing Query: getStaffIdByAtNo with at_no = ${at_no}`);
    const staffResult = await db.query("getStaffIdByAtNo", [at_no]);

    if (!staffResult || staffResult.length === 0) {
      console.warn("Staff ID not found for at_no:", at_no); // [신규] 롤백 로직 (선점한 슬롯 다시 '상담가능'으로)

      return res
        .status(404)
        .send({ message: "유효하지 않은 예약 블록입니다." });
    }
    const staff_id = staffResult[0].staff_id;
    console.log("Found staff_id:", staff_id);

    // 2. res_start, res_end 계산
    const res_start = new Date(start_time_stamp);
    const res_end = new Date(res_start.getTime() + 30 * 60 * 1000);

    // 3. [수정] reservation 테이블 삽입
    // `consult_category`를 params에서 제거
    const params = [
      user_id,
      staff_id,
      name || "김밥", // (임시 - 실제로는 authStore 등에서 가져와야 함)
      res_start,
      res_end,
      res_reason || "",
      at_no,
    ];

    console.log(`Executing Query: createReservation with params:`, params);
    const insertResult = await db.query("createReservation", params);
    const newResNo = insertResult.insertId; // 방금 생성된 res_no

    // 5. [신규] 알림(alarm) 생성 (담당자에게)
    if (newResNo) {
      // 4. [신규] available_time 테이블의 상태를 '예약'으로 변경
      await db.query("updateAvailableTimeStatusToBooked", [at_no]);
      console.log(`Available time status updated to '예약' for at_no ${at_no}`);
      // [수정] 쿼리 이름을 사용하도록 변경
      console.log(`Executing Query: createAlarm for res_no ${newResNo}`);

      console.log(
        `Executing Query: updateAvailableTimeStatusToBooked for at_no ${at_no}`
      );
      await db.query("createAlarm", [
        `[신규 예약] ${name || "홍길동"} 님의 상담 예약이 신청되었습니다.`, // content
        staff_id, // to_id (담당자)
        user_id, // from_id (신청자)
        "예약확정", // status
        newResNo, // res_no
      ]);
      console.log(`Alarm created for res_no ${newResNo}`);
    }
    console.log("Reservation successful (slot reserved).");
    res.status(201).send({ message: "상담 예약이 완료되었습니다." });
  } catch (error) {
    console.error("예약 생성 오류:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .send({ message: "이미 예약된 시간이거나 처리 중복 오류입니다." });
    }
    res.status(500).send({ message: "예약 처리 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 나의 상담 내역 조회
 * (변경 없음)
 */
module.exports.getMyReservations = async (req, res) => {
  console.log("--- getMyReservations Service ---");
  try {
    const user_id = "test"; // (임시)

    const reservations = await db.query("getMyReservations", [user_id]);
    console.log("DB Result (getMyReservations):", reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("나의 예약 조회 오류:", error);
    res.status(500).send({ message: "예약 조회 중 오류가 발생했습니다." });
  }
};

/**
 * 상담 예약 취소
 */
module.exports.cancelMyReservation = async (req, res) => {
  console.log("--- cancelMyReservation Service ---");
  try {
    const { res_no } = req.params;
    const user_id = "test"; // (임시)

    const result = await db.query("cancelReservationById", [res_no, user_id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ message: "예약을 찾을 수 없거나 취소 권한이 없습니다." });
    }

    console.log(`Slot for res_no ${res_no} reverted to '상담가능'.`);
    res.status(200).send({ message: "예약이 취소되었습니다." });
  } catch (error) {
    console.error("예약 취소 오류:", error);
    res.status(500).send({ message: "예약 취소 중 오류가 발생했습니다." });
  }
};
