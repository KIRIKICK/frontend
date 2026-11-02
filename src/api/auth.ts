// 카카오 로그인·가입 API.
// 백엔드가 붙기 전까지는 목업으로 동작한다. 실제 연동 시 이 파일의 함수 본문만 바꾸면 된다.

export type User = {
  id: string
  name: string
}

export type KakaoLoginResult =
  | { status: 'registered'; user: User }
  | { status: 'new'; kakaoId: string; kakaoName: string }

export type TermsAgreement = {
  service: boolean
  privacy: boolean
}

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as string | undefined
const USERS_KEY = 'kk:mock-users'
const MOCK_FAIL_KEY = 'kk:mock-fail'

export const KAKAO_REDIRECT_PATH = '/auth/kakao/callback'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 개발 중 실패 화면 확인용: localStorage['kk:mock-fail'] = 'login' | 'signup'
const shouldMockFail = (step: 'login' | 'signup') => {
  try {
    return localStorage.getItem(MOCK_FAIL_KEY) === step
  } catch {
    return false
  }
}

const readMockUsers = (): Record<string, User> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

/** 카카오 인가 페이지 주소. REST API 키가 없으면 목업 콜백으로 바로 보낸다. */
export function getKakaoAuthorizeUrl(): string {
  const redirectUri = `${window.location.origin}${KAKAO_REDIRECT_PATH}`
  if (!KAKAO_REST_API_KEY) {
    return `${KAKAO_REDIRECT_PATH}?code=mock`
  }
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: redirectUri,
    response_type: 'code',
  })
  return `https://kauth.kakao.com/oauth/authorize?${params}`
}

/** 인가 코드로 로그인. 가입한 사용자면 user, 처음 온 사용자면 카카오 이름을 돌려준다. */
export async function loginWithKakao(code: string): Promise<KakaoLoginResult> {
  await delay(1200)
  if (!code || shouldMockFail('login')) {
    throw new Error('KAKAO_LOGIN_FAILED')
  }
  const kakaoId = 'mock-kakao-1'
  const existing = readMockUsers()[kakaoId]
  if (existing) {
    return { status: 'registered', user: existing }
  }
  return { status: 'new', kakaoId, kakaoName: '민지' }
}

export async function signUp(input: {
  kakaoId: string
  name: string
  terms: TermsAgreement
}): Promise<User> {
  await delay(700)
  if (!input.terms.service || !input.terms.privacy || shouldMockFail('signup')) {
    throw new Error('SIGNUP_FAILED')
  }
  const user: User = { id: input.kakaoId, name: input.name.trim() }
  const users = readMockUsers()
  users[input.kakaoId] = user
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return user
}
