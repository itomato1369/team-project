<script setup>
import { RegistFileForm1 } from './RegistFileForm.js';

// 2. Composable을 호출하여 필요한 모든 것을 "구조 분해 할당"으로 가져옵니다.
const { institutionList, basicInfo, requestApproval } = RegistFileForm1();
</script>

<template>
  <Fluid>
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
          </div>
          <Button label="등록 요청" icon="pi pi-send" severity="info" @click="requestApproval" />
        </div>
      </div>
    </div>
  </Fluid>
</template>

<style lang="scss" scoped></style>
