<script setup>
import { ref, onBeforeMount } from 'vue'; // onBeforeMount 추가

// --- 옵션 목록 (기존과 동일) ---
const dropdownItems = ref([
  { name: 'Option 1', code: 'Option 1' },
  { name: 'Option 2', code: 'Option 2' },
  { name: 'Option 3', code: 'Option 3' },
]);
const businessItems = ref([
  { name: '사업명 1', code: 'Business 1' },
  { name: '사업명 2', code: 'Business 2' },
  { name: '사업명 3', code: 'Business 3' },
]);
const statuses = ref([
  { name: '상태1', code: 'status 1' },
  { name: '상태2', code: 'status 2' },
  { name: '상태3', code: 'status 3' },
]);
const responses = ref([
  { name: '서술형', code: 'response 1' },
  { name: 'O/X', code: 'response 2' },
  { name: '선택형', code: 'response 3' },
]);
const priorityList = ref([
  { name: '긴급', code: 'priority 1' },
  { name: '중점', code: 'priority 2' },
  { name: '계획', code: 'priority 3' },
]);

// --- v-model 바인딩용 Ref ---
const dropdownItem = ref(null);
const businessItem = ref(null);
const status = ref(null);

// [수정] 단일 ref 대신, 질문 폼 객체들을 담을 배열
const questionList = ref([]);

/**
 * [신규] 새 질문 폼의 기본 객체를 생성하는 헬퍼 함수
 */
function createNewQuestion() {
  return {
    id: Date.now(), // 고유 Key
    content: '',
    responseType: null,
    required: false,
    priority: null,
  };
}

// [신규] 페이지가 처음 로드될 때 1개의 질문 폼을 미리 추가
onBeforeMount(() => {
  questionList.value.push(createNewQuestion());
});

/**
 * [수정] '추가' 버튼은 questionList 배열에 새 폼 객체를 추가
 */
function addForm() {
  questionList.value.push(createNewQuestion());
}

/**
 * [수정] '삭제' 버튼은 배열에서 해당 인덱스의 폼을 제거
 */
function removeQuestion(index) {
  // 최소 1개의 폼은 남겨두기 (선택 사항)
  if (questionList.value.length > 1) {
    questionList.value.splice(index, 1);
  } else {
    console.warn('최소 1개의 질문이 필요합니다.');
  }
}
</script>

<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/2 flex flex-col gap-8">
        <div class="card flex flex-col gap-4">
          <div class="font-semibold text-xl">조사지 기본 정보</div>

          <div class="flex flex-col gap-2">
            <label for="name1">조사지명</label>
            <InputText id="name1" type="text" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="businessName">사업명</label>
            <Select
              id="businessName"
              v-model="businessItem"
              :options="businessItems"
              optionLabel="name"
              placeholder="미선택"
              class="w-full"
            ></Select>
          </div>

          <div class="flex flex-col gap-2">
            <label for="surveyStatus">상태</label>
            <Select
              id="surveyStatus"
              v-model="status"
              :options="statuses"
              optionLabel="name"
              placeholder="미선택"
              class="w-full"
            ></Select>
          </div>
        </div>

        <div class="card flex flex-col gap-4">
          <div class="font-semibold text-xl">질문목록</div>

          <div
            v-for="(question, index) in questionList"
            :key="question.id"
            class="flex flex-col gap-4 p-4 border rounded-lg relative"
          >
            <span class="font-medium text-lg"
              >질문 {{ index + 1 }}

              <Button
                icon="pi pi-times"
                severity="danger"
                text
                rounded
                @click="removeQuestion(index)"
                class="absolute top-0 right-0"
                v-if="questionList.length > 1"
              />
            </span>

            <div class="flex flex-col grow basis-0 gap-2">
              <label :for="'questionContent-' + index">질문내용</label>
              <InputText
                v-model="question.content"
                :id="'questionContent-' + index"
                type="text"
                placeholder="질문 내용을 입력하세요."
              />
            </div>

            <div class="flex flex-wrap grow basis-0 gap-2">
              <label :for="'responseType-' + index">답변유형</label>
              <Select
                :id="'responseType-' + index"
                v-model="question.responseType"
                :options="responses"
                optionLabel="name"
                placeholder="유형을 선택하세요"
                class="w-full"
              ></Select>

              <div class="flex items-center gap-2">
                <Checkbox
                  v-model="question.required"
                  :inputId="'essential-' + index"
                  :binary="true"
                />
                <label :for="'essential-' + index">필수 여부</label>
              </div>
            </div>

            <div class="flex flex-wrap grow basis-0 gap-2">
              <label :for="'priority-' + index">우선 순위</label>
              <Select
                :id="'priority-' + index"
                v-model="question.priority"
                :options="priorityList"
                optionLabel="name"
                placeholder="우선 순위를 선택하세요"
                class="w-full"
              ></Select>
            </div>
          </div>

          <div class="flex justify-center mt-4">
            <Button label="질문 추가" icon="pi pi-plus" severity="info" @click="addForm" outlined />
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>
