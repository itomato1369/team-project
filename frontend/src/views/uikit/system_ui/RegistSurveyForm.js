// src/views/uikit/system_ui/RegistSurveyForm.js

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast'; // 👈 1. [추가]
import { useConfirm } from 'primevue/useconfirm'; // 👈 2. [추가]

export function RegistSurveyForm() {
  const tempStorageKey = 'tempSurveyDraft';
  const router = useRouter();
  const toast = useToast(); // 👈 3. [추가]
  const confirm = useConfirm(); // 👈 4. [추가]
  // --- 옵션 목록 (기존과 동일) ---

  const businessItems = ref([
    { name: '사업명 1', code: 'Business 1' },
    { name: '사업명 2', code: 'Business 2' },
  ]);
  const statuses = ref([
    { name: '상태1', code: 0 },
    { name: '상태2', code: 1 },
  ]);
  const responses = ref([
    { name: '서술형', code: 1 },
    { name: 'O/X', code: 2 },
  ]);
  const priorityList = ref([
    { name: '긴급', code: 'priority 1' },
    { name: '중점', code: 'priority 2' },
    { name: '계획', code: 'priority 3' },
  ]); // --- 폼 데이터 (기존과 동일) ---

  const basicInfo = ref({
    surveyName: '',
    businessItem: null,
    status: null,
  });
  const questionList = ref([]); // --- 헬퍼 및 폼 관리 함수 (기존과 동일) ---

  function createNewQuestion() {
    return { id: Date.now(), content: '', responseType: null, required: false, priority: null };
  }
  function addForm() {
    questionList.value.push(createNewQuestion());
  }
  function removeQuestion(index) {
    if (questionList.value.length > 1) {
      questionList.value.splice(index, 1);
    } else {
      console.warn('최소 1개의 질문이 필요합니다.');
    }
  } // --- [수정] 임시저장 (Toast 적용) ---

  const saveTemp = () => {
    const surveyData = {
      basicInfo: basicInfo.value,
      questionList: questionList.value,
    };

    try {
      localStorage.setItem(tempStorageKey, JSON.stringify(surveyData));
      console.log('--- [LocalStorage] 임시 저장 완료 ---');

      toast.add({
        severity: 'success',
        summary: '저장 완료',
        detail: '현재 내용을 브라우저에 임시저장했습니다.',
        life: 3000,
      });
    } catch (e) {
      console.error('LocalStorage 저장 실패:', e);
      toast.add({
        severity: 'error',
        summary: '저장 실패',
        detail: '임시저장에 실패했습니다: ' + e.message,
        life: 5000,
      });
    }
  }; // --- [수정] 임시저장 삭제 (ConfirmDialog 적용) ---

  const clearTemp = () => {
    confirm.require({
      message: '임시저장된 내용을 삭제하시겠습니까? \n현재 작성 내용은 모두 사라집니다.',
      header: '삭제 확인',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '삭제',
      rejectLabel: '취소',
      accept: () => {
        // 확인 버튼(accept)을 눌렀을 때 실행
        localStorage.removeItem(tempStorageKey);

        toast.add({
          severity: 'info',
          summary: '삭제 완료',
          detail: '임시저장된 내용이 삭제되었습니다.',
          life: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      reject: () => {
        // 취소 버튼(reject)을 눌렀을 때 (아무것도 안함)
      },
    });
  }; // --- [수정] 최종 등록 (Toast 적용 및 구문 오류 수정) ---

  const requestApproval = async () => {
    // 1. 유효성 검사 (Toast 피드백으로 변경)
    if (!basicInfo.value.surveyName) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '조사지명을 입력하세요.',
        life: 3000,
      });
    }
    if (!basicInfo.value.businessItem) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '사업명을 선택하세요.',
        life: 3000,
      });
    }
    if (!basicInfo.value.status) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '상태를 선택하세요.',
        life: 3000,
      });
    }
    if (questionList.value.length === 0 || !questionList.value[0].content) {
      return toast.add({
        severity: 'warn',
        summary: '입력 필요',
        detail: '질문을 1개 이상 입력하세요.',
        life: 3000,
      });
    } // 2. 백엔드로 보낼 데이터 조립 (기존과 동일)

    const surveyData = { ...basicInfo.value, questionList: questionList.value, writer: '관리자' };

    try {
      // 3. 백엔드 POST API 호출
      const postResponse = await axios.post('/api/system/survey', surveyData);

      // 4. 등록 성공 (🚨 [수정] 구문 오류 '=' 제거됨)
      toast.add({
        severity: 'success',
        summary: '등록 성공',
        detail: '조사지가 성공적으로 등록되었습니다!',
        life: 3000,
      }); // 5. localStorage의 임시 데이터 삭제

      localStorage.removeItem(tempStorageKey);
      console.log('[LocalStorage] 최종 등록 완료. 임시 데이터를 삭제합니다.'); // 6. 목록 페이지로 이동

      router.push({ name: 'SurveyList' });
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

  function initializeForm() {
    if (questionList.value.length === 0) {
      addForm();
    }
  } // --- [수정] onMounted (Toast 적용) ---

  onMounted(() => {
    const savedData = localStorage.getItem(tempStorageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        basicInfo.value = parsedData.basicInfo;
        questionList.value = parsedData.questionList;
        console.log('[LocalStorage] 임시저장된 데이터를 불러왔습니다.');

        toast.add({
          severity: 'info',
          summary: '데이터 복원',
          detail: '임시저장된 내용을 불러왔습니다.',
          life: 3000,
        });
      } catch (e) {
        console.error('임시저장 데이터 파싱 실패:', e);
        localStorage.removeItem(tempStorageKey);
        initializeForm();
      }
    } else {
      console.log('[LocalStorage] 저장된 데이터가 없습니다. 새 폼을 시작합니다.');
      initializeForm();
    }
  }); // --- return (기존과 동일) ---

  return {
    businessItems,
    statuses,
    responses,
    priorityList,
    basicInfo,
    questionList,
    initializeForm,
    addForm,
    removeQuestion,
    saveTemp,
    requestApproval,
    clearTemp,
  };
}
