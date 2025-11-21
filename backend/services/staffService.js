const db = require("../database/mappers/mapper");

exports.getStaffPlanItems = async (req, res) => {
  const ward_no = req.query.ward_no;

  if (!ward_no) {
    return res
      .status(400)
      .send({ message: "피보호자 번호(ward_no)가 필요합니다." });
  }

  try {
    // Staffplanitem 쿼리 사용
    const result = await db.query("Staffplanitem", [ward_no]);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .send({ message: "해당 보호자의 승인 내역이 없습니다." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("getStaffPlanItems DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "담당자 승인 조회 중 오류가 발생했습니다." });
<<<<<<< HEAD
=======
  }
};
>>>>>>> e032e9b0439b4d3d31ef38d8a480348c3147e2df
// 오늘의 상담 건수 조회
exports.getTodayConsultCount = async (req, res) => {
  try {
    // 로그인 된 staff_id
    const staff_id = req.user.id;

    if (!staff_id) {
      return res.status(401).json({ message: "로그인 정보가 없습니다" });
    }
    let result = await db.query("consultCount", [staff_id]);
    const count = result[0]?.consult_count || 0;
    res.status(200).json({ consultCount: count });
  } catch (error) {
    console.error("상담 건수 조회 오류", error);
    res.status(500).json({ message: "상담 건수 조회 실패" });
  }
};

exports.surveySelect = async (req, res) => {
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
exports.getSurveyDetail = async (req, res) => {
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
    res.send({ result: result }); // if (result && result.length > 0) { //   console.log("Survey Detail 조회 성공:", result[0].survey_no); //   res.send(result[0]); // 단일 객체 반환 // } else { //   res.status(404).send({ message: "해당 조사지를 찾을 수 없습니다." }); // }
  } catch (error) {
    console.error("getSurveyDetail DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "조사 상세 조회 중 데이터베이스 오류 발생" });
  }
};

// ⭐ 수정: supportPlan 함수가 이제 'planitem' 쿼리를 사용합니다.
exports.supportPlan = async (req, res) => {
  console.log("지원 계획 목록 조회 (planitem 쿼리 사용)");
  try {
    // ⭐ 'supportPlan' 쿼리 대신 'planitem' 쿼리를 사용하여 필요한 모든 필드 조회
    let result = await db.query("planitem", []);
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
exports.wardsearch = async (req, res) => {
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

exports.createSupportPlan = async (req, res) => {
  console.log("승인요청 POST 데이터:", req.body); // Vue 컴포넌트에는 없는 필수 필드에 대한 임시 또는 기본값 설정
  const priority_no = 1; // 🚨 임시값 1로 고정합니다. (실제 폼에서 입력받는 기능이 없으므로)

  const {
    ward_no,
    support_plan_goal,
    plan,
    business_name,
    spend,
    file_no,
    support_plan_status,
    staff_name,
    writer_date,
  } = req.body;

  const safe_spend = parseInt(spend.toString().replace(/,/g, "")) || 0;
  const safe_file_no = file_no || null;

  if (!support_plan_goal || !business_name || !plan) {
    return res
      .status(400)
      .send({ message: "필수 데이터(목표, 사업명, 내용) 누락" });
  }

  try {
    // 🔑 쿼리가 요구하는 7개의 파라미터만 정확히 전달
    await db.query("supportinsert", [
      ward_no,
      support_plan_goal,
      plan,
      business_name,
      spend,
      file_no,
      support_plan_status,
      staff_name,
      writer_date,
    ]);

    console.log("지원 계획 INSERT 성공 (파라미터 7개 사용)");
    res.send({ message: "승인요청 완료" });
  } catch (error) {
    console.error("createSupportPlan DB 쿼리 오류:", error);
    res.status(500).send({ message: "지원 계획 등록 실패" });
  }
};

exports.createSupportResult = async (req, res) => {
  try {
    const {
      support_title,
      support_content,
      support_spend,
      support_started_at,
      support_ended_at,
    } = req.body;

    console.log("프론트에서 전달한 지원결과서 요청값: ", req.body);
    // 필수 값 체크
    if (!support_title) {
      console.log("이게뭔데: ", !support_title);
      console.log("이건누군데", support_title);
      return res.status(400).json({ message: "지원 제목은 필수입니다." });
    }

    // 안전한 날짜 변환 함수
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return null; // Invalid Date 방지
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} 00:00:00`;
    };

    const params = [
      support_title,
      support_content || null,
      Number(String(support_spend || 0).replace(/[^0-9]/g, "")),
      formatDate(support_started_at),
      formatDate(support_ended_at),
    ];

    // SQL 쿼리 실행 (support_plan_no 제거)
    let result = await db.query("insertsupportresultquery", params);

    res.json({ message: "등록 성공", resultId: result.insertId });
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ message: "서버 오류", error });
  }
};

exports.supportResultSearch = async (req, res) => {
  try {
    // db.query가 배열을 반환하는지, 단일 객체를 반환하는지 상관없이 안전하게 처리
    let rows = await db.query("supportsearch", []);

    // rows가 배열인지 확인, 아니면 배열로 감싸기
    if (!Array.isArray(rows)) {
      rows = rows ? [rows] : [];
    }

    res.json(rows);
  } catch (err) {
    console.error("지원결과 조회 오류:", err);
    res.status(500).json({ error: "지원결과 조회 실패" });
  }
};
// 특정 지원 결과 상세 조회
exports.getSupportResultDetail = async (req, res) => {
  const { support_result_no } = req.params;

  if (!support_result_no) {
    return res.status(400).send({ message: "지원 결과 번호가 필요합니다." });
  }

  try {
    // DB에서 단일 지원 결과 조회
    let result = await db.query("supportresultlistinfo", [support_result_no]);

    if (result && result.length > 0) {
      res.json(result[0]); // 단일 객체 반환
    } else {
      res.status(404).send({ message: "해당 지원 결과를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("getSupportResultDetail DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "지원 결과 조회 중 데이터베이스 오류 발생" });
  }
};
//승인
exports.approveSupportPlan = async (req, res) => {
  const { support_plan_no } = req.params;

  try {
    const result = await db.query("updateplanstatus", [support_plan_no]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "해당 지원 계획을 찾을 수 없습니다." });
    }

    res.json({ message: "승인 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "승인 중 오류 발생" });
  }
};
// 6. planItemList: support_plan 테이블에서 상세 항목 조회
// ⭐ 삭제: supportPlan 함수가 planitem을 사용하게 되었으므로 이 함수는 제거합니다.
/*
exports.planItemList = async (req, res) => {
  console.log("지원 계획 항목 목록 조회");
  try {
    let result = await db.query("planitemtem", []); // 오타: planitemtem
    res.send(result);
  } catch (error) {
    console.error("planItemList DB 쿼리 실행 오류:", error);
    res.status(500).send({ message: "지원 계획 항목 조회 실패" });
  }
};
*/

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
    const availableSlots = await db.query("getAvailableSlots", [staff_id]); // 2. '예약확정' 건수 조회
    const reservationCounts = await db.query("getReservationCounts", [
      staff_id,
    ]); // 3. 프론트엔드가 요구하는 scheduledData 객체로 가공

    const scheduledData = {}; // 3-1. '상담가능' 슬롯 가공

    availableSlots.forEach((slot) => {
      const dateKey = formatDateISO(new Date(slot.start_time));
      if (!scheduledData[dateKey]) {
        scheduledData[dateKey] = [];
      } // 프론트엔드 모달에서 삭제/조회할 수 있도록 at_no와 label 전달

      scheduledData[dateKey].push({
        type: "available",
        label: `${formatTime(slot.start_time)} - ${formatTime(
          slot.end_time
        )} 상담가능`,
        at_no: slot.at_no, // [중요] 삭제 시 사용할 고유 ID
      });
    }); // 3-2. '예약건수' 가공

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
  const staff_id = req.user.id; // 인증된 담당자 ID
  const { start_time, end_time, recurring_rules } = req.body;

  if (!start_time || !end_time) {
    return res
      .status(400)
      .send({ message: "시작 시간과 종료 시간이 필요합니다." });
  }

  try {
    // recurring_rules를 DB 스키마(CHAR(1))에 맞게 변환
    const recurringRulesMap = {
      none: "N",
      weekly: "W",
      weekdays: "D",
    };
    const recurring_rule_char =
      recurringRulesMap[recurring_rules] || recurringRulesMap["none"]; // --- 반복 날짜 생성 로직 ---

    const datesToInsert = [];
    const baseStartDate = new Date(start_time);
    const baseEndDate = new Date(end_time);

    if (recurring_rules === "none") {
      datesToInsert.push({ start: baseStartDate, end: baseEndDate });
    } else {
      const recurrenceEndDate = new Date(baseStartDate);
      recurrenceEndDate.setMonth(recurrenceEndDate.getMonth() + 3); // 3개월 후까지 반복

      let currentDate = new Date(baseStartDate);
      const dayOfWeek = baseStartDate.getDay(); // 0=일, 1=월, ..., 6=토

      while (currentDate <= recurrenceEndDate) {
        const currentDayOfWeek = currentDate.getDay();

        if (recurring_rules === "weekly") {
          if (currentDayOfWeek === dayOfWeek) {
            const newStartDate = new Date(currentDate);
            newStartDate.setHours(
              baseStartDate.getHours(),
              baseStartDate.getMinutes(),
              baseStartDate.getSeconds()
            );

            const newEndDate = new Date(currentDate);
            newEndDate.setHours(
              baseEndDate.getHours(),
              baseEndDate.getMinutes(),
              baseEndDate.getSeconds()
            );

            datesToInsert.push({ start: newStartDate, end: newEndDate });
          }
        } else if (recurring_rules === "weekdays") {
          if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
            // 월요일부터 금요일
            const newStartDate = new Date(currentDate);
            newStartDate.setHours(
              baseStartDate.getHours(),
              baseStartDate.getMinutes(),
              baseStartDate.getSeconds()
            );

            const newEndDate = new Date(currentDate);
            newEndDate.setHours(
              baseEndDate.getHours(),
              baseEndDate.getMinutes(),
              baseEndDate.getSeconds()
            );

            datesToInsert.push({ start: newStartDate, end: newEndDate });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } // --- 반복 날짜 생성 로직 끝 --- // 생성된 모든 날짜에 대해 DB에 INSERT
    for (const datePair of datesToInsert) {
      const params = [
        datePair.start, // Date 객체
        datePair.end, // Date 객체
        staff_id,
        recurring_rule_char,
      ];
      await db.query("createStaffSchedule", params);
    }

    res.status(201).json({
      message: "스케줄이 성공적으로 등록되었습니다.",
      count: datesToInsert.length, // 몇 건이 등록되었는지 정보 제공
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
  const staff_id = req.user.id; // 인증된 담당자 ID
  const { at_no } = req.params; // URL 파라미터에서 at_no 추출

  if (!at_no) {
    return res.status(400).send({ message: "삭제할 스케줄 ID가 필요합니다." });
  }

  try {
    const result = await db.query("deleteStaffSchedule", [at_no, staff_id]);

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

// --- [신규 추가] 담당자 예약 관리 ---

/**
 * [신규] 4. 담당자 예약 목록 조회 (GET /api/staff/reservations)
 * - (요구사항 1, 2)
 */
exports.getStaffReservations = async (req, res) => {
  const staff_id = req.user.id; // 인증된 담당자 ID
  const { searchType, startDate, endDate, keyword } = req.query;

  if (!staff_id) {
    return res.status(401).send({ message: "인증 정보가 없습니다." });
  }

  try {
    const queryParams = [staff_id];
    let queryName = "getStaffReservationsBase"; // 기본 쿼리 // 검색 조건에 따라 쿼리 이름과 파라미터 동적 변경

    if (searchType === "date" && startDate && endDate) {
      queryName = "getStaffReservationsByDate";
      queryParams.push(startDate, endDate);
    } else if (searchType === "applicant" && keyword) {
      queryName = "getStaffReservationsByApplicant";
      queryParams.push(`%${keyword}%`);
    } else if (searchType === "reason" && keyword) {
      queryName = "getStaffReservationsByReason";
      queryParams.push(`%${keyword}%`);
    }

    const reservations = await db.query(queryName, queryParams);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("담당자 예약 목록 조회 오류:", error);
    res.status(500).send({ message: "예약 목록 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 5. 담당자 예약 취소 (POST /api/staff/reservations/cancel/:at_no)
 * - (요구사항 3)
 */
exports.cancelStaffReservation = async (req, res) => {
  const staff_id = req.user.id; // 인증된 담당자 ID
  const { at_no } = req.params;

  if (!at_no) {
    return res
      .status(400)
      .send({ message: "취소할 예약 ID(at_no)가 필요합니다." });
  }
  if (!staff_id) {
    return res.status(401).send({ message: "인증 정보가 없습니다." });
  }

  try {
    const result = await db.query("cancelStaffReservation", [at_no, staff_id]);

    if (result.affectedRows === 0) {
      // 본인 스케줄이 아니거나, '예약' 상태가 아님
      return res
        .status(404)
        .send({ message: "취소할 예약을 찾을 수 없거나 권한이 없습니다." });
    } // (중요) TODO: (요구사항 3) 신청자(사용자)에게 취소 알림 전송 로직

    console.log(
      `(Notification) at_no: ${at_no} 예약이 담당자에 의해 취소됨. 사용자에게 알림 전송 필요.`
    );

    res.status(200).send({ message: "예약이 성공적으로 취소되었습니다." });
  } catch (error) {
    console.error("담당자 예약 취소 오류:", error);
    res.status(500).send({ message: "예약 취소 중 오류가 발생했습니다." });
  }
};

