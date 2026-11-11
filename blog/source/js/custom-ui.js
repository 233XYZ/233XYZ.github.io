/* ==========================================================================
   小遗博客 · 光标跟随脚本
   --------------------------------------------------------------------------
   职责很窄：把鼠标相对卡片的位置写进 CSS 变量，剩下的表现全交给 CSS。
   - 事件委托挂在 document 上，PJAX 只替换 #main 也不会失效；
   - 用 requestAnimationFrame 合并高频 pointermove，避免抖动；
   - 触屏设备与「减弱动效」偏好下完全不接管鼠标。
   ========================================================================== */

(function () {
  "use strict";

  // 倾斜幅度（度）。数值刻意很小：够有立体感，又不至于让人眼晕。
  var MAX_TILT = 3.2;

  function supportsHover() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // 给卡片编号，供 CSS 计算入场动画的错峰延迟。
  function indexCards() {
    var cards = document.querySelectorAll(".kratos-hentry");
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.setProperty("--wb-i", String(Math.min(i, 8)));
    }
  }

  var currentCard = null;
  var frame = 0;
  var pointerX = 0;
  var pointerY = 0;

  function clearTilt(card) {
    if (!card) return;
    card.style.removeProperty("--wb-rx");
    card.style.removeProperty("--wb-ry");
  }

  function paint() {
    frame = 0;
    if (!currentCard || !currentCard.isConnected) return;

    var rect = currentCard.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var x = pointerX - rect.left;
    var y = pointerY - rect.top;

    currentCard.style.setProperty("--wb-mx", Math.round(x) + "px");
    currentCard.style.setProperty("--wb-my", Math.round(y) + "px");
    currentCard.style.setProperty(
      "--wb-ry",
      (((x / rect.width) - 0.5) * MAX_TILT * 2).toFixed(2) + "deg"
    );
    currentCard.style.setProperty(
      "--wb-rx",
      (((y / rect.height) - 0.5) * -MAX_TILT * 2).toFixed(2) + "deg"
    );
  }

  function onPointerMove(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;

    var target = event.target;
    var card =
      target instanceof Element ? target.closest(".kratos-hentry") : null;

    // 文章详情页的卡片就是正文容器，跟着鼠标晃动会干扰阅读，直接不接管。
    if (card && card.classList.contains("kratos-post-inner")) card = null;

    if (card !== currentCard) {
      clearTilt(currentCard);
      currentCard = card;
    }
    if (!card) return;

    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(paint);
  }

  indexCards();

  // 浏览器会在 mousedown 阶段就清掉选区，等到 click 再读 getSelection 永远为空。
  // 所以按下时先记一笔，避免用户刚选中文字准备复制、手一松就被跳走。
  var hadSelectionOnDown = false;
  document.addEventListener(
    "mousedown",
    function () {
      hadSelectionOnDown = !!(
        window.getSelection && String(window.getSelection()).length
      );
    },
    true
  );

  // 整张卡片可点。首页卡片视觉上是一整块，但只有标题和「阅读全文」是链接，
  // 点空白处原本毫无反应，这是手感差的直接来源。这里把空白点击转交给标题链接，
  // 让 PJAX 接管导航，保持无刷新切换。
  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (hadSelectionOnDown) return;

    var target = event.target;
    if (!(target instanceof Element)) return;
    // 链接、按钮、图片都不接管
    if (target.closest("a, button, input, textarea, select, label, img")) return;

    var card = target.closest(".kratos-hentry");
    if (!card || card.classList.contains("kratos-post-inner")) return;

    // 注意：标题的类名是 kratos-entry-title-new，主题 CSS 里写的
    // kratos-entry-title 是旧版类名，照抄会导致永远取不到链接。
    var link = card.querySelector(".kratos-entry-title-new a");
    if (!link) return;

    event.preventDefault();
    link.click();
  });

  if (supportsHover() && !prefersReducedMotion()) {
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    // pointerleave 不冒泡，必须用捕获阶段才能收到离开窗口的事件。
    document.addEventListener(
      "pointerleave",
      function () {
        clearTilt(currentCard);
        currentCard = null;
      },
      true
    );
  }

  // PJAX 换页后卡片是全新的 DOM，重新编号并断开旧引用。
  window.addEventListener("pjax:complete", function () {
    currentCard = null;
    indexCards();
  });
})();
