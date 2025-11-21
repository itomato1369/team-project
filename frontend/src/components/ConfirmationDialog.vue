<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

// [1] Props: 부모 컴포넌트로부터 표시 여부(visible)와
// 팝업에 표시될 피보호자명(wardName), 예약시간(confirmationDateTime)을 전달받습니다.
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  wardName: String,
  confirmationDateTime: String,
});

// [2] Emits: 사용자의 액션('닫기' 클릭, '목록보기' 클릭)을
// 부모 컴포넌트에게 이벤트로 알립니다.
const emit = defineEmits(['close', 'goToHistory']);
</script>

<template>
  <Dialog
    :visible="visible"
    @hide="emit('close')"
    modal
    header="상담 신청 완료"
    :style="{ width: '450px' }"
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
  >
    <div class="w-full flex flex-column items-center">
      <i class="pi pi-check-circle text-green-500 text-5xl mb-4"></i>

      <!-- 중앙 정렬 보장 -->
      <p class="line-height-3 w-full text-center">
        {{ wardName }}님 {{ confirmationDateTime }} 상담이 예약되었습니다.
      </p>
    </div>

    <template #footer>
      <div class="flex w-full gap-2">
        <Button label="목록보기" @click="emit('goToHistory')" class="p-button-text flex-1" />
        <Button label="닫기" @click="emit('close')" autofocus class="flex-1" />
      </div>
    </template>
  </Dialog>
</template>
