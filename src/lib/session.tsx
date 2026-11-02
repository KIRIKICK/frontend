import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { TermsAgreement, User } from '../api/auth'

// 로그인 후 가입을 마치기 전까지 들고 있는 값
export type PendingSignup = {
  kakaoId: string
  name: string
  terms: TermsAgreement
}

type SessionState = {
  user: User | null
  pending: PendingSignup | null
}

type SessionContextValue = SessionState & {
  startSignup: (kakaoId: string, kakaoName: string) => void
  updatePending: (patch: Partial<Omit<PendingSignup, 'kakaoId'>>) => void
  signIn: (user: User) => void
  signOut: () => void
}

const USER_KEY = 'kk:user'
const PENDING_KEY = 'kk:pending-signup'

function load<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function save(storage: Storage, key: string, value: unknown) {
  try {
    if (value === null) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장소를 못 쓰는 환경(사파리 프라이빗 등)에서는 메모리 상태만 쓴다
  }
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(() => ({
    user: load<User>(localStorage, USER_KEY),
    pending: load<PendingSignup>(sessionStorage, PENDING_KEY),
  }))

  const setPending = useCallback((pending: PendingSignup | null) => {
    save(sessionStorage, PENDING_KEY, pending)
    setState((s) => ({ ...s, pending }))
  }, [])

  const startSignup = useCallback(
    (kakaoId: string, kakaoName: string) =>
      setPending({ kakaoId, name: kakaoName.slice(0, 10), terms: { service: false, privacy: false } }),
    [setPending],
  )

  const updatePending = useCallback((patch: Partial<Omit<PendingSignup, 'kakaoId'>>) => {
    setState((s) => {
      if (!s.pending) return s
      const pending = { ...s.pending, ...patch }
      save(sessionStorage, PENDING_KEY, pending)
      return { ...s, pending }
    })
  }, [])

  const signIn = useCallback((user: User) => {
    save(localStorage, USER_KEY, user)
    save(sessionStorage, PENDING_KEY, null)
    setState({ user, pending: null })
  }, [])

  const signOut = useCallback(() => {
    save(localStorage, USER_KEY, null)
    save(sessionStorage, PENDING_KEY, null)
    setState({ user: null, pending: null })
  }, [])

  const value = useMemo(
    () => ({ ...state, startSignup, updatePending, signIn, signOut }),
    [state, startSignup, updatePending, signIn, signOut],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}
