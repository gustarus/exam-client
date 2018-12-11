const containerK = 0.005;
const contentK = -0.0025;

export default _.throttle(e => {
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;
  let cursorLeft = e.pageX;
  let cursorTop = e.pageY;

  let offsetTop = cursorTop > halfHeight ? (cursorTop - halfHeight) * -1 : halfHeight - cursorTop;
  let offsetLeft = cursorLeft > halfWidth ? (cursorLeft - halfWidth) * -1 : halfWidth - cursorLeft;

  let containerOffsetTop = offsetTop * containerK;
  let containerOffsetLeft = offsetLeft * containerK;
  let container = document.getElementById('background');
  container.style.transform = `translate(${containerOffsetLeft}px, ${containerOffsetTop}px)`;

  let contentOffsetTop = offsetTop * contentK;
  let contentOffsetLeft = offsetLeft * contentK;
  let root = document.getElementById('root');
  root.style.transform = `translate(${contentOffsetLeft}px, ${contentOffsetTop}px)`;
}, 100);
