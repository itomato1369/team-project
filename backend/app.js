require("dotenv").config({ path: "./dbConfig.env" });
require("dotenv").config(); // .env 파일도 함께 로드
console.log("[app.js] 1. Server process starting..."); // <-- 로그 1

const express = require("express");
const app = express();
const port = 3000;

//1.미들웨어 등록영역
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let apiPath = "";
if (process.argv.indexOf("prod") > -1) {
  apiPath = "/api";
}
app.get(`${apiPath}/board`, function (req, res) {
  res.send({ title: "노드 API 서버 업데이트" });
});

// [추가] 모든 요청을 로깅하는 최상위 미들웨어
app.use((req, res, next) => {
  console.log(`[GLOBAL] Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// [수정] 구체적인 라우터를 먼저 등록
console.log("[app.js] 2. Loading authRouter...");
const authRouter = require("./routers/authRouter.js");
app.use(`${apiPath}/auth`, authRouter);
console.log("[app.js] 3. authRouter loaded.");

// 유저 모듈
const userRouter = require("./routers/userRouter");
app.use(`${apiPath}/user`, userRouter);

// 담당자 모듈
const staffRouter = require("./routers/staffRouter.js");
app.use(`${apiPath}/staff`, staffRouter);

// 회원가입 모듈
const signupRouter = require("./routers/signupRouter.js");
app.use(`${apiPath}/register`, signupRouter);

// 시스템 관리자의 등록된 기관 목록 보기 모듈
const institutionRouter = require("./routers/systemRouter.js");
app.use(`${apiPath}/institutions`, institutionRouter);

//조사지 등록 모듈
const surveyRouter = require("./routers/surveyRouter.js");
app.use(`${apiPath}/system/survey`, surveyRouter);

const dataBoardRouter = require("./routers/dataBoardRouter.js");
app.use(`${apiPath}/system/data-board`, dataBoardRouter);

//상담일지 관련 모듈
const counselingRouter = require("./routers/counselingRouter.js");
app.use(`${apiPath}/counseling`, counselingRouter);

// QNA 라우터
const qnaRouter = require("./routers/qnaRouter.js");
app.use(`${apiPath}/qna`, qnaRouter);
// 아이디 비밀번호 찾기 모듈
const findAccountRouter = require("./routers/accountRouter.js");
app.use(`${apiPath}/findaccount`, findAccountRouter);

// [수정] 가장 일반적인 라우터를 마지막에 등록
const boardRouter = require("./routers/router.js");
app.use("/", boardRouter);

//2.server 실행영역
app.listen(port, () => {
  console.log("Server Start");
  console.log(`http://localhost:${port}`);
});

// vue.js build 이후

const path = require("path");
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

app.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public", "index.html"));
});
