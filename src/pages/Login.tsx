import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getKakaoAuthorizeUrl } from '../api/auth'
import kickCharacter from '../assets/kiri-kick.svg'
import { KakaoIcon, Sparkle } from '../components/icons'
import screen from '../components/Screen.module.css'
import { Toast } from '../components/Toast'
import styles from './Login.module.css'

export type LoginLocationState = { loginFailed?: boolean } | null

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(() => Boolean((location.state as LoginLocationState)?.loginFailed))

  const hideToast = useCallback(() => {
    setFailed(false)
    // 새로고침 때 토스트가 다시 뜨지 않도록 state를 비운다
    navigate(location.pathname, { replace: true, state: null })
  }, [navigate, location.pathname])

  const startKakaoLogin = () => {
    const url = getKakaoAuthorizeUrl()
    if (url.startsWith('/')) navigate(url)
    else window.location.assign(url)
  }

  return (
    <div className={screen.screen}>
      <header className={styles.header}>
        <span className={screen.logo}>끼리킥</span>
      </header>

      <main className={styles.main}>
        <h1 className={`${styles.title} ${screen.up}`}>
          친구한테
          <br />
          킥 한 번
          <br />
          날려볼까?
        </h1>

        <div
          role="img"
          aria-label="투표킥과 나잘알킥 예시 질문 카드 옆에서 캐릭터가 발차기하는 그림"
          className={styles.stage}
        >
          <div className={`${styles.voteCardWrap} ${styles.up2}`}>
            <div className={styles.float2}>
              <div className={styles.voteCard}>
                <span className={styles.chipYellow}>투표킥</span>
                <p>우리 중 무인도에서 제일 오래 살아남을 사람은?</p>
              </div>
            </div>
          </div>

          <div className={`${styles.quizCardWrap} ${styles.up3}`}>
            <div className={styles.float}>
              <div className={styles.quizCard}>
                <span className={styles.chipPurple}>나잘알킥</span>
                <p>민지가 하루 동안 투명인간이 된다면 가장 먼저 할 일은?</p>
                <div className={styles.options}>
                  <span>영화관 몰래 가기</span>
                  <span>친구 놀래키기</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.character} ${styles.up3}`}>
            <img className={styles.bob} src={kickCharacter} alt="" width={132} height={110} />
          </div>

          <Sparkle size={18} color="#FFCB47" className={`${styles.twinkle} ${styles.sparkleA}`} />
          <Sparkle size={12} color="#FD77B0" className={`${styles.twinkle} ${styles.sparkleB}`} />
        </div>
      </main>

      <footer className={styles.footer}>
        <button type="button" className={styles.kakaoButton} onClick={startKakaoLogin}>
          <KakaoIcon />
          카카오로 계속하기
        </button>
        <p className={styles.legal}>
          <Link to="/terms/service">이용약관</Link> · <Link to="/terms/privacy">개인정보처리방침</Link>
        </p>
      </footer>

      {failed && <Toast message="로그인에 실패했어요. 다시 시도해 주세요." onDone={hideToast} />}
    </div>
  )
}
