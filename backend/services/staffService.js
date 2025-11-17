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

module.exports = {
  surveySelect,
  supportPlan,
};
