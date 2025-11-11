<script setup>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
</script>

<template>
  <div class="w=1">
    <div class="col-12">
      <div class="card">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText type="text" placeholder="무엇이 궁금하신가요?" />
        </span>

        <div class="t-2">
          <Chip label="#조사지 작성방법" class="r-2" />
          <Chip label="#피부양자 등록" />
        </div>
      </div>
      <div class="card">
        <div class="font-semibold text-xl mb-4">Splitter</div>
        <Splitter style="height: 160px" class="mb-5">
          <SplitterPanel :size="80" class="flex align-items-center justify-content-center">
            자주찾는메뉴
          </SplitterPanel>

          <SplitterPanel :size="20" class="flex align-items-center justify-content-center">
            고라니어서오고
          </SplitterPanel>
        </Splitter>

        <Splitter style="height: 300px" class="mb-5">
          <SplitterPanel :size="30" class="flex align-items-center justify-content-center">
            Panel 1
          </SplitterPanel>

          <SplitterPanel :size="60" class="flex align-items-center justify-content-center">
            Panel 2
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  이 파일 안에서만 적용되는 CSS입니다.
*/

/* 항목 4: 자주 찾는 메뉴 버튼 스타일 */
.nav-button {
  width: 100%;
}
:deep(.nav-button .p-button-label) {
  margin-left: 0;
  margin-top: 0.5rem;
}
:deep(.nav-button .p-button-icon) {
  font-size: 1.8rem;
}
:deep(.nav-button) {
  flex-direction: column;
  height: 100px;
}
/* 항목 4: 마우스 오버 시 그림자 */
.nav-button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-color: transparent !important;
}
</style>
