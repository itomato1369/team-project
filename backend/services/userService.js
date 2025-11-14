const mapper = require("../database/mappers/mapper");

const getExpiringNotices = async () => {
  const res = await mapper.query("findExpiringNotices", []);
  return res;
};

const getSurveyToUserWard = async (userName) => {
  const res = await mapper.query("findSurveyToUserWard", userName);
  return res;
};

const getBoardList = async (searchParams) => {
  const { term, type } = searchParams;

  // 1. 검색어가 없는 경우, 전체 목록 조회
  if (!term) {
    const res = await mapper.query("findBoardList", []);
    return res;
  }

  // 2. 검색어가 있는 경우
  if (type === "hashtag") {
    // 해시태그 검색: 파라미터를 '%#검색어%' 형태로 가공
    const hashtagTerm = `%#${term}%`;
    const res = await mapper.query("findBoardListByHashtag", [hashtagTerm]);
    return res;
  } else {
    // 일반 검색: 파라미터를 '%검색어%' 형태로 가공
    const searchTerm = `%${term}%`;
    const res = await mapper.query("findBoardListByData", [searchTerm, searchTerm]);
    return res;
  }
};

module.exports = { getExpiringNotices, getSurveyToUserWard, getBoardList };
