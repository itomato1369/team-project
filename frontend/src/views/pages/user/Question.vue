<!-- <script setup>
import { QuestionSort } from '@/service/QuestionSorts';
import { SupportPlan } from '@/service/SupportPlan';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const questions = ref([]);

const questionSelection = ref([]);
const supportSelection = ref([]);

const supports = ref(null);
const formData = ref({
  title: null,
  content: null,
  category: null,
  supportplan_no: null,
});

onMounted(() => {
  QuestionSort.getQuestionSorts().then((data) => (questions.value = data));
  SupportPlan.getSupportPlan().then((data) => (supports.value = data));
});

function selectionList(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      questionSelection.value = [...questions.value];
    } else {
      questionSelection.value = questions.value.filter((item) => {
        // QuestionSort 대신 item 사용
        return item.name.toLowerCase().startsWith(event.query.toLowerCase()); // item.name 사용
      });
    }
  }, 250);
}

// selectionList2 함수 수정 (여기서 발생했던 iterable 오류는 1단계 수정으로 해결됨)
function selectionList2(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      // supports.value가 배열이 아닐 경우 대비 (이전 답변의 방어 코드가 여전히 유효함)
      const currentSupports = Array.isArray(supports.value) ? supports.value : [];
      supportSelection.value = [...currentSupports];
    } else {
      // item.name을 사용하도록 수정
      supportSelection.value = supports.value.filter((item) => {
        // SupportPlan 대신 item 사용
        return item.name.toLowerCase().startsWith(event.query.toLowerCase()); // item.name 사용
      });
    }
  }, 250);
}
// 취소 버튼 함수 (이전 페이지로 이동)
const cancel = function cancel() {
  // 브라우저의 이전 기록으로 돌아갑니다.
  router.go(-1);
  // 또는 특정 홈 페이지로 이동: router.push('/');
};
// 등록 버튼
const request = async function request() {
  // 필수 필드 검증 (예시)
  if (!formData.value.title || !formData.value.content) {
    toast.add({ severity: 'warn', summary: '알림', detail: '제목과 내용 모두 입력해주세요' });
    return;
  }

  // AutoComplete의 선택 값은 객체일 수 있으므로 ID만 추출하거나 필요한 데이터를 정리합니다.
  // Vue 컴포넌트 request 함수 내부
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?.user_id; // user가 null이면 currentUserId도 null

  const selectedCategory = formData.value.category;
  const payload = {
    title: formData.value.title,
    content: formData.value.content,
    // 선택된 객체에서 id나 name을 추출하여 서버에 맞게 전송합니다.
    // 1. 문의 종류 (category)
    category: selectedCategory ? selectedCategory.name : null,
    supportplan_no: formData.value.supportplan_no // supportplan_no 객체 자체가 있다면,
      ? formData.value.supportplan_no.id // 그 객체의 id만 추출
      : null, // TODO: 작성자, 등록일 등 서버에서 처리할 추가 데이터
    user_id: currentUserId,
  };
  console.log(payload);

  try {
    // 서버의 Q&A 등록 API 엔드포인트로 POST 요청을 보냅니다.
    const response = await axios.post('/api/qna/question-answer/', payload);

    if (response.status === 201 || response.status === 200) {
      toast.add({ severity: 'success', summary: '알림', detail: '성공' });
      // 성공 후 /qna 목록 페이지로 이동합니다.
      router.push('/qna');
    } else {
      toast.add({ severity: 'error', summary: '알림', detail: '등록 실패' });
    }
  } catch (error) {
    console.error('Q&A 등록 오류:', error);
    toast.add({ severity: 'error', summary: '알림', detail: '서버 오류' });
  }
};
</script> -->
<script setup>
import { QuestionSort } from '@/service/QuestionSorts';
import { SupportPlan } from '@/service/SupportPlan';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const questions = ref([]);

const questionSelection = ref([]);
const supportSelection = ref([]);

const supports = ref(null);
const formData = ref({
  title: null,
  content: null,
  category: null,
  supportplan_no: null,
});

// ✅ Pinia 스토어에서 user_id를 가져와 변수에 저장합니다.
const currentUserId = authStore.user?.id;
console.log('userid=', currentUserId);
console.log(JSON.stringify(currentUserId));
console.log(currentUserId.length);

// 🚨 onMounted 함수 수정: user_id를 SupportPlan.getSupportPlan()에 전달
onMounted(() => {
  QuestionSort.getQuestionSorts().then((data) => (questions.value = data));

  // user_id가 있을 때만 지원 계획 목록을 불러옵니다.
  if (currentUserId) {
    // SupportPlan 서비스 함수가 user_id를 인수로 받도록 변경되어야 합니다.
    SupportPlan.getSupportPlan(currentUserId).then((data) => (supports.value = data));
  } else {
    console.error('User ID가 누락되어 지원 계획을 불러올 수 없습니다.');
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '로그인 정보가 없어 지원 계획을 불러올 수 없습니다.',
    });
  }
});

function selectionList(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      questionSelection.value = [...questions.value];
    } else {
      questionSelection.value = questions.value.filter((item) => {
        return item.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
}

function selectionList2(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      const currentSupports = Array.isArray(supports.value) ? supports.value : [];
      supportSelection.value = [...currentSupports];
    } else {
      const currentSupports = Array.isArray(supports.value) ? supports.value : [];
      supportSelection.value = currentSupports.filter((item) => {
        return item.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
}

const cancel = function cancel() {
  router.go(-1);
};

// 🚨 request 함수 수정: Pinia에서 가져온 currentUserId 사용
const request = async function request() {
  // 필수 필드 검증 (예시)
  if (!formData.value.title || !formData.value.content) {
    toast.add({ severity: 'warn', summary: '알림', detail: '제목과 내용 모두 입력해주세요' });
    return;
  }

  // 🛑 Pinia에서 가져온 currentUserId 변수를 사용합니다.
  if (!currentUserId) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '로그인 정보가 누락되었습니다. 다시 로그인해주세요.',
    });
    return;
  }

  const selectedCategory = formData.value.category;
  const selectedSupportPlan = formData.value.supportplan_no;

  const payload = {
    title: formData.value.title,
    content: formData.value.content,
    // 선택된 객체에서 name 추출
    category: selectedCategory ? selectedCategory.name : null,
    // 선택된 객체에서 id만 추출
    supportplan_no: formData.value.supportplan_no?.id,
    user_id: currentUserId, // Pinia에서 가져온 user_id를 백엔드에 전달
  };
  console.log('전송 데이터:', payload);

  try {
    const response = await axios.post('/api/qna/question-answer/', payload);

    if (response.status === 201 || response.status === 200) {
      toast.add({
        severity: 'success',
        summary: '알림',
        detail: '성공적으로 등록되었습니다.',
        life: 3000,
      });
      router.push('/qna');
    } else {
      toast.add({ severity: 'error', summary: '알림', detail: '등록 실패', life: 3000 });
    }
  } catch (error) {
    console.error('Q&A 등록 오류:', error);
    toast.add({ severity: 'error', summary: '알림', detail: '서버 오류', life: 3000 });
  }
};
</script>
<template>
  <Toast />
  <Fluid class="card flex-col md:flex-row gap-2">
    <div class="md:w-3/4 flex flex-col gap-8">
      <div class="flex flex-row gap-8">
        <div class="flex flex-col gap-1 w-full">
          <div class="font-semibold text-xl">제목</div>
          <FloatLabel>
            <InputText
              id="title"
              type="text"
              v-model="formData.title"
              placeholder="제목을 입력하세요"
              class="w-full"
            />
            <label for="title"></label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex flex-row gap-10 w-full justify-start">
        <div class="font-semibold text-xl">문의 종류</div>
        <AutoComplete
          v-model="formData.category"
          :suggestions="questionSelection"
          optionLabel="name"
          placeholder="유형을 선택하세요"
          dropdown
          @complete="selectionList($event)"
        />

        <div class="font-semibold text-xl">지원 계획 선택</div>
        <AutoComplete
          v-model="formData.supportplan_no"
          :suggestions="supportSelection"
          optionLabel="name"
          placeholder="지원 계획 선택"
          dropdown
          @complete="selectionList2($event)"
        />
      </div>
      <div class="flex flex-col gap-4 w-full">
        <div class="font-semibold text-xl">질문 내용</div>
        <Textarea
          v-model="formData.content"
          placeholder="내용을 입력하세요"
          :autoResize="true"
          rows="25"
          cols="30"
          class="w-full"
        />
      </div>
      <div class="flex flex-row gap-4 w-full justify-end">
        <div class="flex flex-row gap-4 w-1/4 justify-end">
          <Button label="취소" icon="pi pi-times" severity="secondary" @click="cancel" />
          <Button label="저장" icon="pi pi-save" severity="info" @click="request" />
        </div>
      </div>
    </div>
  </Fluid>
</template>
