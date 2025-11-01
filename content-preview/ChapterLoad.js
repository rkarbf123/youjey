document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || params.get('webtoon');
  const name = params.get('name') || params.get('title') || '';
  const writer = params.get('writer') || '';
  const cover = params.get('cover') || '';
  const totalChapters = parseInt(params.get('chapters') || params.get('total') || '0', 10);
  const type = params.get('type') || 'webtoon';

  // 요소 참조
  const titleElem = document.querySelector('.webtoon-title');
  const writerElem = document.querySelector('.webtoon-writer-info');
  const coverImg = document.querySelector('.webtoon-preview-cover');
  const chapterContainer = document.querySelector('.webtoon-chapter-content-align');
  //const fullBtn = document.querySelector('.full-episodes');

  // 타이틀, 작가, 커버 세팅
  if (titleElem) titleElem.textContent = name;
  if (writerElem) writerElem.textContent = writer;
  if (coverImg) {
    coverImg.src = cover.startsWith('http') || cover.startsWith('/')
      ? cover
      : `../${cover}`;
  }
  document.title = `${name} - 미리보기`;

  // 전체 회차 보기 버튼 이벤트
  if (fullBtn) {
    fullBtn.addEventListener('click', () => {
      if (!id || !name) {
        alert('필수 정보가 부족하여 전체 회차를 볼 수 없습니다.');
        return;
      }

      const urlParams = new URLSearchParams();
      if (type === 'novel') {
        urlParams.set('id', id);
        urlParams.set('title', encodeURIComponent(name));
        urlParams.set('total', totalChapters);
        urlParams.set('all', 'true');
        window.location.href = `../novel-viewer/index.html?${urlParams.toString()}`;
      } else {
        urlParams.set('webtoon', id);
        urlParams.set('title', encodeURIComponent(name));
        urlParams.set('total', totalChapters);
        urlParams.set('all', 'true');
        window.location.href = `../viewer/index.html?${urlParams.toString()}`;
      }
    });
  }

  // (선택사항) 여기 아래에 일부 미리보기 회차 로딩 기능 넣어도 됩니다
});