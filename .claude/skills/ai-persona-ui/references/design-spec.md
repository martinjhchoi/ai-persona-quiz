# 디자인 스펙 참조

## 폰트 계층

| Level | Size | Font | 용도 |
|-------|------|------|------|
| Hero | 48-80px | Jua | 메인 타이틀 |
| H1 | 32px | Jua | 페르소나명 |
| H2 | 24px | Jua | 카드 서브타이틀 |
| H3 | 20px | Jua | 버튼 primary, 퀴즈 질문 |
| Body | 16px | Pretendard | 본문 |
| Small | 14px | Pretendard | 부가 정보 |
| Mono | 12px | JetBrains Mono | 진행 카운터, 해시태그, URL |

## 퀴즈 카드 구조

```
[검은 배너 헤더] — "Q03 / 15 · AXIS 1"
[카드 바디]
  ├─ 프로그레스 바 (red fill, 20%)
  ├─ 질문 (Jua 20px, 원형 Q번호 스탬프)
  └─ 선지 A / B (노란 라벨, hover 이동+그림자)
[네비게이션] — ← 이전 / 진행상황 / 다음 →
```

퀴즈 카드 max-width: 620px.

## 결과 카드 구조

```
[분노 뱃지] — 조건부, position:absolute top:-14 right:-14
[상단 배너] — 페르소나 컬러 + 유형명 + BADGE
[캐릭터 이미지] — 스크린톤 도트 배경
[카드 바디]
  ├─ tagline (Jua 20px, pre-line)
  ├─ 설명 (panel-bg 배경 박스 + body 16px)
  ├─ 해시태그 (Mono 12px, 검은 뱃지)
  └─ 액션: [⬇ 카드 저장] [𝕏 공유하기]
```

결과 카드 width: 420px (html2canvas scale=3 → 1260px PNG).

## 배너에 분노 뱃지 padding 규칙

분노 뱃지가 활성화될 때 배너 오른쪽 여백을 80px로 늘린다.
뱃지 72px + 오프셋 14px - 버퍼 = 여유 공간 확보.

## 버튼 스타일

```css
/* Primary (검정) */
.btn-primary {
  font-family: var(--font-display);
  background: var(--ink);
  color: var(--bg);
  border: var(--border-thick);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  padding: 12px 24px;
  font-size: 18px;
}
.btn-primary:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); }
.btn-primary:active { transform: translate(3px,3px); box-shadow: none; }

/* 다운로드 (노랑) */
.btn-download { background: var(--accent); border: var(--border-thick); }

/* X 공유 (검정) */
.btn-share-x { background: var(--ink); color: var(--bg); }
```

## 공유 랜딩 페이지

URL: `/result?result=<base64>` 접속 시:
- 카드 위에 "나는 어떤 타입?" CTA 버튼 표시
- CTA 클릭 → `/quiz`로 이동

## 페르소나별 이미지 매핑

| PersonaType | 이미지 |
|-------------|--------|
| trainer | /chars/01.png |
| boss | /chars/02.png |
| lightning | /chars/03.png |
| copypaste | /chars/04.png |
| debater | /chars/05.png |
| negotiator | /chars/06.png |
| bestfriend | /chars/07.png |
| lazy-genius | /chars/08.png |
| 앵그리 뱃지 | /chars/EXT.png |
