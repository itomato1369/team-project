const mapper = require("../database/mappers/mapper");
const sql = require("../database/sqlList");

const formatDate = (date) => {
  // date 값이 null이거나 유효하지 않은 경우, 에러를 발생시키는 대신 null을 반환
  if (!date || new Date(date).toString() === "Invalid Date") {
    return null;
  }

  // 이제 date는 유효한 값이므로 안전하게 변환 실행
  const dateObj = new Date(date);
  const isoString = dateObj.toISOString();
  const formattedDate = isoString.split("T")[0];

  return formattedDate;
};

const getExpiringNotices = async () => {
  const userNoticesResult = await mapper.query("findExpiringNotices", []);
  const res = userNoticesResult.map((item) => {
    item.business_end = formatDate(item.business_end);
    return item;
  });
  return res;
};

const getSurveyToUserWard = async (userName) => {
  // 1. await로 DB 조회 결과를 '먼저' 받아옵니다. (결과: 배열)
  const surveyResults = await mapper.query("findSurveyToUserWard", userName);

  // 2. 받아온 '배열'에 .map()을 적용합니다.
  const res = surveyResults.map((item) => {
    item.updated_at = formatDate(item.updated_at);
    return item;
  });
  return res;
};

const getBoardList = async (searchParams) => {
  const { term, type } = searchParams;
  let res = [];

  // 1. 검색어가 없는 경우
  if (!term) {
    console.log("빈 검색어로 갑니다.");
    res = await mapper.query("findBoardList", []);
  }
  // 💡 [수정] 'else if'로 변경하여 위 if문과 연결합니다.
  // (term이 있는 경우에만 아래 로직이 실행됩니다)
  else if (type === "hashtag") {
    // 해시태그 검색: 파라미터를 '%#검색어%' 형태로 가공
    const hashtagTerm = `%#${term}%`;
    res = await mapper.query("findBoardListByHashtag", [hashtagTerm]);
  }
  // 💡 [수정] 'else'
  else {
    // 일반 검색: 파라미터를 '%검색어%' 형태로 가공
    const searchTerm = `%${term}%`;
    res = await mapper.query("findBoardListByData", [searchTerm, searchTerm]);
  }

  // 최종 결과 시간값을 수정
  // res가 배열이 아니면 빈 배열로 기본값 설정
  const resultsArray = Array.isArray(res) ? res : [];

  // 이제 resultsArray는 항상 배열이므로 .map()을 안전하게 사용할 수 있음
  const resultList = resultsArray.map((item) => {
    item.created_at = formatDate(item.created_at);
    item.updated_at = formatDate(item.updated_at);
    return item;
  });

  return resultList;
};

const getUserSurveys = async (userName) => {
  const surveyResults = await mapper.query("findUserSurveys", userName);

  const res = surveyResults.map((item) => {
    item.deadline = formatDate(item.deadline);
    return item;
  });
  return res;
};

const getInquiries = async () => {
  const inquiryResults = await mapper.query("findInquiries");

  if (!Array.isArray(inquiryResults)) {
    return [];
  }

  const res = inquiryResults.map((item) => {
    item.created_at = formatDate(item.created_at);
    return item;
  });
  return res;
};

const getInquiryDetail = async (inquiryNo) => {
  const inquiryDetailResult = await mapper.query(
    "findInquiryDetail",
    inquiryNo
  );

  if (!Array.isArray(inquiryDetailResult) || inquiryDetailResult.length === 0) {
    return null;
  }

  const item = inquiryDetailResult[0];

  item.created_at = formatDate(item.created_at);
  item.updated_at = formatDate(item.updated_at);
  item.business_end = formatDate(item.business_end);

  return item;
};

const getInquiryQuestions = async (inquiryNo) => {
  const questions = await mapper.query("findInquiryQuestions", inquiryNo);
  return questions.map((q) => ({
    question_no: q.business_no,
    question_content: q.question_content,
    is_required: q.is_required,
    response_type: q.response_type,
    priority: q.priority,
  }));
};

const saveInquiryAnswers = async (saveData) => {
  const { inquiryDetail, answers } = saveData;
  const filteredAnswers = answers.filter(
    (answer) => answer.survey_answer && answer.survey_answer.trim() !== ""
  );
  if (filteredAnswers.length === 0) {
    return { message: "No answers to save." };
  }
  let conn;
  try {
    conn = await mapper.connectionPool.getConnection();
    await conn.beginTransaction();
    // 1. Insert into survey table using data from the frontend payload
    const surveyParams = [
      inquiryDetail.ward_no,
      inquiryDetail.business_name || "문의조사",
      inquiryDetail.purpose, // Use purpose from payload
      inquiryDetail.content, // Use content from payload
      inquiryDetail.writer,
      inquiryDetail.status,
    ];
    const surveyResult = await conn.query(sql.insertSurvey, surveyParams);
    const newSurveyNo = surveyResult.insertId;
    // 2. Manually construct bulk insert for survey_result table
    const placeholders = filteredAnswers.map(() => "(?, ?, ?)").join(",");
    const surveyResultValues = filteredAnswers.flatMap((answer) => [
      answer.business_no,
      answer.survey_answer,
      newSurveyNo,
    ]);
    const insertSql = `INSERT INTO survey_result (business_no, survey_answer, survey_no) VALUES ${placeholders}`;
    await conn.query(insertSql, surveyResultValues);
    await conn.commit();
    return { message: "Answers saved successfully." };
  } catch (err) {
    if (conn) await conn.rollback();
    throw new Error("Failed to save answers: " + err.message);
  } finally {
    if (conn) conn.release();
  }
};

const getSurveyByInquiryContent = async (inquiryName) => {
  const survey = await mapper.query("findSurveyByInquiryContent", inquiryName);
  return survey[0];
};

const getSurveyResults = async (surveyNo) => {
  const results = await mapper.query("findSurveyResultsBySurveyNo", surveyNo);
  return results;
};

const updateSurveyAndResults = async (surveyNo, updateData) => {
  const { answers, modificationReason, purpose, content } = updateData;
  const filteredAnswers = answers.filter(
    (answer) => answer.survey_answer && answer.survey_answer.trim() !== ""
  );

  let conn;
  try {
    conn = await mapper.connectionPool.getConnection();
    await conn.beginTransaction();

    // 1. Delete old results
    await conn.query(sql.deleteSurveyResultsBySurveyNo, [surveyNo]);

    // 2. Insert new results (if any)
    if (filteredAnswers.length > 0) {
      const placeholders = filteredAnswers.map(() => "(?, ?, ?)").join(",");
      const surveyResultValues = filteredAnswers.flatMap((answer) => [
        answer.business_no,
        answer.survey_answer,
        surveyNo,
      ]);
      const insertSql = `INSERT INTO survey_result (business_no, survey_answer, survey_no) VALUES ${placeholders}`;
      await conn.query(insertSql, surveyResultValues);
    }

    // 3. Update the main survey's timestamp, modification reason, purpose, and content
    await conn.query(sql.updateSurvey, [
      modificationReason,
      purpose,
      content,
      surveyNo,
    ]);

    await conn.commit();
    return { message: "Survey updated successfully." };
  } catch (err) {
    if (conn) await conn.rollback();
    throw new Error("Failed to update survey: " + err.message);
  } finally {
    if (conn) conn.release();
  }
};

const getMyPageSurveys = async (writer) => {
  const surveys = await mapper.query("findSurveysForMyPage", writer);
  // Format dates before sending
  return surveys.map((s) => ({
    ...s,
    created_at: formatDate(s.created_at),
  }));
};

module.exports = {
  getExpiringNotices,
  getSurveyToUserWard,
  getBoardList,
  getUserSurveys,
  getInquiries,
  getInquiryDetail,
  saveInquiryAnswers,
  getInquiryQuestions,
  getSurveyByInquiryContent,
  getSurveyResults,
  updateSurveyAndResults,
  getMyPageSurveys,
};
