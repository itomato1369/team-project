<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const searchQuery = ref('');

const waitingUsers = ref([
  { id: 1, name: '김대기', info: '일반이용자, 담당자, 관리자 중 1 + 회원 정보' },
  { id: 2, name: '이승인', info: '일반이용자, 담당자, 관리자 중 1 + 회원 정보' },
  { id: 3, name: '박보류', info: '일반이용자, 담당자, 관리자 중 1 + 회원 정보' },
  { id: 4, name: '최검토', info: '일반이용자, 담당자, 관리자 중 1 + 회원 정보' },
]);
</script>

<template>
  <div class="approval-background">
    <div class="approval-list-card">
      <div class="search-bar">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <InputText v-model="searchQuery" placeholder="승인할 이용자 검색" />
        </span>
      </div>
      <h2 class="list-title">이용자 승인 대기목록</h2>
      <ul class="user-list">
        <li v-for="user in waitingUsers" :key="user.id" class="user-item">
          <div class="user-info">
            <p class="user-name">{{ user.name }}</p>
            <p class="user-details">{{ user.info }}</p>
          </div>
          <div class="user-actions">
            <Button label="승인" class="p-button-info" />
            <Button label="거부" class="p-button-danger" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.approval-background {
  background-color: #f8f9fa;
  padding: 2rem;
  min-height: 100vh;
}
.approval-list-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 1200px;
  margin: 0 auto;
}
.search-bar {
  margin-bottom: 2rem;
}
.search-bar .p-inputtext {
  width: 100%;
}
.list-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}
.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}
.user-item:last-child {
  border-bottom: none;
}
.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}
.user-details {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}
.user-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
