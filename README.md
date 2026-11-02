# 끼리킥

React 19 + Vite + TypeScript. 디자인은 claude.ai 아티팩트 "끼리킥 v3 화면"을 따른다.

이번 범위는 **로그인 → 정보 입력(이름·약관) → 메인** 흐름이다.

## 실행

```bash
npm install
npm run dev
```

## 화면과 경로

| 경로 | 화면 |
| --- | --- |
| `/` | 로그인 (카카오로 계속하기) · 실패 시 토스트 |
| `/auth/kakao/callback` | 카카오에서 돌아오는 중 → 처음 온 사용자는 `/onboarding`, 가입한 사용자는 `/home` |
| `/onboarding` | 이름 입력 (카카오 이름 채움) |
| `/onboarding?step=terms` | 약관 동의 시트 · 가입 실패 시 토스트 |
| `/terms/service`, `/terms/privacy` | 이용약관, 개인정보 수집·이용 |
| `/home` | 메인 (친구방 없음) |

## 로그인·가입 API

`src/api/auth.ts` 는 지금 **목업**이다. 백엔드가 준비되면 `loginWithKakao`, `signUp` 본문만 바꾸면 된다.

- `VITE_KAKAO_REST_API_KEY` 를 넣으면 실제 카카오 인가 페이지로 이동한다 (`.env.example` 참고).
  카카오 developers 에 Redirect URI `https://<도메인>/auth/kakao/callback` 을 등록해야 한다.
- 실패 화면 확인: 브라우저 콘솔에서 `localStorage.setItem('kk:mock-fail', 'login')` 또는 `'signup'`.

## Vercel 배포

```bash
vercel login          # 처음 한 번
vercel link           # 프로젝트 연결 (처음 한 번)
npm run deploy:preview
npm run deploy:prod
```

`vercel.json` 에 SPA 리라이트(새로고침해도 404 없음)와 정적 자산 캐시가 들어 있다.
카카오 키를 쓸 때는 `vercel env add VITE_KAKAO_REST_API_KEY` 로 환경 변수를 등록한다.
