import { Compass } from 'lucide-react'

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Compass size={19} strokeWidth={2.4} />
        <span>Auto DM</span>
      </div>
    </header>
  )
}
