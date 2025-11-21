const dataBoard = `select 
board_no
, institution_name
, category
, writer
, title
, content
, hashtag
, file_no
, created_at
, updated_at
from board`;

const callInstitution = `SELECT institution_name FROM board`;

const boardInsert = `
  INSERT INTO board (institution_name, writer, title, file_no, created_at)
  VALUES (?, ?, ?, ?, now())
`;

// const createFileNo = `SELECT CONCAT_WS(
// ''
// , 'FILE'
// , DATE_FORMAT(NOW()
// , '%Y%m')
// ,LPAD((IFNULL(MAX(SUBSTR(file_no, -3)),0)+1), 3, '0'))AS new_file_no
// FROM files
// WHERE SUBSTR(file_no, 5, 6) = DATE_FORMAT(NOW(), '%Y%m')
// FOR UPDATE;`;
// dataBoard.js - createFileNo 쿼리 (가장 안정적인 최종 버전)

const createFileNo = `
SELECT
    CONCAT_WS(
        '',
        'FILE',
        DATE_FORMAT(NOW(), '%Y%m'),
        -- 조건에 맞는 MAX_NUM이 없으면 IFNULL이 0을 반환
        LPAD((IFNULL(MAX_FILE.max_num, 0) + 1), 3, '0')
    ) AS new_file_no
FROM (
    -- 1. 현재 월의 최대 번호를 찾는 서브쿼리 (NULL 또는 값 반환)
    SELECT MAX(SUBSTR(file_no, -3)) AS max_num
    FROM files
    WHERE SUBSTR(file_no, 5, 6) = DATE_FORMAT(NOW(), '%Y%m')
) AS MAX_FILE
FOR UPDATE;`; //
const fileSelect = `SELECT  user_file_name, server_file_name, file_path FROM files WHERE file_no = ?`;
const fileInsert = `INSERT INTO files ( file_no, file_writer, user_file_name, server_file_name, file_path, file_size, file_date, extension_name, parent_id, parent_tablename )
VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`;
const fileSelectMulti = (numOfFiles) =>
  `SELECT user_file_name, server_file_name, file_path 
   FROM files 
   WHERE file_no IN (${Array(numOfFiles).fill("?").join(",")})`;
module.exports = {
  boardInsert,
  dataBoard,
  createFileNo,
  fileInsert,
  fileSelect,
  fileSelectMulti,
  callInstitution,
};
