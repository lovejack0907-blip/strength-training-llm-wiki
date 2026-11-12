(() => {
  const pages = [...document.querySelectorAll('section')];
  const previous = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const counter = document.querySelector('#counter');
  let index = 0;
  function show(target) {
    index = Math.max(0, Math.min(pages.length - 1, target));
    pages.forEach((page, i) => page.hidden = i !== index);
    previous.disabled = index === 0;
    next.disabled = index === pages.length - 1;
    counter.textContent = (index + 1) + ' / ' + pages.length;
  }
  previous.onclick = () => show(index - 1);
  next.onclick = () => show(index + 1);
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  if (location.protocol === 'https:' || location.protocol === 'http:') {
    document.querySelectorAll('a[href$=".md"]').forEach(link => {
      link.setAttribute('href', link.getAttribute('href').replace(/\.md$/, '.html'));
    });
  }
  show(0);
  if (location.hash === '#verify') {
    const check = (expected) => {
      if (pages.filter(page => !page.hidden).length !== 1 || pages[expected].hidden ||
          counter.textContent !== (expected + 1) + ' / ' + pages.length) throw Error('頁碼或可見頁錯誤');
    };
    check(0);
    if (!previous.disabled) throw Error('首張仍可往前');
    next.click(); check(1);
    previous.click(); check(0);
    const key = value => document.dispatchEvent(new KeyboardEvent('keydown', {key:value}));
    key('ArrowRight'); check(1);
    key('ArrowLeft'); check(0);
    for (let i = 1; i < pages.length; i++) { next.click(); check(i); }
    if (!next.disabled) throw Error('末張仍可往後');
    const quiz = pages.at(-1).querySelector('details');
    if (quiz.open) throw Error('答案未收起');
    quiz.querySelector('summary').click();
    if (!quiz.open || !quiz.querySelector('#answer').innerText.trim()) throw Error('答案未揭曉');
    document.documentElement.dataset.verified = 'passed';
  }
})();
