import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { KAKAO_REDIRECT_PATH } from './api/auth'
import { SessionProvider, useSession } from './lib/session'
import Home from './pages/Home'
import Login from './pages/Login'
import LoginCallback from './pages/LoginCallback'
import Onboarding from './pages/Onboarding'
import TermsDetail from './pages/TermsDetail'

// 가입을 마친 사용자만
function RequireUser({ children }: { children: ReactNode }) {
  const { user } = useSession()
  return user ? children : <Navigate to="/" replace />
}

// 로그인했지만 아직 가입하지 않은 사용자만
function RequirePending({ children }: { children: ReactNode }) {
  const { user, pending } = useSession()
  if (user) return <Navigate to="/home" replace />
  return pending ? children : <Navigate to="/" replace />
}

// 이미 가입했으면 로그인 화면을 건너뛴다
function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useSession()
  return user ? <Navigate to="/home" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route
            path="/"
            element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            }
          />
          <Route path={KAKAO_REDIRECT_PATH} element={<LoginCallback />} />
          <Route
            path="/onboarding"
            element={
              <RequirePending>
                <Onboarding />
              </RequirePending>
            }
          />
          <Route path="/terms/:doc" element={<TermsDetail />} />
          <Route
            path="/home"
            element={
              <RequireUser>
                <Home />
              </RequireUser>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}
