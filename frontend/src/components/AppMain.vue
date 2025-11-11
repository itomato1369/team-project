<script setup>
import { ref } from 'vue';

const MenuBar = ref({ icon: 'pi pi-home', to: '/' });
const MenuBarItem = ref([{ label: '메인페이지' }]);
</script>
<template>
  <div class="container-center-screen-top-further">
    <div class="card-wrapper">
      <div class="flex justify-center">
        <IconField iconPosition="left" class="max-width-large">
          <InputIcon class="pi pi-search" />
          <InputText type="text" placeholder="무엇이 궁금하신가요?" class="full-width" />
        </IconField>
      </div>

      <div class="font-normal text-xl mb-4">
        메뉴바
        <Breadcrumb :home="MenuBar" :model="MenuBarItem" />
      </div>

      <p>자주 찾는 메뉴</p>
      <div class="Menu_Group">
        <!-- 아직 전체 구현이 안되었기에 클릭하면 오류 발생 -->
        <!-- 사이드바에 일반 사용자 유저 이름 로그아웃 버튼 (일반 사용자 메인 페이지 참조) -->
        <a href="#" class="Menu_Item" @click.prevent="alert('사업 신청 페이지 이동')">
          <div class="Icon_Container">
            <span class="Icon_Placeholder">📝</span>
          </div>
          <p class="Menu_Text">사업 신청</p>
        </a>

        <a href="#" class="Menu_Item" @click.prevent="alert('피보호자 등록 페이지 이동')">
          <div class="Icon_Container">
            <span class="Icon_Placeholder">🧑‍🤝‍🧑</span>
          </div>
          <p class="Menu_Text">피보호자 등록</p>
        </a>

        <a href="#" class="Menu_Item" @click.prevent="alert('상담예약 페이지 이동')">
          <div class="Icon_Container">
            <span class="Icon_Placeholder">📞</span>
          </div>
          <p class="Menu_Text">상담예약</p>
        </a>

        <a href="#" class="Menu_Item" @click.prevent="alert('Q&A 페이지 이동')">
          <div class="Icon_Container">
            <span class="Icon_Placeholder">❓</span>
          </div>
          <p class="Menu_Text">Q&A</p>
        </a>

        <a href="#" class="Menu_Item" @click.prevent="alert('자료실 페이지 이동')">
          <div class="Icon_Container">
            <span class="Icon_Placeholder">📚</span>
          </div>
          <p class="Menu_Text">자료실</p>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* =======================================================
   1. Layout (Container and Positioning)
   ======================================================= */
.container-center-screen-top-further {
  /* 기존: flex justify-center pt-10 */
  display: flex; /* Enable flexible layout */
  justify-content: center; /* Center horizontally */
  padding-top: 5rem; /* pt-20에 해당하는 값으로 늘려 더 밑으로 이동 (기존 2.5rem -> 5rem) */
}

.card-wrapper {
  /* Tailwind: card w-full max-w-4xl */
  width: 100%; /* Take full width of parent */
  max-width: 56rem; /* Limit maximum width (max-w-4xl) */
  /* Note: The 'card' styling (background, shadow, etc.) would be defined here in a real project. */
}

/* =======================================================
   2. Input Field Size and Styling
   ======================================================= */
.max-width-large {
  /* 기존: max-width-medium (max-w-md) */
  max-width: 32rem; /* 입력 필드의 최대 너비를 32rem (약 512px)로 늘림 */
  width: 100%; /* Ensure it fills the allowed space */
}

.full-width {
  /* Tailwind: w-full */
  width: 100%; /* Ensure the element uses the full available width */
}

/* =======================================================
   3. Quick Menu Header Style
   ======================================================= */
.Menu_Header {
  /* Tailwind: text-lg font-semibold text-gray-800 mb-3 ml-2 */
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  color: #1f2937; /* text-gray-800 */
  margin-bottom: 0.75rem; /* mb-3 */
  margin-left: 0.5rem; /* ml-2 */
}

/* =======================================================
   4. Quick Menu Group Style (자주 찾는 메뉴 스타일)
   ======================================================= */
.Menu_Group {
  /* Tailwind: flex justify-between p-4 bg-white rounded-xl shadow-lg */
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 1rem; /* 상하 패딩 확대 */
  background-color: white;
  border-radius: 1rem; /* 모서리 둥글게 */
  /* 명확하고 부드러운 그림자 효과 */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
}

.Menu_Item {
  /* flex flex-col items-center */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #4b5563; /* text-gray-600 */
  transition: all 200ms ease-in-out;
  flex-basis: 18%; /* 5개 메뉴가 균등하게 공간을 차지 */
  min-width: 4.5rem; /* 아이템 최소 너비 */
  padding: 0.5rem;
}

.Menu_Item:hover {
  transform: translateY(-4px); /* 호버 시 떠오르는 효과 강조 */
  color: #4f46e5; /* hover:text-indigo-600 */
}

.Icon_Container {
  /* h-14 w-14 bg-indigo-50 rounded-full flex items-center justify-center mb-2 */
  height: 3.5rem; /* 아이콘 컨테이너 크기 약간 확대 */
  width: 3.5rem;
  background-color: #f0f4ff; /* indigo-50 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  /* 부드러운 테두리 */
  border: 1px solid #c7d2fe; /* indigo-200 */
}

.Icon_Placeholder {
  /* text-2xl text-indigo-600 */
  font-size: 1.5rem; /* 아이콘 크기 확대 */
  color: #4f46e5; /* indigo-600 */
}

.Menu_Text {
  /* text-sm font-medium */
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}
</style>
