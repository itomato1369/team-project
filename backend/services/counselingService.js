// DB 매퍼 임포트 (기존 mapper.js에 쿼리를 추가했다고 가정)
const db = require("../database/mappers/mapper");

module.exports.createLog = async (req, res) => {
  console.log("--- createLog Service ---");
  try {
    const {
      staff_id,
      ward_id,
      guardian_id,
      consult_datetime,
      disabled_level,
      consult_status,
      content,
      // guardian_name, guardian_id 등 추가 필드가 있다면 여기서 추출
    } = req.body;

    console.log("Request Payload:", req.body);

    // 필수 값 검증
    if (!staff_name || !ward_id || !content) {
      return res.status(400).send({ message: "필수 정보가 누락되었습니다." });
    }

    // DB 파라미터 배열 (SQL 순서와 일치해야 함)
    // 쿼리: staff_name, ward_id, ward_name, consult_datetime, disabled_level, consult_status, content
    const params = [
      staff_id,
      ward_id,
      guardian_id,
      ward_name,
      consult_datetime,
      disabled_level,
      consult_status || "진행중",
      content,
    ];

    console.log("Executing Query: createConsultationLog", params);

    // DB 실행
    const result = await db.query("createConsultationLog", params);

    console.log("Consultation Log Created. Insert ID:", result.insertId);

    res.status(201).send({
      message: "상담 일지가 등록되었습니다.",
      logId: result.insertId,
    });
  } catch (error) {
    console.error("상담 일지 등록 오류:", error);
    res.status(500).send({ message: "상담 일지 등록 중 오류가 발생했습니다." });
  }
};

module.exports.saveDraft = async (req, res) => {
  console.log("--- saveDraft Service ---");
  try {
    const {
      staff_id,
      ward_id,
      ward_name,
      consult_datetime,
      disabled_level,
      content,
    } = req.body;

    // 임시저장은 '임시저장' 상태로 강제 설정
    const status = "임시저장";

    const params = [
      staff_id,
      ward_id,
      ward_name,
      consult_datetime,
      disabled_level,
      status,
      content,
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
