# UI/UX Portfolio

더블클릭으로 `index.html`을 열면 바로 실행됩니다. (로컬 서버 불필요)

## 폴더 구조
```
portfolio/
├─ index.html          내용(섹션) 마크업
├─ css/
│  ├─ variables.css    ★ 색/간격/글자크기 토큰 — 여기만 고치면 톤 전체 변경
│  └─ style.css        레이아웃·컴포넌트 스타일
└─ js/
   ├─ components.js     ★ 공통 헤더·푸터 (한 파일에서 관리)
   └─ main.js           GSAP 스크롤 효과 & 인터랙션
```

## 자주 바꿀 값 (css/variables.css)
- `--color-main / --color-sub / --color-point(바이올렛) / --color-bg` : 색상
- `--section-gap / --block-gap / --grid-gap / --gutter` : 섹션 간격·여백
- `--fs-display ~ --fs-eyebrow` : 계층별 글자 크기 (폭에 따라 clamp 자동 스케일)
- `--fw-light ~ --fw-black` : 글자 두께
- `--radius-sm ~ --radius-pill` : 모서리 둥글기
- `--maxw` : PC 콘텐츠 최대폭 (현재 1600px)

## 이미지 넣는 법
`class="img-slot"` 요소가 이미지 자리입니다. `data-slot` 으로 구분돼 있어요.
해당 div 안에 `<img src="...">` 를 넣거나, CSS에서 `background-image` 를 지정하면 됩니다.

| data-slot | 위치 |
|---|---|
| hero-orb / hero-cube | 01 히어로 유리구슬·큐브 |
| work-1 ~ work-3 | 02 Selected Works 썸네일 |
| before / after | 03 Before & After |
| p1 ~ p8 | 05 All Projects 그리드 |
| connect-orb | 06 Let's Connect 비주얼 |

예시:
```html
<div class="img-slot work-card__thumb" data-slot="work-1">
  <img src="images/work1.jpg" alt="프로젝트 1" style="width:100%;height:100%;object-fit:cover;">
</div>
```

## 인터랙션
- 스크롤 리빌 / 패럴랙스 / 히어로 텍스트 인트로 (GSAP + ScrollTrigger)
- Before & After: 가운데 손잡이 드래그(또는 클릭/방향키), 하단 도트 프리셋
- All Projects: 상단 필터 탭으로 카테고리 토글
- 헤더: 스크롤 시 블러 배경, 모바일 햄버거 메뉴

오프라인 등으로 GSAP CDN이 안 열려도 콘텐츠는 정상 노출됩니다(폴백 처리).
