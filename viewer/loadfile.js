document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  webtoonId = params.get('webtoon');
  chapter = parseInt(params.get('chapter'), 10);
  title = params.get('title') ? decodeURIComponent(params.get('title')) : '제목 없음';
  totalChapters = parseInt(params.get('total'), 10);

  if (!webtoonId || !chapter || isNaN(chapter) || !totalChapters || isNaN(totalChapters)) {
    document.getElementById('viewer-title').textContent = '잘못된 접근입니다.';
    return;
  }

  document.title = `${title} | ${chapter}화`;
  document.getElementById('viewer-title').textContent = `${title} | ${chapter}화`;

  const imageContainer = document.getElementById('viewer-images');
  const basePath = `/webtoon/${webtoonId}/c${chapter}/`;
  let imageIndex = 1;

  function loadNextImage() {
    const img = new Image();
    const exts = ['jpg', 'png', 'webp'];
    let extIndex = 0;

    function tryLoadExt() {
      if (extIndex >= exts.length) {
        if (imageIndex === 1) {
          imageContainer.innerHTML = '<p>해당 회차 이미지를 불러올 수 없습니다.</p>';
        }
        return;
      }

      img.src = `${basePath}${imageIndex}.${exts[extIndex]}`;
      img.onload = () => {
        imageContainer.appendChild(img);
        imageIndex++;
        loadNextImage();
      };
      img.onerror = () => {
        extIndex++;
        tryLoadExt();
      };
    }

    tryLoadExt();
  }

  loadNextImage();
  updateButtonStates();
});

// 버튼 요소 참조
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const floatingPrev = document.getElementById('floating-prev');
const floatingNext = document.getElementById('floating-next');

function goToChapter(chap) {
  location.href = `index.html?webtoon=${encodeURIComponent(webtoonId)}&chapter=${chap}&title=${encodeURIComponent(title)}&total=${totalChapters}`;
}

// 버튼 동작
prevBtn.onclick = () => { if (chapter > 1) goToChapter(chapter - 1); };
nextBtn.onclick = () => { if (chapter < totalChapters) goToChapter(chapter + 1); };
floatingPrev.onclick = () => { if (chapter > 1) goToChapter(chapter - 1); };
floatingNext.onclick = () => { if (chapter < totalChapters) goToChapter(chapter + 1); };

// 버튼 상태 업데이트
function updateButtonStates() {
  const isFirst = chapter <= 1;
  const isLast = chapter >= totalChapters;

  prevBtn.disabled = isFirst;
  nextBtn.disabled = isLast;
  floatingPrev.disabled = isFirst;
  floatingNext.disabled = isLast;
}

// 고정 버튼 스크롤 시 숨기기
window.addEventListener('scroll', () => {
  const floatingNav = document.querySelector('.fixed-nav-buttons');
  const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
  if (floatingNav) {
    floatingNav.classList.toggle('hidden', scrolledToBottom);
  }
});

let floatingNavTimeout;

function showFloatingNavTemporarily() {
  const floatingNav = document.querySelector('.fixed-nav-buttons');
  if (!floatingNav) return;

  floatingNav.classList.remove('hidden');

  // 기존 타이머 제거
  if (floatingNavTimeout) clearTimeout(floatingNavTimeout);

  // 일정 시간 후 다시 숨김
  floatingNavTimeout = setTimeout(() => {
    floatingNav.classList.add('hidden');
  }, 3000); // 3초 후 숨김
}

// 스크롤 시 숨기기
window.addEventListener('scroll', () => {
  const floatingNav = document.querySelector('.fixed-nav-buttons');
  const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;

  if (floatingNav) {
    floatingNav.classList.toggle('hidden', scrolledToBottom);
  }

  // 스크롤 시 즉시 숨김
  if (floatingNav && !floatingNav.classList.contains('hidden')) {
    floatingNav.classList.add('hidden');
  }
});

// 터치(또는 클릭) 시 다시 보이기
window.addEventListener('touchstart', showFloatingNavTemporarily);
window.addEventListener('click', showFloatingNavTemporarily); // PC 마우스 클릭 대응