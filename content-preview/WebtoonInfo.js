console.log('스크립트 로딩 완료')
const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const cover = params.get('cover');
const writer = params.get('writer');
const tags = params.get('tags');

document.title = `${name} - 미리보기`;
document.querySelector('.webtoon-title').textContent = name;

// cover가 절대경로('/')로 시작하지 않으면 content-preview 폴더 기준으로 한 단계 위 폴더(../)로 경로 보정
const coverPath = cover.startsWith('/') ? cover : `../${cover}`;
console.log("cover 파라미터:", cover);
console.log("적용할 이미지 경로:", coverPath);

document.querySelector('.webtoon-preview-cover').src = coverPath;
document.querySelector('.webtoon-writer-info').textContent = `${writer}`;

// 태그 생성
if (tags) {
  const tagContainer = document.querySelector('.tag');
  const tagList = tags.split(',').map(t => t.trim());

  tagList.forEach(tag => {
    const span = document.createElement('span');
    span.textContent = `#${tag}`;
    span.style.marginRight = '8px';
    span.style.padding = '4px 8px';
    span.style.background = '#eee';
    span.style.borderRadius = '8px';
    span.style.fontSize = '0.9em';
    span.style.display = 'inline-block';
    tagContainer.appendChild(span);
  });
}