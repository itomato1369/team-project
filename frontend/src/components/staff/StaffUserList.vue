<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const users = ref([
    {
        id: 1,
        name: '일반 이용자 이름',
        phone: '02-1234-5678',
        status: '대기중'
    },
    {
        id: 2,
        name: '일반 이용자 이름',
        phone: '02-1234-5678',
        status: '지원중'
    }
]);

const getSeverity = (status) => {
    switch (status) {
        case '대기중':
            return 'warning';
        case '지원중':
            return 'success';
        default:
            return 'info';
    }
};
</script>

<template>
    <div class="user-list-container">
        <h2 class="list-title">이용자 목록</h2>
        <div class="user-cards">
            <Card v-for="user in users" :key="user.id" class="user-card">
                <template #header>
                    <div class="card-header">
                        <div class="user-details">
                            <p class="user-name">{{ user.name }}</p>
                            <p class="user-contact">연락처: {{ user.phone }}</p>
                        </div>
                        <Tag :value="user.status" :severity="getSeverity(user.status)" />
                    </div>
                </template>
                <template #footer>
                    <div class="card-footer">
                        <Button label="지원 계획 열람" class="p-button-info" />
                        <Button label="정보 보기" class="p-button-secondary" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.list-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}
.user-cards {
    display: grid;
    gap: 1.5rem;
}
.user-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
}
.user-name {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0;
}
.user-contact {
    color: #6c757d;
    margin: 0.25rem 0 0 0;
}
.card-footer {
    display: flex;
    gap: 0.5rem;
    padding: 0 1.5rem 1.5rem 1.5rem;
}
</style>
