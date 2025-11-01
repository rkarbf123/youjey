(() => {
  console.log("loadfile.js 스크립트가 실행되었습니다.");

  const params = new URLSearchParams(window.location.search);
  const novelId = params.get('id') || params.get('webtoon');
  let chapter = parseInt(params.get('chapter'), 10) || 1;
  const title = params.get('title') ? decodeURIComponent(decodeURIComponent(params.get('title'))) : '';
  const totalChapters = parseInt(params.get('total'), 10);
  const all = params.get('all') === 'true';

  const titleElement = document.getElementById('viewer-title');
  const titleElement2 = document.getElementById('bottom-title');
  const contentElement = document.getElementById('viewer-content');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const floatingPrev = document.getElementById('floating-prev');
  const floatingNext = document.getElementById('floating-next');
  const fixedNavButtons = document.getElementById('fixed-nav-buttons');

  if (!novelId || !title || isNaN(totalChapters)) {
    if (titleElement) titleElement.textContent = '잘못된 접근입니다.';
    if (contentElement) {
      contentElement.classList.remove('loading');
      contentElement.classList.add('error');
      contentElement.textContent = '필수 정보가 누락되었습니다.';
    }
    [prevBtn, nextBtn, floatingPrev, floatingNext].forEach(btn => {
      if (btn) btn.disabled = true;
    });
    return;
  }

  function updateTitle(ch) {
    const displayChapter = ch || chapter;
    document.title = `${title} | ${displayChapter}화`;
    // titleElement: 상단, titleelement2: 하단
    if (titleElement) titleElement.textContent = `${title} - ${displayChapter}화`;
    if (titleElement2) titleElement2.textContent = `${title} - ${displayChapter}화`;
  }

  function updateButtons(ch) {
    const c = ch || chapter;
    if (prevBtn) prevBtn.disabled = (c <= 1);
    if (nextBtn) nextBtn.disabled = (c >= totalChapters);
    if (floatingPrev) floatingPrev.disabled = (c <= 1);
    if (floatingNext) floatingNext.disabled = (c >= totalChapters);
  }

  async function loadNovelChapter(ch) {
    const filePath = `/novel-data/${novelId}/c${ch}.txt`;
    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error('텍스트 파일을 찾을 수 없습니다.');
      return await res.text();
    } catch {
      return null;
    }
  }

  async function loadWebtoonChapterImages(ch) {
    const images = [];
    let page = 1;
    while (true) {
      const imgPath = `/webtoon-data/${novelId}/c${ch}_${page}.jpg`;
      const res = await fetch(imgPath, { method: 'HEAD' });
      if (!res.ok) break;
      images.push(imgPath);
      page++;
    }
    return images;
  }

  async function loadAllNovelChapters() {
    contentElement.innerHTML = '';
    for (let i = 1; i <= totalChapters; i++) {
      const text = await loadNovelChapter(i);
      if (text === null) continue;
      const section = document.createElement('section');
      section.className = 'episode-block';
      section.innerHTML = `<h2>${title} - ${i}화</h2><pre>${text}</pre>`;
      contentElement.appendChild(section);
    }
    contentElement.classList.remove('loading');
  }

  async function loadAllWebtoonChapters() {
    contentElement.innerHTML = '';
    for (let i = 1; i <= totalChapters; i++) {
      const images = await loadWebtoonChapterImages(i);
      if (images.length === 0) continue;
      const section = document.createElement('section');
      section.className = 'episode-block';
      section.innerHTML = `<h2>${title} - ${i}화</h2>`;
      const imgContainer = document.createElement('div');
      imgContainer.className = 'image-list';
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        imgContainer.appendChild(img);
      });
      section.appendChild(imgContainer);
      contentElement.appendChild(section);
    }
    contentElement.classList.remove('loading');
  }

  async function showSingleChapter(ch) {
    console.log("Loading chapter:", ch);
    updateTitle(ch);
    updateButtons(ch);
    contentElement.classList.remove('error');
    contentElement.classList.add('loading');
    contentElement.textContent = '내용을 불러오는 중입니다...';

    if (params.has('id')) {
      const text = await loadNovelChapter(ch);
      if (text === null) {
        contentElement.classList.remove('loading');
        contentElement.classList.add('error');
        contentElement.textContent = '소설 내용을 불러오는 데 실패했습니다.';
        return;
      }
      contentElement.classList.remove('loading');
      contentElement.textContent = text;
    } /* else {
      const images = await loadWebtoonChapterImages(ch);
      if (images.length === 0) {
        contentElement.classList.remove('loading');
        contentElement.classList.add('error');
        contentElement.textContent = '웹툰 이미지를 불러오는 데 실패했습니다.';
        return;
      }
      contentElement.innerHTML = '';
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        contentElement.appendChild(img);
      });
      contentElement.classList.remove('loading');
    } */
  }

  function changeChapter(diff) {
    const newChapter = chapter + diff;
    if (newChapter < 1 || newChapter > totalChapters) return;
    chapter = newChapter;
    showSingleChapter(chapter);
    updateURL();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set(params.has('id') ? 'id' : 'webtoon', novelId);
    url.searchParams.set('chapter', chapter);
    url.searchParams.set('title', encodeURIComponent(title));
    url.searchParams.set('total', totalChapters);
    if (all) url.searchParams.set('all', 'true');
    history.replaceState(null, '', url);
  }

  // 버튼 이벤트 연결
  if (prevBtn) prevBtn.addEventListener('click', () => changeChapter(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeChapter(1));
  if (floatingPrev) floatingPrev.addEventListener('click', () => changeChapter(-1));
  if (floatingNext) floatingNext.addEventListener('click', () => changeChapter(1));

  // 초기 로드
  if (all) {
    if (params.has('id')) {
      loadAllNovelChapters();
    } else {
      loadAllWebtoonChapters();
    }
    if (fixedNavButtons) fixedNavButtons.style.display = 'none';
  } else {
    showSingleChapter(chapter);
    updateButtons(chapter);
  }

  let navButtonsTimeout;
  let lastScrollTime = 0;

  function hideFixedButtons() {
    if (fixedNavButtons) {
      fixedNavButtons.classList.add('hidden');
    }
  }

  function showFixedButtons() {
    if (fixedNavButtons) {
      fixedNavButtons.classList.remove('hidden');
    }
    clearTimeout(navButtonsTimeout);
    navButtonsTimeout = setTimeout(hideFixedButtons, 2000);
  }

  // 스크롤 시 버튼 숨기기만
  window.addEventListener('scroll', () => {
    lastScrollTime = Date.now();
    hideFixedButtons();
  });

  // 터치 또는 클릭 시 버튼 표시
  ['touchstart', 'mousedown'].forEach(evt =>
    window.addEventListener(evt, () => {
      if (Date.now() - lastScrollTime > 200) {
        showFixedButtons();
      }
    })
  );

  // 페이지 로드시 버튼 표시 후 자동 숨김
  showFixedButtons();

})();