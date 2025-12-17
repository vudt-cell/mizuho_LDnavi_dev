const content = document.getElementById('家族の年齢-content');
const yesBtn = document.getElementById('btn-yes');

content.addEventListener('scroll', () => {
  const isBottom = Math.ceil(Number(content.scrollTop) + Number(content.clientHeight)) >= Number(content.scrollHeight) - 1;

  if (isBottom) {
    yesBtn.classList.remove('btn-disabled')
    yesBtn.classList.add('btn-primary')
  }
});