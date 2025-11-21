<script setup>
import { RegistFileForm1 } from './RegistFileForm.js';
import { ref } from 'vue';

// 2. Composable을 호출하여 필요한 모든 것을 "구조 분해 할당"으로 가져옵니다.
const { institutionList, basicInfo, requestApproval } = RegistFileForm1();
// 3. 업로드된 파일을 담을 반응형 변수를 추가합니다.
const uploadedFile = ref(null);

// 파일 선택/업로드 성공 시 호출될 핸들러 함수
const onFileUpload = (event) => {
  // PrimeVue FileUpload 컴포넌트는 event.files 배열에 업로드된 파일을 담습니다.
  // 단일 파일만 허용하는 경우 첫 번째 파일을 가져옵니다.
  if (event.files && event.files.length > 0) {
    uploadedFile.value = event.files[0];
    console.log('선택된 파일:', uploadedFile.value.name);
  }
};

// 파일을 지울 때 호출될 핸들러 함수 (선택 사항)
const onFileRemove = () => {
  uploadedFile.value = null;
  console.log('파일이 제거되었습니다.');
};

// 4. 등록 요청 함수를 수정하여 파일 데이터를 포함시킵니다.
// ⭐️ 4. 등록 요청 함수를 수정 (기존 submitRequest 대신 이 함수를 사용)
const handleFinalSubmit = () => {
  // ⭐️ requestApproval 함수를 호출하면서 uploadedFile.value를 인수로 전달합니다.
  requestApproval(uploadedFile.value);
};
</script>
<template>
  <div class="flex flex-col md:flex-row gap-8">
    <div class="md:w-1/2 flex flex-col gap-8">
      <div class="card flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <label for="name1">자료명</label>
          <InputText id="name1" type="text" v-model="basicInfo.title" />
        </div>

        <div class="flex flex-col gap-3">
          <label for="institution_name">작성기관</label>
          <Select
            code="institution_name"
            v-model="basicInfo.institution_name"
            :options="institutionList"
            optionLabel="name"
            optionValue="code"
            placeholder="미선택"
            class="w-full"
          ></Select>
        </div>

        <div class="flex flex-col gap-3">
          <label for="fileWriter">작성자</label>
          <InputText id="name1" type="text" v-model="basicInfo.writer" />
        </div>
        <div class="flex flex-col gap-3">
          <label for="title">파일첨부</label>
          <FileUpload
            name="filedata"
            :multiple="false"
            :customUpload="true"
            @select="onFileUpload"
            @remove="onFileRemove"
            :auto="false"
            :showUploadButton="false"
            :showCancelButton="true"
            accept=".pdf,.doc,.docx,.hwp,.zip, jpg, jpeg, png, gif"
            :maxFileSize="10000000"
          >
            <template #empty>
              <p>파일을 드래그 앤 드롭하거나 선택해주세요.</p>
            </template>
          </FileUpload>
        </div>
        <Button label="등록 요청" icon="pi pi-send" severity="info" @click="handleFinalSubmit" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
