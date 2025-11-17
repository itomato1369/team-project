// src/views/uikit/system_ui/RegistSurveyForm.js

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast'; // 👈 1. [추가]

export function RegistFileForm1() {
  const router = useRouter();
  const toast = useToast(); // 👈 3. [추가]

  // --- 옵션 목록 (기존과 동일) ---
  const institutionList = ref([
    { name: '기관 1', code: 'institution 1' },
    { name: '기관 2', code: 'institution 2' },
    { name: '기관 3', code: 'institution 3' },
    { name: '기관 4', code: 'institution 4' },
    { name: '기관 5', code: 'institution 5' },
    { name: '기관 6', code: 'institution 6' },
    { name: '기관 7', code: 'institution 7' },
    { name: '기관 8', code: 'institution 8' },
  ]);
  const basicInfo = ref({
    writer: null,
    title: null,
    file_no: null,
    institution_name: null,
  });
  const fileList = ref([]); // --- 헬퍼 및 폼 관리 함수 (기존과 동일) ---

  const requestApproval = async () => {
    // 1. 유효성 검사 (Toast 피드백으로 변경)
    if (!basicInfo.value.institution_name) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '기관명을 입력하세요.',
        life: 3000,
      });
    }
    if (!basicInfo.value.writer) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '작성자를 입력하세요.',
        life: 3000,
      });
    }
    if (!basicInfo.value.title) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '파일명을 입력하세요.',
        life: 3000,
      });
    }
    if (basicInfo.value.file_no == null) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '파일을 첨부하세요.',
        life: 3000,
      });
    } // 2. 백엔드로 보낼 데이터 조립 (기존과 동일)

    const fileData = { ...basicInfo.value };

    try {
      // 3. 백엔드 POST API 호출
      const postResponse = await axios.post('/api/system/data-board', fileData);

      // 4. 등록 성공 (🚨 [수정] 구문 오류 '=' 제거됨)
      toast.add({
        severity: 'success',
        summary: '등록 성공',
        detail: '조사지가 성공적으로 등록되었습니다!',
        life: 3000,
      }); // 5. localStorage의 임시 데이터 삭제

      router.push({ name: 'FileList' });
    } catch (err) {
      // 7. 등록 실패
      console.error('등록 실패:', err);
      toast.add({
        severity: 'error',
        summary: '등록 실패',
        detail: '등록에 실패했습니다: ' + (err.response?.data?.message || err.message),
        life: 5000,
      });
    }
    // 🚨 [수정] }; (함수 닫기)를 catch 블록 밖으로 올바르게 이동
  }; // --- 초기화 로직 (기존과 동일) ---

  return {
    fileList,
    basicInfo,
    requestApproval,
    institutionList,
  };
}
