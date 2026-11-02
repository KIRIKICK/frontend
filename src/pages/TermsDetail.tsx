import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from '../components/icons'
import screen from '../components/Screen.module.css'
import { useSession } from '../lib/session'
import styles from './TermsDetail.module.css'

// 약관 본문은 확정 후 채운다
const ARTICLES = ['제1조 목적', '제2조 용어의 뜻', '제3조 약관의 게시와 변경', '제4조 서비스 제공', '제5조 회원 탈퇴']

const PRIVACY_ROWS = [
  { term: '수집 항목', desc: '카카오 회원번호, 카카오 프로필 닉네임, 끼리킥에서 정한 이름' },
  { term: '수집 목적', desc: '회원 확인, 친구방과 킥 서비스 제공' },
  { term: '보유·이용 기간', desc: '[기간 확정 후 넣기]' },
  { term: '동의를 거부할 권리', desc: '동의하지 않을 수 있어요. 다만 동의하지 않으면 가입할 수 없어요.' },
]

export default function TermsDetail() {
  const { doc } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { pending } = useSession()

  if (doc !== 'service' && doc !== 'privacy') return <Navigate to="/" replace />
  const isPrivacy = doc === 'privacy'

  const goBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate(pending ? '/onboarding?step=terms' : '/', { replace: true })
  }

  return (
    <div className={`${screen.screen} ${styles.screen}`}>
      <header className={styles.header}>
        <button type="button" aria-label="이전 화면으로 돌아가기" className={screen.iconButton} onClick={goBack}>
          <ChevronLeft />
        </button>
        <h1>{isPrivacy ? '개인정보 수집·이용' : '이용약관'}</h1>
        <span className={styles.spacer} />
      </header>

      <main className={styles.main}>
        {isPrivacy ? (
          <dl className={styles.table}>
            {PRIVACY_ROWS.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.desc}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className={styles.articles}>
            <p className={styles.effective}>시행일 [YYYY.MM.DD]</p>
            {ARTICLES.map((title) => (
              <section key={title}>
                <h2>{title}</h2>
                <p>[본문 확정 후 넣기]</p>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
