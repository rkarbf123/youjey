/* document.querySelectorAll('.general-webtoon-content').forEach(el => {
  el.addEventListener('click', () => {
    const id = el.dataset.generalWebtoonId;
    const name = el.querySelector('.general-webtoon-name').textContent;
    const writer = el.querySelector('.general-webtoon-writer').textContent;

    const webtoonCover = el.querySelector('.webtoon-cover');
    const mangaCover = el.querySelector('.manga-cover');
    const novelCover = el.querySelector('.novel-cover');

    let cover = '';
    let targetURL = 'content-preview/index.html'; // 무조건 content-preview로 보내고
    let type = '';

    if (webtoonCover || mangaCover) {
      cover = (webtoonCover || mangaCover).getAttribute('src');
      type = 'webtoon';
    } else if (novelCover) {
      cover = novelCover.getAttribute('src');
      type = 'novel';
    } else {
      // 기본 fallback
      type = 'webtoon';
    }

    const tags = el.dataset.webtoonTag || '';
    const chapters = el.dataset.theNumberOfChapter || '';

    const params = new URLSearchParams({
      id, name, writer, cover, tags, chapters, type
    });

    window.location.href = `${targetURL}?${params.toString()}`;
  });
}); */