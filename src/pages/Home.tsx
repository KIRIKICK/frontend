import type { ReactNode } from 'react'
import baseCharacter from '../assets/kiri-base.svg'
import { ChevronRight, QuestionIcon, VoteIcon } from '../components/icons'
import screen from '../components/Screen.module.css'
import { useSession } from '../lib/session'
import styles from './Home.module.css'

type KickCardProps = {
  title: string
  description: string
  icon: ReactNode
  tone: 'purple' | 'yellow'
  className: string
}

// 킥 만들기 화면은 다음 범위에서 연결한다
function KickCard({ title, description, icon, tone, className }: KickCardProps) {
  return (
    <button type="button" className={`${styles.kickCard} ${styles[tone]} ${className}`}>
      <span className={styles.kickIcon}>{icon}</span>
      <span className={styles.kickText}>
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <ChevronRight size={22} />
    </button>
  )
}

export default function Home() {
  const { user } = useSession()
  if (!user) return null

  return (
    <div className={screen.screen}>
      <header className={styles.header}>
        <span className={screen.logo}>끼리킥</span>
        <button type="button" aria-label="내 정보" className={screen.iconButton}>
          <span className={styles.avatar}>{user.name.slice(0, 1)}</span>
        </button>
      </header>

      <main className={styles.main}>
        <h1 className={`${styles.title} ${screen.up}`}>
          {user.name}님,
          <br />첫 킥을 날려볼까요?
        </h1>

        <div className={styles.kicks}>
          <KickCard
            title="나잘알킥"
            description="나를 제일 잘 아는 친구는 누구?"
            icon={<QuestionIcon />}
            tone="purple"
            className={styles.up2}
          />
          <KickCard
            title="투표킥"
            description="우리 중 오늘의 주인공은 누구?"
            icon={<VoteIcon />}
            tone="yellow"
            className={styles.up3}
          />
        </div>

        <section aria-labelledby="kk-rooms" className={`${styles.rooms} ${styles.up4}`}>
          <h2 id="kk-rooms">내 친구방</h2>
          <div className={styles.empty}>
            <img className={styles.bob} src={baseCharacter} alt="" width={104} height={81} />
            <p>킥을 날리면 친구방이 생겨요</p>
          </div>
        </section>
      </main>
    </div>
  )
}
