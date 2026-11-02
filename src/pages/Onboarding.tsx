import { useCallback, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { signUp } from '../api/auth'
import excitedCharacter from '../assets/kiri-excited.svg'
import { ChevronLeft } from '../components/icons'
import screen from '../components/Screen.module.css'
import { Toast } from '../components/Toast'
import { useSession } from '../lib/session'
import styles from './Onboarding.module.css'
import TermsSheet from './TermsSheet'

const NAME_MAX = 10

export default function Onboarding() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const { pending, updatePending, signIn } = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)
  const hideToast = useCallback(() => setFailed(false), [])

  // RequirePending 안에서만 렌더링된다
  if (!pending) return null

  const name = pending.name
  const nameEmpty = name.trim().length === 0
  // 시트는 주소(?step=terms)로 열어서 브라우저 뒤로 가기로도 닫히게 한다
  const sheetOpen = params.get('step') === 'terms' && !nameEmpty

  const openSheet = () => {
    if (!nameEmpty) setParams({ step: 'terms' })
  }

  const closeSheet = () => {
    if (location.key !== 'default') navigate(-1)
    else setParams({}, { replace: true })
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const user = await signUp(pending)
      signIn(user)
      navigate('/home', { replace: true })
    } catch {
      setFailed(true)
      setSubmitting(false)
    }
  }

  return (
    <div className={screen.screen}>
      <header className={styles.header}>
        <button type="button" aria-label="뒤로 가기" className={screen.iconButton} onClick={() => navigate('/')}>
          <ChevronLeft />
        </button>
      </header>

      <main className={`${styles.main} ${screen.up}`}>
        <div className={styles.intro}>
          <img src={excitedCharacter} alt="" width={72} height={52} />
          <h1 className={styles.title}>
            친구들한테 보일
            <br />
            이름을 정해주세요
          </h1>
        </div>

        <form
          className={styles.field}
          onSubmit={(e) => {
            e.preventDefault()
            openSheet()
          }}
        >
          <label htmlFor="kk-name">이름</label>
          <div className={styles.inputBox}>
            <input
              id="kk-name"
              type="text"
              value={name}
              maxLength={NAME_MAX}
              autoComplete="nickname"
              enterKeyHint="next"
              onChange={(e) => updatePending({ name: e.target.value.slice(0, NAME_MAX) })}
            />
            <span className={styles.count}>
              {name.length}/{NAME_MAX}
            </span>
          </div>
        </form>
      </main>

      <footer className={styles.footer}>
        <button type="button" className={screen.primaryButton} disabled={nameEmpty} onClick={openSheet}>
          다음
        </button>
      </footer>

      {sheetOpen && (
        <TermsSheet
          terms={pending.terms}
          onChange={(terms) => updatePending({ terms })}
          onClose={closeSheet}
          onSubmit={submit}
          submitting={submitting}
        />
      )}

      {failed && <Toast message="가입하지 못했어요. 다시 시도해 주세요." onDone={hideToast} />}
    </div>
  )
}
