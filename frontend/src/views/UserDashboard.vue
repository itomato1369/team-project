<script setup>
import { onBeforeMount, ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import Button from 'primevue/button';
import axios from 'axios';
import 'primeicons/primeicons.css';
import { useRouter } from 'vue-router'; // useRouter 추가
import { useAuthStore } from '@/stores/authStore';

const router = useRouter(); // 라우터 인스턴스
const authStore = useAuthStore();

const quickMenus = ref([
  // ... (기존 quickMenus 데이터)
  { icon: '📄', label: '공고 목록', path: 'ud/notices' },
  { icon: '📝', label: '사업 신청', path: 'ui' },
  { icon: '🧑‍🤝‍🧑', label: '피보호자 등록', path: '/umy?tab=2' },
  { icon: '📞', label: '상담 예약', path: 'counseling-apply' },
  { icon: '❓', label: 'Q&A', path: 'qna' },
  { icon: '📚', label: '자료실', path: 'ud/data-board' },
]);

const expiringNotices = ref([]);
const surveyToUserWard = ref([]);

// --- ADDED ---
// 아코디언 상태 관리를 위한 ref
// null: 모두 닫힘, 숫자: 열린 항목의 survey_no
const selectedSurveyNo = ref(null);
// --- END ADDED ---

const setExpiringNotices = async () => {
  try {
    const res = await axios.get('/api/user/user-notices');
    console.log('myResult.data', res.data);
    expiringNotices.value = res.data.result;
  } catch (err) {
    console.log(err);
  }
};
const setSurveyToUserWard = async () => {
  try {
    const res = await axios.get('/api/user/userwiter-survey', {
      params: { userId: authStore.user.id },
    });
    console.log('mySurveyResult.data', res.data);
    surveyToUserWard.value = res.data.result;
  } catch (err) {
    console.log(err);
  }
};

// --- ADDED ---
// 아코디언 토글(열기/닫기) 함수
const toggleAccordion = (surveyNo) => {
  // 이미 열려있는 항목을 다시 클릭하면 닫습니다 (null로 설정).
  if (selectedSurveyNo.value === surveyNo) {
    selectedSurveyNo.value = null;
  } else {
    // 다른 항목을 클릭하면 해당 항목의 surveyNo를 저장하여 엽니다.
    selectedSurveyNo.value = surveyNo;
  }
};

// --- ADDED ---
// '내 지원 현황'의 상세보기 버튼 클릭 시 실행될 함수
const goToInquiryDetail = async (item) => {
  // item 객체에서 survey_no를 가져옵니다.
  const surveyNo = item.survey_no;
  if (!surveyNo) {
    console.error('조사지 번호(survey_no)가 없습니다.');
    return;
  }
  router.push({
    name: 'user-survey-detail',
    params: { survey_no: surveyNo },
  });
};

onBeforeMount(() => {
  setExpiringNotices();
  setSurveyToUserWard();
});

// SearchBar가 @search 이벤트를 발생시키면 실행될 함수
const performSearch = (query) => {
  // 'uds' 페이지로 쿼리와 함께 이동 (항상 이동)
  router.push({
    name: 'uds',
    state: { searchQuery: query || '' }, // Pass empty string if query is null/undefined
  });
};
</script>

<template>
  <div class="dashboard-background">
    <div class="search-bar-wrapper">
      <SearchBar @search="performSearch" />
    </div>
    <div class="main-content-card">
      <div class="col-12 md:col-9">
        <p>자주 찾는 메뉴</p>
        <div class="Menu_Group">
          <div v-for="menu in quickMenus" :key="menu.label" class="Menu_Item">
            <router-link :to="menu.path" class="Menu_Icon_Link">
              <div class="Icon_Container">
                <!-- <i :class="menu.icon + ' menu-icon'" aria-hidden="true"></i> -->
                <span class="menu-icon">{{ menu.icon }}</span>
              </div>
            </router-link>
            <p class="Menu_Text">{{ menu.label }}</p>
          </div>
        </div>
      </div>

      <div class="support-header-row">
        <h5 class="section-title section-title--left">마감 임박 지원 / 보조금</h5>
        <div class="support-header-row-right">
          <h5 class="section-title section-title--right">내 지원 현황</h5>
        </div>
      </div>

      <div class="support-sections-row">
        <div class="support-column">
          <div v-for="item in expiringNotices" :key="item.notice_no" class="support-item">
            <h6>{{ item.business_name }}</h6>
            <p>{{ item.content }} ({{ item.business_end + ' 마감' }})</p>
          </div>
        </div>

        <div class="support-column">
          <div
            v-for="item in surveyToUserWard"
            :key="item.survey_no"
            class="accordion-item-wrapper"
          >
            <div
              class="support-status-item"
              @click="toggleAccordion(item.survey_no)"
              :class="{ 'item-open': selectedSurveyNo === item.survey_no }"
            >
              <span>{{ item.business_name }}</span>
              <span class="date">{{ item.created_at }}</span>

              <i
                :class="[
                  'pi',
                  selectedSurveyNo === item.survey_no ? 'pi-chevron-up' : 'pi-chevron-down',
                ]"
                class="accordion-icon"
              ></i>
            </div>

            <transition name="accordion-slide">
              <div v-if="selectedSurveyNo === item.survey_no" class="accordion-panel">
                <!-- --- MODIFIED --- -->
                <Button
                  label="상세보기"
                  icon="pi pi-search"
                  class="p-button-sm p-button-secondary"
                  @click="goToInquiryDetail(item)"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 그대로 유지 + 고정 위치 개선 적용 */

.dashboard-background {
  background-color: #f8f9fa;
  padding: 2rem;
  min-height: 100vh;
}

.main-content-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 1200px;
  margin: 0 auto;
}

/* ==================== 고정 위치 핵심 수정 시작 ==================== */
.support-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1.25rem 0 0.75rem 0;
  flex-wrap: nowrap; /* 줄바꿈 방지 */
  position: relative; /* 자식 absolute 기준점 */
  min-height: 40px; /* 텍스트 높이만큼 최소 높이 확보 */
  padding-right: 220px; /* 오른쪽 고정 요소 공간 확보 (필요에 따라 조정) */
  box-sizing: border-box;
}

.support-header-row-right {
  position: absolute; /* 완전 고정 */
  right: 0;
  top: 50%;
  transform: translateY(-50%); /* 수직 중앙 정렬 */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
  z-index: 10;
}

/* 변수 사용 안 해도 되게끔 고정 너비로 변경 (필요시 px 값 조정) */
.section-title--right {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 왼쪽 타이틀은 기존처럼 남은 공간 꽉 채우기 */
.section-title--left {
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 1rem; /* 오른쪽 고정 요소와 겹치지 않게 여유 */
}
/* ==================== 고정 위치 핵심 수정 끝 ==================== */

.search-bar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.support-sections-row {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.support-column {
  flex: 1 1 48%;
  min-width: 280px;
  box-sizing: border-box;
  border: 1px solid #000;
  border-radius: 10px;
  padding: 0.75rem;
  max-height: 250px;
  overflow-y: auto;
}

.Menu_Group {
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.Menu_Item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #4b5563;
  transition: all 200ms ease-in-out;
  flex-basis: 16%;
  padding: 0.5rem;
}

.Menu_Item:has(.Icon_Container:hover) {
  transform: translateY(-4px);
  color: #4f46e5;
}

.Icon_Container {
  width: 80px;
  height: 80px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.menu-icon {
  font-size: 2rem;
}

.support-item {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.support-item h6 {
  margin: 0 0 0.5rem 0;
}

.support-item p {
  margin: 0;
  color: #6b6b6b;
}

/* 아코디언 관련 스타일 (기존 그대로) */
.support-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #e6e6e6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.support-status-item > span:first-of-type {
  flex: 1;
  margin-right: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.support-status-item > span.date {
  flex-shrink: 0;
  width: 100px;
  text-align: right;
  margin-right: 0.75rem;
}

.support-status-item:hover {
  background-color: #f9f9f9;
}

.support-status-item.item-open {
  background-color: #f5f5f5;
  font-weight: 600;
}

.accordion-item-wrapper:last-child .support-status-item:not(.item-open) {
  border-bottom: none;
}

.support-status-item .date {
  color: #6b6b6b;
}

.accordion-icon {
  margin-left: 0.75rem;
  color: #888;
  font-size: 0.9rem;
}

.accordion-panel {
  padding: 1rem 1.25rem;
  background-color: #fdfdfd;
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
  color: #333;
}

.accordion-item-wrapper:last-child .accordion-panel {
  border-bottom: none;
}

.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 150px;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

/* 반응형 – 작은 화면에서도 오른쪽 타이틀 고정 유지 */
@media (max-width: 992px) {
  .support-header-row {
    padding-right: 200px; /* 모바일에서도 공간 확보 */
  }

  .support-header-row-right {
    right: 0;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .support-column {
    flex-basis: 100%;
  }

  .support-header-row {
    padding-right: 180px; /* 필요시 더 줄여도 됨 */
  }

  .support-header-row-right {
    font-size: 0.95rem;
  }
}
</style>
