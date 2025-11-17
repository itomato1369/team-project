<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';

// --- 상태 관리 ---
const isEditing = ref(false); // '변경하기' 모드 활성화 상태
const institutionStatus = ref({ value: '운영', label: '운영' }); // 현재 기관 상태
const tempStatus = ref({ value: '운영', label: '운영' }); // 드롭다운에서 선택한 임시 상태

const statusOptions = ref([
    { value: '운영', label: '운영' },
    { value: '휴업', label: '휴업' },
    { value: '종료', label: '종료' }
]);

const breakDate = ref();
const closingNotice = ref('');

// --- 함수 ---
function startEditing() {
    isEditing.value = true;
    tempStatus.value = institutionStatus.value; // 편집 시작 시 현재 상태로 초기화
}

function cancelEditing() {
    isEditing.value = false;
}

function applyStatusChange() {
    institutionStatus.value = tempStatus.value;
    isEditing.value = false;
    // 실제 애플리케이션에서는 여기서 API 호출을 통해 서버에 변경사항을 저장합니다.
}

</script>

<template>
    <div class="institution-state-container">
        <h2 class="section-title">기관 상태 관리</h2>

        <!-- Display View (isEditing = false) -->
        <div v-if="!isEditing" class="display-section">
            <div class="status-display">
                <i class="pi pi-power-off status-icon"></i>
                <p v-if="institutionStatus.value === '휴업'">현재 00기관은 ({{ breakDate ? breakDate.toLocaleDateString() : '미정' }} 부터 휴업) 상태입니다</p>
                <p v-else>현재 00기관은 <span :class="`status-text-${institutionStatus.value}`">({{ institutionStatus.label }})</span> 상태입니다</p>
            </div>
            <Button label="기관 상태 변경하기" @click="startEditing" />
        </div>

        <!-- Edit View (isEditing = true) -->
        <div v-else class="edit-section">
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6">
                    <label for="status-dropdown">상태 목록</label>
                    <Dropdown id="status-dropdown" v-model="tempStatus" :options="statusOptions" optionLabel="label" placeholder="상태 선택"></Dropdown>
                </div>
            </div>

            <!-- Conditional Inputs -->
            <div v-if="tempStatus.value === '휴업'" class="conditional-input">
                <label for="break-date">휴업 기간 입력</label>
                <Calendar id="break-date" v-model="breakDate" showIcon />
            </div>

            <div v-if="tempStatus.value === '종료'" class="conditional-input">
                <label for="closing-notice">기관 종료 공지</label>
                <Textarea id="closing-notice" v-model="closingNotice" rows="5" placeholder="공지 내용을 입력하세요." />
            </div>

            <div class="edit-actions">
                <Button label="취소" class="p-button-secondary" @click="cancelEditing" />
                <Button label="변경하기" @click="applyStatusChange" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.institution-state-container {
    padding: 2rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
}
.section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
}

/* Display View */
.display-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
}
.status-display {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
}
.status-icon {
    font-size: 3rem;
    margin-right: 1.5rem;
    color: #6c757d;
}
.status-display p {
    font-size: 1.25rem;
    margin: 0;
}
.status-text-운영 {
    color: #28a745;
    font-weight: bold;
}
.status-text-종료 {
    color: #dc3545;
    font-weight: bold;
}

/* Edit View */
.edit-section {
    padding: 1rem;
}
.conditional-input {
    margin-top: 1.5rem;
}
.edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 2rem;
}
label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}
</style>
