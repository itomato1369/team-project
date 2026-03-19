import axios from 'axios';

// 회원가입 제출 처리 함수
const handleSignUp = async () => {
  // 에러 메시지 초기화
  passwordError.value = '';
  termsError.value = '';
  serverError.value = '';
  // 유효성 검사
  if (password.value !== confirmPassword.value) {
    passwordError.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    return;
  }
  if (!agreeTerms.value) {
    termsError.value = '필수 약관에 동의해야 회원가입을 완료할 수 있습니다.';
    return;
  }
  // 생년월일 통합(YYYY-MM-DD) .padStart(4, '0') mariaDB 날짜표기 통합
  const birthDate = `${birthYear.value.padStart(4, '0')}-${birthMonth.value.padStart(2, '0')}-${birthDay.value.padStart(2, '0')}`;

  // 주소 통합
  const fullAddress = `${zipcode.value}!${addressMain.value}${addressDetail.value ? '! ' + addressDetail.value : ''}`;

  // backend로 전송할 최종 데이터 객체
  const signUpData = {
    userId: userId.value,
    password: password.value,
    name: name.value,
    birthDate: birthDate,
    email: email.value,
    phone: phone.value,
    fullAddress: fullAddress,
    role: selectedRole.value,
  };
  // backend API로 POST 요청
  try {
    const nodeApiUrl = '/api/register';

    await axios.post(nodeApiUrl, signUpData);
    alert('회원가입이 완료되었습니다');

    goToLogin();
  } catch (error) {
    // 요청 실패
    console.error('회원가입 실패');
    // 이미 등록된 이용자
    if (error.response) {
      // HTTP 상태 코드가 409인지 확인
      if (error.response.status === 409) {
        serverError.value = '이미 등록된 이용자 입니다!';
      } else {
        // 기타 에러 처리
        const errorMessage = error.response.data.message;
        serverError.value =
          errorMessage || `회원가입 중 서버 오류 (Code: ${error.response.status})`;
      }
    } else {
      // 네트워크 오류 등 응답이 없는 경우
      serverError.value = '네트워크 오류가 발생했습니다. 다시 시도해 주세요';
    }
  }
};


// 아이디 중복 확인 함수
const checkIdDuplicate = async () => {
  idCheckMessage.value = '';

  if (!userId.value) {
    idCheckMessage.value = '아이디를 입력해주세요';
    return;
  }

  try {
    const res = await axios.get('/api/register/check', { params: { userId: userId.value } });

    // 아이디 중복 확인
    if (res.data.exists) {
      idCheckMessage.value = '이미 가입된 아이디 입니다';
    } else {
      idCheckMessage.value = '사용 가능한 아이디 입니다';
    }
  } catch (error) {
    idCheckMessage.value = '아이디 중복 검사 중 오류발생';
  }
};

// 우편번호 검색 함수 (모달 열기)
const searchZipcode = () => {
  isPostcodeOpen.value = true;
  apiLoadError.value = ''; // 에러 메시지 초기화
};

// 우편번호 검색 완료 시 처리 함수
// DAUM API ddd
const addressSearched = (data) => {
  // 모달 닫기
  isPostcodeOpen.value = false;
  // 기본 주소 (vue-daum-postcode가 제공)
  let fullAddress = '';
  let extraAddr = '';

  if (data.userSelectedType === 'R') {
    // 도로명 주소
    fullAddress = data.roadAddress;
  } else {
    // 지번 주소
    fullAddress = data.jibunAddress;
  }
  // 참고항목 (법정동명, 건물명 등)
  if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
    extraAddr += data.bname;
  }
  if (data.buildingName !== '' && data.apartment === 'Y') {
    extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
  }
  if (extraAddr !== '') {
    fullAddress += `(${extraAddr})`;
  }
  // 상태 변수 업데이트
  zipcode.value = data.zonecode;
  addressMain.value = fullAddress;
  addressDetail.value = ''; // 상세 주소 초기화
  // 상세 주소는 이용자가 직접 입력하도록 포커스스
  setTimeout(() => {
    document.getElementById('address-detail')?.focus();
  }, 100);
};


// 우편번호 찾기 화면 닫기
const closePostcode = () => {
  isPostcodeOpen.value = false;
};

// 必須
export default { checkIdDuplicate, handleSignUp, searchZipcode, addressSearched, closePostcode }; 

