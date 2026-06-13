/* =====================================================================
   components.js  —  공통 헤더 / 푸터
   --------------------------------------------------------------------
   · 헤더와 푸터를 이 한 파일에서 관리합니다.
   · file:// (더블클릭 실행)에서도 동작하도록 fetch 대신 JS 주입 방식 사용.
   · 사용법: <header data-include="header"></header>, <footer data-include="footer">
   ===================================================================== */

const Components = {
  /* ----------------------------- HEADER ----------------------------- */
  header: `
    <a class="logo" href="#hero" aria-label="홈으로">
      <span class="logo__mark">◆</span>
      <span class="logo__text">Portfolio<em>.ux</em></span>
    </a>

    <nav class="gnb" aria-label="주요 메뉴">
      <a href="#works"   class="gnb__link">Works</a>
      <a href="#compare" class="gnb__link">Before / After</a>
      <a href="#skills"  class="gnb__link">Skills</a>
      <a href="#projects" class="gnb__link">Projects</a>
      <a href="#connect" class="gnb__link gnb__link--cta">Contact</a>
    </nav>

    <button class="nav-toggle" aria-label="메뉴 열기" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  `,

  /* ----------------------------- FOOTER ----------------------------- */
  footer: `
    <div class="foot__inner">
      <p class="foot__copy">© <span data-year></span> Your Name. Designed &amp; built with care.</p>
      <ul class="foot__links">
        <li><a href="#works">Works</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#connect">Contact</a></li>
      </ul>
      <p class="foot__top"><a href="#hero">Back to top ↑</a></p>
    </div>
  `,
};

/* ------------------------- 주입 + 초기화 --------------------------- */
(function mountComponents() {
  document.querySelectorAll("[data-include]").forEach((el) => {
    const key = el.getAttribute("data-include");
    if (Components[key]) el.innerHTML = Components[key];
  });

  // 연도 자동
  document.querySelectorAll("[data-year]").forEach((n) => {
    n.textContent = new Date().getFullYear();
  });

  initHeaderBehaviour();
})();

function initHeaderBehaviour() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const gnb = document.querySelector(".gnb");

  // 스크롤 시 헤더 축소/배경
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // 모바일 메뉴 토글
  if (toggle && gnb) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    gnb.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // 부드러운 앵커 스크롤
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y =
        target.getBoundingClientRect().top +
        window.scrollY -
        (header ? header.offsetHeight - 8 : 0);
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}
