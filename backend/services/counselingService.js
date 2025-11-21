const db = require("../database/mappers/mapper");
const sqlList = require("../database/sqlList");

module.exports.createLog = async (req, res) => {
  console.log("--- createLog Service ---");
  const connection = await db.connectionPool.getConnection(); // 변경
  try {
    const {
      staff_id,
      ward_no,
      guardian_id,
      consult_datetime,
      disabled_level,
      consult_status,
      content,
      survey_no,
      res_no,
    } = req.body;

    console.log("Request Payload:", req.body);

    // 필수 값 검증
    if (!staff_id || !ward_no || !content) {
      return res.status(400).send({ message: "필수 정보가 누락되었습니다." });
    }

    // DB 파라미터 배열 (SQL 순서와 일치해야 함)
    const params = [
      staff_id,
      ward_no,
      guardian_id,
      consult_datetime,
      disabled_level,
      consult_status || "진행중",
      content,
      survey_no,
      res_no,
    ];

    console.log("Executing Query: createConsultationLog", params);
    // 트랜잭션 시작
    await connection.beginTransaction();

    // 상담일지 생성
    const result = await connection.query(
      sqlList.createConsultationLog,
      params
    );
    if (!result.insertId) {
      throw new Error("상담 일지 생성 실패 - insertId 없음");
    }
    console.log("Consultation Log Created. Insert ID:", result.insertId);
    // 예약 상태 업데이트
    console.log("Executing Query (updateReservationToBooked):", res_no);
    await connection.query(sqlList.updateReservationToBooked, [res_no]);

    // [신규] 상담상태가 '완료'이고, 연결된 조사지가 있으면 해당 조사지 상태를 '심사중'으로 변경
    if (consult_status === "완료" && survey_no) {
      console.log(
        `상담 완료, 조사지(${survey_no}) 상태를 '심사중'으로 변경합니다.`
      );
      await connection.query(sqlList.updateSurveyStatus, [survey_no]);
    }

    // 문제없으면 커밋
    await connection.commit();
    res.status(201).send({
      message: "상담 일지가 등록되었습니다.",
      logId: result.insertId,
    });
  } catch (error) {
    console.error("트랜잭션 오류:", error);
    // 실패 시 롤백
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("롤백 실패:", rollbackError);
    }

    res.status(500).send({ message: "상담 일지 등록 중 오류가 발생했습니다." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports.saveDraft = async (req, res) => {
  console.log("--- saveDraft Service ---");
  try {
    const {
      staff_id,
      ward_no,
      guardian_id,
      consult_datetime,
      disabled_level,
      consult_status,
      content,
      survey_no,
      res_no,
    } = req.body;

    // 임시저장은 '임시저장' 상태로 강제 설정
    const status = "임시저장";

    const params = [
      staff_id,
      ward_no,
      guardian_id,
      consult_datetime,
      disabled_level,
      consult_status || "진행중",
      content,
      survey_no,
      res_no,
    ];

    console.log("Executing Query: createConsultationLog (Draft)", params);

    const result = await db.query("createConsultationLog", params);

    res.status(200).send({
      message: "임시저장 되었습니다.",
      logId: result.insertId,
    });
  } catch (error) {
    console.error("임시저장 오류:", error);
    res.status(500).send({ message: "임시저장 중 오류가 발생했습니다." });
  }
};

// counselingService.js
module.exports.getSurveysByWard = async (req, res) => {
  try {
    const { wardNo } = req.params;

    if (!wardNo) {
      return res.status(400).send({ message: "wardNo가 누락되었습니다." });
    }

    const surveys = await db.query("getSurveysByWard", [wardNo]);

    res.status(200).send({
      message: "조사지 목록 조회 성공",
      surveys,
    });
  } catch (err) {
    console.error("조사지 조회 오류:", err);
    res.status(500).send({ message: "조사지 조회 중 오류 발생" });
  }
};

/**
 * 상담 일지 목록 조회 서비스
 */
module.exports.getConsultList = async (req, res) => {
  console.log("--- getLogs Service ---");
  try {
    const staffId = req.user ? req.user.id : null;
    const { searchType, keyword, searchDate } = req.query;

    if (!staffId) {
      return res
        .status(401)
        .send({ message: "인증 정보가 유효하지 않습니다." });
    }

    let queryKey = "getConsultBase";
    let params = [staffId];

    // 검색 조건 분기 처리
    if (searchType === "guardian" && keyword) {
      queryKey = "getConsultByGuardian";
      params.push(`%${keyword}%`);
    } else if (searchType === "ward" && keyword) {
      queryKey = "getConsultByWard";
      params.push(`%${keyword}%`);
    } else if (searchType === "date" && searchDate) {
      queryKey = "getConsultByDate";
      params.push(searchDate);
    }

    console.log(`Executing Query: ${queryKey}, Params:`, params);

    const logs = await db.query(queryKey, params);

    res.status(200).send({
      message: "상담 일지 목록 조회 성공",
      data: logs || [],
    });
  } catch (err) {
    console.error("상담 일지 목록 조회 오류:", err);
    res.status(500).send({ message: "목록 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 상담 일지 상세 조회 서비스
 */
module.exports.getDetail = async (req, res) => {
  console.log("--- getLogDetail Service ---");
  try {
    const { consultNo } = req.params;

    if (!consultNo) {
      return res.status(400).send({ message: "로그 ID가 필요합니다." });
    }

    // 상세 정보 쿼리 실행
    // db.query가 배열을 반환한다고 가정
    const rows = await db.query("getConsultLogDetail", [consultNo]);

    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .send({ message: "해당 상담 기록을 찾을 수 없습니다." });
    }

    const data = rows[0];

    res.status(200).send({
      message: "상세 조회 성공",
      data: data,
    });
  } catch (err) {
    console.error("상세 조회 오류:", err);
    res
      .status(500)
      .send({ message: "상세 정보를 불러오는 중 오류가 발생했습니다." });
  }
};
/**
 * [신규] 상담 일지 수정 서비스
 */
module.exports.updateConsult = async (req, res) => {
  console.log("--- updateLog Service ---");
  const connection = await db.connectionPool.getConnection();
  try {
    const { consultNo } = req.params;
    const { content, consult_status, disabled_level } = req.body;

    if (!consultNo) {
      return res.status(400).send({ message: "상담 번호가 누락되었습니다." });
    }

    await connection.beginTransaction();

    // 1. 기존 상담 정보 조회 (survey_no 확인용)
    const [existingLog] = await connection.query(sqlList.getConsultLogDetail, [
      consultNo,
    ]);

    if (!existingLog) {
      await connection.rollback();
      return res
        .status(404)
        .send({ message: "수정할 상담 기록을 찾을 수 없습니다." });
    }

    // 2. 상담 일지 수정
    const updateResult = await connection.query(sqlList.updateConsult, [
      content,
      consult_status,
      disabled_level,
      consultNo,
    ]);

    if (updateResult.affectedRows === 0) {
      // 이 경우는 거의 없지만, 방어 코드로 유지
      await connection.rollback();
      return res
        .status(404)
        .send({ message: "수정할 상담 기록을 찾을 수 없습니다." });
    }

    // 3. [신규] 상담상태가 '완료'이고, 연결된 조사지가 있으면 해당 조사지 상태를 '심사중'으로 변경
    if (consult_status === "완료" && existingLog.survey_no) {
      console.log(
        `상담 완료, 조사지(${existingLog.survey_no}) 상태를 '심사중'으로 변경합니다.`
      );
      await connection.query(sqlList.updateSurveyStatus, [
        existingLog.survey_no,
      ]);
    }

    await connection.commit();

    res.status(200).send({
      message: "상담 일지가 성공적으로 수정되었습니다.",
    });
  } catch (err) {
    console.error("상담 일지 수정 오류:", err);
    if (connection) await connection.rollback();
    res.status(500).send({ message: "수정 중 오류가 발생했습니다." });
  } finally {
    if (connection) connection.release();
  }
};
