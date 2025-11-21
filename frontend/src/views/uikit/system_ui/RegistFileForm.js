// src/views/uikit/system_ui/RegistSurveyForm.js

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast'; // 👈 1. [추가]

export function RegistFileForm1() {
  const router = useRouter();
  const toast = useToast(); // 👈 3. [추가]

  // --- 옵션 목록 (기존과 동일) ---
  // ⭐️ 1. [추가] 기관 목록을 담을 반응형 변수 선언
  const institutionList = ref([]); // ⭐️ 2. [추가] 컴포넌트 마운트 시 데이터 로드

  onMounted(async () => {
    try {
      // 백엔드 API 호출: /api/data-board/institutions
      const response = await axios.get('/api/data-board/institutions');
      institutionList.value = response.data;
      console.log('기관 목록 로드 성공:', institutionList.value);
    } catch (err) {
      console.error('기관 목록 로드 실패:', err);
      toast.add({
        severity: 'error',
        summary: '데이터 오류',
        detail: '작성기관 목록을 불러오지 못했습니다.',
        life: 5000,
      });
    }
  });

  const basicInfo = ref({
    writer: null,
    title: null,
    file_no: null,
    institution_name: null,
  });
  const fileList = ref([]); // --- 헬퍼 및 폼 관리 함수 (기존과 동일) ---
  // ⭐ requestApproval 함수가 파일 객체를 인수로 받도록 수정
  const requestApproval = async (fileObject) => {
    // 1. 유효성 검사 (Toast 피드백)
    if (!basicInfo.value.institution_name || !basicInfo.value.writer || !basicInfo.value.title) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '자료명, 작성기관, 작성자를 모두 입력하세요.',
        life: 3000,
      });
    }

    // ⭐️ 2. 파일 첨부 여부 검사 (file_no가 아닌 fileObject 존재 여부로 검사)
    if (!fileObject) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '파일을 첨부하세요.',
        life: 3000,
      });
    }
    // 3. 백엔드로 보낼 FormData 조립 (파일 업로드 필수)
    const formData = new FormData();

    // ⭐ 파일 데이터 추가 (백엔드에서 'uploadFile' 키로 받습니다)
    formData.append('uploadFile', fileObject);
    // ⭐ 메타데이터 추가
    formData.append('institution_name', basicInfo.value.institution_name); // 예시: Select 옵션의 name 필드를 보낸다고 가정
    formData.append('writer', basicInfo.value.writer);
    formData.append('title', basicInfo.value.title);

    // files 테이블에 필요한 추가 정보 (백엔드 라우터에서 사용)
    formData.append('parent_id', 1); // 예시 값
    formData.append('parent_tablename', 'board'); // 예시 값

    try {
      // 4. 백엔드 POST API 호출 (파일 업로드용 API)
      // '/api/system/data-board'가 아닌, 파일을 처리하는 라우터로 변경
      const postResponse = await axios.post('/api/system/data-board', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수
        },
      });

      // 5. 등록 성공
      const newFileNo = postResponse.data.fileNo; // 백엔드 응답에서 fileNo 추출

      toast.add({
        severity: 'success',
        summary: '등록 성공',
        detail: `파일 및 게시글 등록 완료! (File No: ${newFileNo})`,
        life: 3000,
      });

      router.push('/data-board'); // 목록 페이지로 이동
    } catch (err) {
      // 6. 등록 실패
      console.error('등록 실패:', err);
      toast.add({
        severity: 'error',
        summary: '등록 실패',
        detail: '등록에 실패했습니다: ' + (err.response?.data?.message || err.message),
        life: 5000,
      });
    }
  };

  return {
    basicInfo,
    institutionList,
    requestApproval, // 이 함수를 Vue 컴포넌트에서 사용합니다.
  };
}
