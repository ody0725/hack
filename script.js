(() => {
  const form = document.getElementById('admission-form');
  const error = document.getElementById('form-error');

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const formatBirthDate = (value) => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length !== 3) return value;
    return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
  };

  const resultHtml = (data, cssHref) => `<!doctype html>
<html lang="ko" class="result-view">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>2027학년도 수시모집 합격자 발표</title>
<link rel="stylesheet" href="${escapeHtml(cssHref)}">
</head>
<body class="result-view">
  <main class="page-shell">
    <header class="page-header">
      <h1>2027학년도 수시모집 합격자 발표</h1>
      <a class="official-logo-link" href="https://daegu.ac.kr/page/36" target="_blank" rel="noreferrer" aria-label="대구대학교 공식 UI 안내">
        <span class="logo-crop" aria-hidden="true"><img src="https://daegu.ac.kr/resources/images/site/contents/intro_symbol_logo_img2.jpg" alt="" class="official-logo-image"></span>
        <span class="logo-fallback">대구대학교<br><small>DAEGU UNIVERSITY</small></span>
      </a>
    </header>
    <div class="header-rule"></div>
    <table class="admission-table result-table" aria-label="합격 결과">
      <tbody>
        <tr><th scope="row">모집구분</th><td><span class="result-value">수시</span></td></tr>
        <tr><th scope="row">전형</th><td><span class="result-value">${escapeHtml(data.track)}</span></td></tr>
        <tr><th scope="row">학과/학부</th><td><span class="result-value">${escapeHtml(data.department)}</span></td></tr>
        <tr><th scope="row">수험번호</th><td><span class="result-value">${escapeHtml(data.applicationNumber)}</span></td></tr>
        <tr><th scope="row">생년월일</th><td><span class="result-value">${escapeHtml(formatBirthDate(data.birthDate))}</span></td></tr>
        <tr><th scope="row">지원자명</th><td><span class="result-value">${escapeHtml(data.applicantName)}</span></td></tr>
      </tbody>
    </table>
    <p class="result-message"><b>${escapeHtml(data.applicantName)}</b> 님은 대구대학교 2027학년도 수시모집 <b>${escapeHtml(data.track)}</b> <b>${escapeHtml(data.department)}</b>에 <span class="result-status">합격</span>하였습니다.</p>
    <div class="result-actions"><button type="button" id="close-window">닫기</button></div>
  </main>
  <div class="prototype-note" role="note">실제 결과가 아닙니다</div>
<script>
document.getElementById('close-window').addEventListener('click', function(){ window.close(); });
document.querySelectorAll('.official-logo-image').forEach(function(image){ image.addEventListener('error', function(){ var fallback = image.closest('.official-logo-link') && image.closest('.official-logo-link').querySelector('.logo-fallback'); if (fallback) fallback.style.display = 'block'; image.style.display = 'none'; }); });
<\/script>
</body>
</html>`;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const data = {
      track: form.elements.track.value,
      department: form.elements.department.value,
      applicationNumber: form.elements.applicationNumber.value.trim(),
      birthDate: form.elements.birthDate.value,
      applicantName: form.elements.applicantName.value.trim(),
      contact: form.elements.contact.value.trim()
    };
    if (Object.values(data).some((value) => !value)) {
      error.hidden = false;
      return;
    }
    const resultWindow = window.open('', '_blank');
    if (!resultWindow) {
      error.textContent = '새 창이 차단되었습니다. 브라우저에서 팝업을 허용한 뒤 다시 시도해 주세요.';
      error.hidden = false;
      return;
    }
    const cssHref = new URL('styles.css', window.location.href).href;
    resultWindow.document.open();
    resultWindow.document.write(resultHtml(data, cssHref));
    resultWindow.document.close();
  });

  // 외부 로고 이미지가 열리지 않는 환경에서는 텍스트형 대체 표시를 사용합니다.
  document.querySelectorAll('.official-logo-image').forEach((image) => {
    image.addEventListener('error', () => {
      const fallback = image.closest('.official-logo-link')?.querySelector('.logo-fallback');
      if (fallback) fallback.style.display = 'block';
      image.style.display = 'none';
    });
  });
})();
