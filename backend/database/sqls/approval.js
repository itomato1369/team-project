// member TABLE 권한 승인 목록 불러오기
const approvalList = {
  selectApprovalList: `SELECT user_name, institution_no, role, created_at, status FROM member
  WHERE status = 'READY'`,
};

module.exports = {
  ...approvalList,
};
