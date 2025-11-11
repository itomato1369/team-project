// Table : board_tbl

// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectboardList = `
SELECT no
	, title
	, writer
	, content
	, created_dt
	, updated_dt
  , ( SELECT COUNT(no) FROM comment_tbl WHERE bno = b.no) comment_count
FROM board_tbl b
ORDER bY no`;

// PRIMARY KEY를 활용한 단건조회
const selectboardOne = `
SELECT no
	, title
	, writer
	, content
	, created_dt
	, updated_dt
FROM board_tbl
WHERE no = ?`;
// ?은 대체될 값이 들어갈 위치를 지정함
// 1) ?의 총 갯수
// 1-1) 1개 : 배열이 아닌 단일 값
// 1-2) 2개 이상 : 배열
// 2) 각 ?의 위치
// 2-1) ?에 대체할 값이 입력될 컬럼이 명확할 경우 : 기본값(문자, 숫자, 날짜)
// 2-2) ?에 대체할 값이 입력될 컬럼이 명확하지 않을 경우 : 객체, 필드명이 컬럼명이됨.

// 등록
const boardInsert = `
INSERT INTO board_tbl ( title, writer, content, created_dt)
VALUES ( ?, ?, ?, ? )`;

// 수정
const boardUpdate = `
UPDATE board_tbl
SET ?
WHERE no = ?`;

// PRIMARY KEY를 활용한 삭제
const boardDelete = `
DELETE FROM board_tbl
WHERE no = ?`;

module.exports = {
  selectboardList,
  selectboardOne,
  boardInsert,
  boardUpdate,
  boardDelete,
};
