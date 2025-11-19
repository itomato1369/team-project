export function uploadFile() {
  // 1. 파일 데이터 가져오기
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('파일을 선택해주세요.');
    return;
  }

  // 2. FormData 객체 생성
  const formData = new FormData();
  formData.append('uploadFile', file); // 'uploadFile'은 서버에서 파일을 받을 때 사용할 키
  formData.append('file_writer', '현재_로그인된_사용자_ID');
  formData.append('parent_id', '1'); // 예시 데이터
  formData.append('parent_tablename', 'support_plan'); // 예시 데이터
  // 기타 필요한 정보를 formData에 추가

  // 3. fetch 또는 XMLHttpRequest를 사용하여 서버로 전송
  fetch('/api/uploadFile', {
    // 서버에서 설정한 업로드 API 엔드포인트
    method: 'POST',
    body: formData, // 파일과 데이터가 담긴 객체 전송
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }
      return response.json();
    })
    .then((data) => {
      // 서버 응답 처리 (예: 성공 메시지 표시)
      console.log('업로드 성공:', data);
      alert('파일 업로드 완료!');
    })
    .catch((error) => {
      // 에러 처리
      console.error('에러:', error);
      alert('업로드 중 오류가 발생했습니다.');
    });
}
