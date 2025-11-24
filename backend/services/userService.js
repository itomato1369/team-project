const bcrypt = require("bcrypt");
const mapper = require("../database/mappers/mapper");
const sql = require("../database/sqlList");
const crypto = require('crypto');

// AES암호화 제대로쓰려면 user || ward 별로 iv키를 할당 해 줘야하는데 급해서 생략
function encrypt(text) {
  const key = Buffer.from(process.env.AES_KEY, 'hex');
  const iv = Buffer.from(process.env.AES_IV, 'hex');  // 고정 IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return Buffer.from(encrypted, 'hex').toString('base64');  // Base64만 반환 (iv 저장 X)
}

// 복호화 예시 (필요 시 사용)
function decrypt(encryptedBase64) {
  const key = Buffer.from(process.env.AES_KEY, 'hex');
  const iv = Buffer.from(process.env.AES_IV, 'hex');
  const encryptedHex = Buffer.from(encryptedBase64, 'base64').toString('hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

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

// 프론트엔드 호출처: 확인 필요
const getExpiringNotices = async () => {
  const userNoticesResult = await mapper.query("findExpiringNotices", []);
  const res = userNoticesResult.map((item) => {
    item.business_end = formatDate(item.business_end);
    return item;
  });
  return res;
};

// 프론트엔드 호출처: 확인 필요
const getSurveyToUserWard = async (userId) => {
  // 1. await로 DB 조회 결과를 '먼저' 받아옵니다. (결과: 배열)
  const surveyResults = await mapper.query("findSurveyToUserWard", userId);

  // 2. 받아온 '배열'에 .map()을 적용합니다.
  const res = surveyResults.map((item) => {
    item.created_at = formatDate(item.created_at);
    return item;
  });
  return res;
};

// 프론트엔드 호출처: 확인 필요
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

// 프론트엔드 호출처: 확인 필요
const getUserSurveys = async (userId) => {
  const surveyResults = await mapper.query("findUserSurveys", userId);

  const res = surveyResults.map((item) => {
    item.deadline = formatDate(item.deadline);
    return item;
  });
  return res;
};

// 프론트엔드 호출처: 확인 필요
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

// 프론트엔드 호출처: 확인 필요
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

// 프론트엔드 호출처: 확인 필요
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

// 프론트엔드 호출처: 확인 필요
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

// 프론트엔드 호출처: 확인 필요
const getSurveyByInquiryContent = async (inquiryNo) => {
  const survey = await mapper.query("findSurveyByInquiryContent", inquiryNo);
  return survey[0];
};

// 프론트엔드 호출처: 확인 필요
const getSurveyResults = async (surveyNo) => {
  const results = await mapper.query("findSurveyResultsBySurveyNo", surveyNo);
  return results;
};

// 프론트엔드 호출처: 확인 필요
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

// 프론트엔드 호출처: 확인 필요
const getMyPageSurveys = async (writer) => {
  const surveys = await mapper.query("findSurveysForMyPage", writer);
  // Format dates before sending
  return surveys.map((s) => ({
    ...s,
    created_at: formatDate(s.created_at),
  }));
};

// 프론트엔드 호출처: 확인 필요
const getUsersByInstitution = async (institutionNo) => {
  // 해당 institution_no를 가진 이용자 목록 조회
  const users = await mapper.query("getUsersByInstitutionNo", [institutionNo]);
  return users;
};

// 프론트엔드 호출처: 확인 필요 (UserWardInfoInsert.vue, UserWardInfoUpdate.vue 에서 사용될 수 있음)
const getWardsByGuardianId = async (guardianId) => {
  const wards = await mapper.query("findWardsByGuardianId", guardianId);
  
  if (!Array.isArray(wards) || wards.length === 0) {
    return []; // Return an empty array if no wards are found or if result is not an array
  }

  const decryptedWards = wards.map(w => {
    // Ensure ward_rrn exists and is a string before decrypting
    if (w.ward_rrn && typeof w.ward_rrn === 'string') {
      return {
        ...w,
        // ward_rrn이 Base64 문자열 패턴과 일치하는 경우에만 복호화를 시도
        ward_rrn: /^[A-Za-z0-9+/=]+$/.test(w.ward_rrn) ? decrypt(w.ward_rrn) : w.ward_rrn
      };
    }
    return w; // Return ward as is if ward_rrn is missing or not a string
  });

  return decryptedWards;
};

// 프론트엔드 호출처: 확인 필요 (UserWardInfoInsert.vue 에서 사용될 수 있음)
const addWard = async (wardData) => {
  const {
    ward_rrn,
    name,
    sex,
    address,
    guardian_id,
    guardian_relation,
    disabled_level,
    age,
  } = wardData;

  // AES 암호화
  const encryptedRrn = encrypt(ward_rrn);
  // Hash the RRN before saving: 단방향 방식이라 복호화가 불가능해서 주석처리
  // const hashedRrn = await bcrypt.hash(ward_rrn, 10);
  

  return await mapper.query("insertWard", [
    encryptedRrn,
    name,
    sex,
    address,
    guardian_id,
    guardian_relation,
    disabled_level,
    age,
  ]);
};

// 프론트엔드 호출처: 확인 필요 (UserWardInfoUpdate.vue 에서 사용될 수 있음)
const updateWard = async (wardNo, wardData) => {
  const { address, disabled_level } = wardData;
  return await mapper.query("updateWard", [address, disabled_level, wardNo]);
};

// 프론트엔드 호출처: frontend/src/components/UserMyInfoUpdate.vue
const getUserByUserId = async (userId) => {
  const user = await mapper.query("findUserByUserId", userId);
  return user[0];
};

// 프론트엔드 호출처: frontend/src/components/InstitutionState.vue
// (AdminMyPage.vue 및 StaffMyPage.vue 에 포함)
const getInstitutionInfo = async (userId) => {
  const adminInfo = await mapper.query("getInstitutionInfo", userId);
  return adminInfo[0];
};

// 프론트엔드 호출처: 확인 필요
const getAllInstitutions = async () => {
  return await mapper.query("findAllInstitutions", []);
};

// 프론트엔드 호출처: 확인 필요
const applyToInstitution = async (userId, institutionNo) => {
  return await mapper.query("applyToInstitution", [institutionNo, userId]);
};

// 프론트엔드 호출처: frontend/src/components/UserMyInfoUpdate.vue
const updateUserInfo = async (userId, userData) => {
  const { phone, address, email } = userData;
  return await mapper.query("updateUser", [phone, address, email, userId]);
};

// 프론트엔드 호출처: frontend/src/components/UserMyInfoUpdate.vue
const changePassword = async (userId, passwordData) => {
  const { currentPassword, newPassword } = passwordData;
  const user = (await mapper.query("findUserById", [userId]))[0];

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("현재 비밀번호가 일치하지 않습니다.");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  return await mapper.query("updatePassword", [hashedNewPassword, userId]);
};

// 프론트엔드 호출처: frontend/src/views/UserSupportPlanDetail.vue
const getSupportPlanDetail = async (support_plan_no) => {
  const result = await mapper.query("findSupportPlanDetailBySupportPlanNo", [
    support_plan_no,
  ]);
  if (!Array.isArray(result) || result.length === 0) {
    return null;
  }
  const item = result[0];
  item.created_at = formatDate(item.created_at);
  item.updated_at = formatDate(item.updated_at);
  return item;
};

// 프론트엔드 호출처: frontend/src/components/InstitutionState.vue
const updateInstitutionStatus = async (institutionNo, data) => {
  const { status, closed_at, closed_notice } = data;
  console.log([status, closed_at, closed_notice, institutionNo]);
  const result = await mapper.query("updateInstitutionStatus", [
    status,
    closed_at,
    closed_notice,
    institutionNo,
  ]);
  return result;
};
//
const getAvailableWardsForInquiry = async (guardianId, inquiryNo) => {
  return await mapper.query("findAvailableWardsForInquiry", [guardianId, inquiryNo]);
};

const getSurveyDetail = async (surveyNo) => {
  // 1. Get main survey data
  const surveyDataResult = await mapper.query("findSurveyDataBySurveyNo", [surveyNo]);
  if (!surveyDataResult || surveyDataResult.length === 0) {
    return null; // Survey not found
  }
  const surveyData = surveyDataResult[0];
  surveyData.created_at = formatDate(surveyData.created_at);

  // 2. Get questions and answers
  const questionsData = await mapper.query("findQuestionsAndAnswersBySurveyNo", [surveyNo]);

  // 3. Combine and return
  return {
    surveyData,
    questionsData,
  };
};

const getSupportResultDetail = async (resultNo) => {
  const result = await mapper.query("findSupportResultDetailByResultNo", [resultNo]);
  if (!Array.isArray(result) || result.length === 0) {
    return null;
  }
  return result[0];
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
  getUsersByInstitution,
  getWardsByGuardianId,
  addWard,
  updateWard,
  getUserByUserId,
  getAllInstitutions,
  applyToInstitution,
  updateUserInfo,
  changePassword,
  getSupportPlanDetail,
  getSurveyDetail,
  getInstitutionInfo,
  updateInstitutionStatus,
  getSupportResultDetail,
  getAvailableWardsForInquiry
};
