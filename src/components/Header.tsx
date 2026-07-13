import { Link } from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="app-header">
      <nav className="app-frame app-nav" aria-label="Main navigation">
        <Link className="brand-mark" to="/">
          <span className="brand-mark__icon"><Compass size={18} strokeWidth={2.6} /></span>
          <span>Auto DM</span>
        </Link>
        <p className="app-nav__note">Tabletop adventure helper</p>
        <ThemeToggle />
      </nav>
    </header>
  )
}
