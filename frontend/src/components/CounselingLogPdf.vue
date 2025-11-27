<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const pdfContentRef = ref(null);

defineExpose({
  pdfContentRef,
});
</script>

<template>
  <div ref="pdfContentRef" class="pdf-template bg-white p-10 text-black">
    <div class="text-center mb-8 border-b-2 border-black pb-4">
      <h1 class="text-3xl font-serif font-bold mb-2">상 담 일 지</h1>
      <p class="text-sm text-gray-500 text-right">
        작성일: {{ data.consult_datetime || 'YYYY-MM-DD' }}
      </p>
    </div>

    <table class="w-full border-collapse border border-black mb-8 text-sm">
      <colgroup>
        <col class="w-1/6 bg-gray-50" />
        <col class="w-2/6" />
        <col class="w-1/6 bg-gray-50" />
        <col class="w-2/6" />
      </colgroup>
      <tbody>
        <tr>
          <th class="border border-black p-2 font-bold bg-gray-50 text-center">담당직원</th>
          <td class="border border-black p-2">{{ data.staff_name }}</td>
          <th class="border border-black p-2 font-bold bg-gray-50 text-center">상담일시</th>
          <td class="border border-black p-2">{{ data.consult_datetime }}</td>
        </tr>
        <tr>
          <th class="border border-black p-2 font-bold bg-gray-50 text-center">피보호자</th>
          <td class="border border-black p-2">{{ data.ward_name }}</td>
          <th class="border border-black p-2 font-bold bg-gray-50 text-center">보호자</th>
          <td class="border border-black p-2">{{ data.guardian_name }}</td>
        </tr>
        <tr>
          <th class="border border-black p-2 font-bold bg-gray-50 text-center">장애정도</th>
          <td class="border border-black p-2">{{ data.disabled_level }}</td>
          <th class="border border-black p-2 font-bold bg-gray-50 text-center">진행상태</th>
          <td class="border border-black p-2">{{ data.consult_status }}</td>
        </tr>
      </tbody>
    </table>

    <div class="border border-black min-h-[500px] p-4 mb-6">
      <h3 class="font-bold border-b border-gray-300 pb-2 mb-4">상담 상세 내용</h3>
      <div class="whitespace-pre-wrap leading-relaxed">
        {{ data.content }}
      </div>
    </div>

    <div class="flex justify-between items-end mt-12">
      <div class="pb-1 whitespace-nowrap">
        <p class="font-medium text-base">위와 같이 상담하였음을 확인합니다.</p>
      </div>

      <div class="flex space-x-8">
        <div class="text-right whitespace-nowrap">
          <span class="font-bold">상담자:</span>
          <span class="inline-block border-b border-black w-24 mx-2"></span> (인)
        </div>
        <div class="text-right whitespace-nowrap">
          <span class="font-bold">확인자:</span>
          <span class="inline-block border-b border-black w-24 mx-2"></span> (인)
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-template {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
}
</style>
