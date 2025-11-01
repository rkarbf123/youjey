  document.querySelectorAll('.general-webtoon-content').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.generalWebtoonId;
      const name = el.querySelector('.general-webtoon-name').textContent;
      const writer = el.querySelector('.general-webtoon-writer').textContent;

      // 커버 이미지 엘리먼트 찾기 (웹툰, 만화, 소설 각각)
      const webtoonCover = el.querySelector('.webtoon-cover');
      const mangaCover = el.querySelector('.manga-cover');
      const novelCover = el.querySelector('.novel-cover');

      let cover = '';
      let targetURL = 'content-preview/index.html'; // 기본값 content-preview
      let type = '';

      if (webtoonCover) {
        cover = webtoonCover.getAttribute('src');
        type = 'webtoon';
      } else if (mangaCover) {
        cover = mangaCover.getAttribute('src');
        type = 'webtoon'; // 만화도 웹툰 타입으로 간주
      } else if (novelCover) {
        cover = novelCover.getAttribute('src');
        type = 'novel';
      } else {
        // fallback: 웹툰으로 간주
        type = 'webtoon';
      }

      const tags = el.dataset.webtoonTag || '';
      const chapters = el.dataset.theNumberOfChapter || '';

      // URLSearchParams로 쿼리스트링 생성
      const params = new URLSearchParams({
        id,
        name,
        writer,
        cover,
        tags,
        chapters,
        type
      });

      window.location.href = `${targetURL}?${params.toString()}`;
    });
  });