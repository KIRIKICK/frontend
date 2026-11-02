import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginWithKakao } from '../api/auth'
import baseCharacter from '../assets/kiri-base.svg'
import { useSession } from '../lib/session'
import styles from './LoginCallback.module.css'
import type { LoginLocationState } from './Login'

export default function LoginCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, startSignup } = useSession()
  // StrictMode에서 effect가 두 번 돌아도 인가 코드는 한 번만 쓴다
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = params.get('code')
    const error = params.get('error')

    // 카카오 동의 화면에서 취소하면 조용히 로그인으로 돌아간다
    if (error === 'access_denied') {
      navigate('/', { replace: true })
      return
    }

    const fail = () => navigate('/', { replace: true, state: { loginFailed: true } satisfies LoginLocationState })
    if (!code) {
      fail()
      return
    }

    loginWithKakao(code)
      .then((result) => {
        if (result.status === 'registered') {
          signIn(result.user)
          navigate('/home', { replace: true })
        } else {
          startSignup(result.kakaoId, result.kakaoName)
          navigate('/onboarding', { replace: true })
        }
      })
      .catch(fail)
  }, [params, navigate, signIn, startSignup])

  return (
    <div className={styles.screen}>
      <div className={styles.halo}>
        <img className={styles.bob} src={baseCharacter} alt="" width={128} height={100} />
      </div>
      <div role="status" aria-live="polite" className={styles.status}>
        <p>로그인하고 있어요</p>
        <span aria-hidden="true" className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  )
}
