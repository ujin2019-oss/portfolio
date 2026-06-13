/* =====================================================================
   main.js  —  GSAP 스크롤 효과 & 인터랙션
   ===================================================================== */

document.documentElement.classList.add("has-gsap");

window.addEventListener("DOMContentLoaded", () => {
  const hasGSAP = typeof gsap !== "undefined";

  if (!hasGSAP) {
    // GSAP 미로드(오프라인 등) → 폴백으로 콘텐츠 그대로 노출
    document.documentElement.classList.add("no-gsap");
  } else {
    gsap.registerPlugin(ScrollTrigger);
    initReveal();
    initHeroIntro();
    initParallax();
  }

  // 인터랙션(스크롤 라이브러리 불필요)
  initBeforeAfter();
  initProjectFilter();
});

/* --------------------- 스크롤 리빌(공통) -------------------------- */
function initReveal() {
  // 같은 컨테이너 안의 data-reveal 요소는 stagger 로 등장
  const groups = new Map();
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    const sec = el.closest("[data-section]") || el.parentElement;
    if (!groups.has(sec)) groups.set(sec, []);
    groups.get(sec).push(el);
  });

  groups.forEach((els) => {
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: {
        trigger: els[0],
        start: "top 82%",
      },
    });
  });
}

/* --------------------- 히어로 인트로 -------------------------------- */
function initHeroIntro() {
  const lines = gsap.utils.toArray(".hero__title .line");
  if (!lines.length) return;

  // 헤드라인 라인업
  gsap.from(lines, {
    yPercent: 120,
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.12,
    delay: 0.15,
  });

  // 히어로 비주얼이 스크롤에 따라 살짝 떠오르고 축소
  gsap.to(".hero__visual", {
    yPercent: 14,
    scale: 0.96,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* --------------------- 패럴랙스 ------------------------------------ */
function initParallax() {
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // 섹션 제목 살짝 좌→우 라인 효과
  gsap.utils.toArray(".section__title").forEach((t) => {
    gsap.from(t, {
      letterSpacing: "0.4em",
      opacity: 0.4,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: t, start: "top 88%" },
    });
  });
}

/* --------------------- Before / After 슬라이더 -------------------- */
function initBeforeAfter() {
  const vp = document.querySelector("[data-ba]");
  if (!vp) return;
  const before = vp.querySelector("[data-ba-before]");
  const handle = vp.querySelector("[data-ba-handle]");
  const knob = vp.querySelector(".ba__knob");
  const dots = document.querySelectorAll("[data-ba-dots] button");

  let dragging = false;

  // 클립되는 before 이미지 폭을 뷰포트 폭에 고정 → 드래그해도 안 찌그러짐
  const syncWidth = () => {
    const beforeImg = before.querySelector(".ba__img");
    if (beforeImg) beforeImg.style.setProperty("--ba-w", vp.offsetWidth + "px");
  };
  syncWidth();
  window.addEventListener("resize", syncWidth);

  const setPos = (pct) => {
    pct = Math.max(2, Math.min(98, pct));
    before.style.width = pct + "%";
    handle.style.left = pct + "%";
  };

  const pointerToPct = (clientX) => {
    const r = vp.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };

  const start = () => (dragging = true);
  const end = () => (dragging = false);
  const move = (clientX) => { if (dragging) setPos(pointerToPct(clientX)); };

  knob.addEventListener("pointerdown", (e) => { start(); knob.setPointerCapture(e.pointerId); });
  window.addEventListener("pointerup", end);
  window.addEventListener("pointermove", (e) => move(e.clientX));

  // 뷰포트 클릭 시 해당 위치로 이동
  vp.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".ba__knob")) return;
    setPos(pointerToPct(e.clientX));
  });

  // 키보드 접근성
  knob.addEventListener("keydown", (e) => {
    const cur = parseFloat(before.style.width) || 50;
    if (e.key === "ArrowLeft") setPos(cur - 4);
    if (e.key === "ArrowRight") setPos(cur + 4);
  });

  // 도트 클릭 → 프리셋 위치
  const presets = [50, 25, 75, 90];
  dots.forEach((d, i) => {
    d.addEventListener("click", () => {
      dots.forEach((x) => x.classList.remove("is-active"));
      d.classList.add("is-active");
      setPos(presets[i] ?? 50);
    });
  });

  setPos(50);
}

/* --------------------- 프로젝트 필터 ------------------------------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter");
  const items = document.querySelectorAll(".project");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const f = btn.dataset.filter;

      items.forEach((item) => {
        const show = f === "all" || item.dataset.cat === f;
        if (typeof gsap !== "undefined") {
          if (show) {
            item.classList.remove("is-hidden");
            gsap.fromTo(item, { opacity: 0, scale: 0.92 },
              { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out", clearProps: "transform" });
          } else {
            gsap.to(item, { opacity: 0, scale: 0.92, duration: 0.3, ease: "power2.in",
              onComplete: () => item.classList.add("is-hidden") });
          }
        } else {
          item.classList.toggle("is-hidden", !show);
        }
      });
    });
  });
}
