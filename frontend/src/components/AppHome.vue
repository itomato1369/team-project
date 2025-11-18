<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 로그인 화면으로 이동하는 함수
const goToLogin = () => {
  router.push({ name: 'login' });
};
// 회원가입 화면으로 이동하는 함수
const goToSignUp = () => {
  router.push({ name: 'signup' });
};
</script>

<template>
  <div class="home-container">
    <!-- 1. 배경 영상 영역 (z-index: 1) -->
    <div class="background-video-container">
      <video autoplay muted loop class="background-video">
        <!-- 루트 경로 사용: public/video/배경동영상.mp4 -->
        <source src="/video/같이한다는느낌.mp4" type="video/mp4" />
      </video>
      <!-- 어둡게 만드는 오버레이 (z-index: 2) -->
      <div class="video-overlay"></div>
    </div>

    <!-- 2. 메인 콘텐츠 영역 (z-index: 10, 선명하게 보여야 함) -->
    <div class="header-content content-foreground">
      <h1 class="main-title">발달 장애인 지원 대기 프로그램</h1>
      <p class="tagline">맞춤형 지원을 위한 첫걸음을 시작하세요.</p>
    </div>

    <div class="button-group content-foreground">
      <!-- goToLogin함수 호출 -->
      <button @click="goToLogin" class="btn btn-primary">로그인</button>
      <button @click="goToSignUp" class="btn btn-secondary">회원가입</button>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------- */
/* 1. 기본 레이아웃 및 배경 영상 컨테이너 */
/* -------------------------------------- */
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 중앙 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  min-height: 100vh; /* 뷰포트 전체 높이 사용 */
  text-align: center;
  position: relative; /* 자식 요소 절대 위치 기준 */
  overflow: hidden; /* 영상 넘치는 것 방지 */
  padding: 40px;
  /* ⚠️ 기존의 밝은 배경색 (#f8f9fa) 제거. 영상이 로딩되지 않을 경우 대비해 어두운 색 유지 */
  background-color: #2c3e50;
}

/* -------------------------------------- */
/* 2. 배경 영상 스타일 (Video Background Styling) */
/* -------------------------------------- */
.background-video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1; /* 가장 아래 레이어 */
}

.background-video {
  /* 화면을 완전히 덮도록 설정 */
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 중앙 정렬 */

  /* 🟢 핵심: 흐릿하게 만들어 콘텐츠 가독성 확보 */
  filter: blur(4px);
  opacity: 1; /* 투명도를 조절하여 덜 산만하게 만듦 */
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 🟢 핵심: 어두운 오버레이를 덮어 텍스트 대비 향상 */
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 2; /* 영상 위에 있지만 콘텐츠보다는 아래에 위치 */
}

/* -------------------------------------- */
/* 3. 콘텐츠 전경 스타일 (Foreground Content Styling) */
/* -------------------------------------- */
.content-foreground {
  position: relative;
  z-index: 10; /* 영상과 오버레이보다 훨씬 위에 위치하여 선명하게 보임 */
}

.header-content {
  margin-bottom: 60px;
  /* ⚠️ 배경이 어두워졌으므로 text-shadow 제거 */
  text-shadow: none;
}

.main-title {
  font-size: 3em;
  /* 🟢 핵심: 텍스트 색상을 흰색으로 변경 */
  color: white;
  margin-bottom: 10px;
  font-weight: 800;
  line-height: 1.3;
}

.tagline {
  font-size: 1.2em;
  /* 🟢 핵심: 텍스트 색상을 밝은 회색으로 변경 */
  color: #bdc3c7;
  font-weight: 400;
}

/* -------------------------------------- */
/* 4. 버튼 그룹 스타일 (기존 스타일 유지 및 대비 강조) */
/* -------------------------------------- */
.button-group {
  display: flex;
  gap: 25px;
}

.btn {
  padding: 15px 35px;
  font-size: 1.1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  /* 버튼 그림자를 약간 강조하여 배경에서 분리 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 주 버튼 (로그인/회원가입) 스타일은 그대로 유지합니다. */
.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  /* 흰색 배경이 어두운 영상 위에서 잘 보이도록 유지 */
  background-color: white;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-secondary:hover {
  background-color: #eaf3fb;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>
