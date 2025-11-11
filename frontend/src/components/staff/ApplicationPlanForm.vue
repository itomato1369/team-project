<script setup>
import { ref } from 'vue';
// 템플릿에서 사용하는 PrimeVue 컴포넌트들을 import 합니다.
// Fluid는 PrimeVue 표준 컴포넌트가 아닌 것 같아 import에서 제외했습니다.
// 만약 Fluid가 커스텀 컴포넌트라면 경로에 맞게 import 해주세요.
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select'; // PrimeVue 4+ (이전 버전은 Dropdown)

const dropdownItems = ref([
  { name: '1번 사업', code: 'Option 1' },
  { name: '2번 사업', code: 'Option 2' },
  { name: '3번 사업', code: 'Option 2' },
  { name: '4번 사업', code: 'Option 2' },
  { name: '5번 사업', code: 'Option 2' },
  { name: '6번 사업', code: 'Option 2' },
]);

const dropdownItem = ref(null);
</script>

<template>
  <div class="md:w-1/2">
    <Fluid>
      <h1>지원계획 입력하기</h1>
      <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
          <div class="font-semibold text-xl">지원서이름</div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <label for="firstname2">작성자</label>
              <InputText id="firstname2" type="text" />
            </div>
            <div class="flex flex-wrap gap-2 w-full">
              <label for="lastname2">담당자</label>
              <InputText id="lastname2" type="text" />
            </div>
          </div>

          <div class="flex flex-wrap">
            <label for="address">내용</label>
            <Textarea id="address" rows="4" />
          </div>

          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <label for="state">지원계획</label>
              <Select
                id="state"
                v-model="dropdownItem"
                :options="dropdownItems"
                optionLabel="name"
                placeholder="Select One"
                class="w-full"
              ></Select>
            </div>
            <div class="flex flex-wrap gap-2 w-full">
              <label for="zip">금액</label>
              <InputText id="zip" type="text" />
            </div>
          </div>
        </div>
      </div>
    </Fluid>
  </div>
</template>
