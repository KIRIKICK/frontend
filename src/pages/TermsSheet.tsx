import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { TermsAgreement } from '../api/auth'
import { CheckIcon, ChevronRight } from '../components/icons'
import screen from '../components/Screen.module.css'
import styles from './TermsSheet.module.css'

type Props = {
  terms: TermsAgreement
  onChange: (terms: TermsAgreement) => void
  onClose: () => void
  onSubmit: () => void
  submitting: boolean
}

const ITEMS: { key: keyof TermsAgreement; label: string; viewLabel: string; to: string }[] = [
  { key: 'service', label: '[필수] 이용약관 동의', viewLabel: '이용약관 보기', to: '/terms/service' },
  { key: 'privacy', label: '[필수] 개인정보 수집·이용 동의', viewLabel: '개인정보 수집·이용 보기', to: '/terms/privacy' },
]

function Checkbox({ on }: { on: boolean }) {
  return <span className={`${styles.box} ${on ? styles.boxOn : ''}`}>{on && <CheckIcon />}</span>
}

export default function TermsSheet({ terms, onChange, onClose, onSubmit, submitting }: Props) {
  const sheetRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  const allOn = terms.service && terms.privacy

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // 열릴 때 한 번만 포커스를 옮기고 Esc로 닫히게 한다
  useEffect(() => {
    sheetRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={styles.overlay}>
      <button type="button" aria-label="닫기" className={styles.backdrop} onClick={onClose} />
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kk-terms-title"
        tabIndex={-1}
        className={styles.sheet}
      >
        <span aria-hidden="true" className={styles.grabber} />
        <h2 id="kk-terms-title" className={styles.title}>
          약관에 동의해 주세요
        </h2>

        <button
          type="button"
          role="checkbox"
          aria-checked={allOn}
          className={styles.allRow}
          onClick={() => onChange({ service: !allOn, privacy: !allOn })}
        >
          <Checkbox on={allOn} />
          <span>전체 동의</span>
        </button>

        <ul className={styles.list}>
          {ITEMS.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={terms[item.key]}
                className={styles.itemRow}
                onClick={() => onChange({ ...terms, [item.key]: !terms[item.key] })}
              >
                <Checkbox on={terms[item.key]} />
                <span>{item.label}</span>
              </button>
              <Link to={item.to} aria-label={item.viewLabel} className={styles.view}>
                <ChevronRight />
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={screen.primaryButton}
          disabled={!allOn || submitting}
          aria-busy={submitting}
          onClick={onSubmit}
        >
          동의하고 시작하기
        </button>
      </section>
    </div>
  )
}
