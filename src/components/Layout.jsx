import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiGithub, FiLinkedin, FiMail, FiMenu, FiX } from 'react-icons/fi'
import { useDarkMode } from '../shared/useDarkMode'
import AskBirash from './AskBirash'
import ReactGA from 'react-ga4'

const socials = [
  { icon: FiGithub,   label: 'GitHub',   href: 'https://github.com/yupsang1719' },
  { icon: FiLinkedin, label: 'LinkedIn',  href: 'https://linkedin.com/in/yupsang' },
  { icon: FiMail,     label: 'Email',     href: 'mailto:thenngbirash124@gmail.com' },
]

const nav = [
  { to: '/',         label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
]

export default function Layout() {
  const [dark, toggleDark] = useDarkMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    ReactGA.send({ hitType: 'pageview', page: pathname, title: document.title })
  }, [pathname])

  // Close mobile menu when clicking outside the header
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div className="min-h-dvh flex flex-col bg-paper text-ink">
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-rule bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-3">

          <Link to="/" className="font-ed-serif text-lg font-bold tracking-ed-tight" onClick={() => setMenuOpen(false)}>
            Birash<span className="text-accent">.</span>
          </Link>

          <div className="flex items-center gap-1">
            {/* Desktop nav links */}
            <nav className="hidden sm:flex items-center gap-1">
              {nav.map(n => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-ed-sm transition-colors ` +
                    (isActive ? 'font-semibold text-accent' : 'text-ink-muted hover:text-accent')
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>

            {/* Dark mode toggle — always visible */}
            <button
              onClick={toggleDark}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="ml-1 grid h-8 w-8 place-items-center text-ink-muted transition-colors hover:text-accent"
            >
              {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="ml-1 grid h-8 w-8 place-items-center text-ink-muted transition-colors hover:text-accent sm:hidden"
            >
              {menuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="border-t border-rule bg-paper/95 px-4 pb-4 pt-2 backdrop-blur sm:hidden">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 text-ed-sm transition-colors ` +
                  (isActive ? 'font-semibold text-accent' : 'text-ink-muted hover:text-accent')
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-4 py-8">
        <Outlet />
      </main>

      <AskBirash />

      <footer className="border-t border-rule py-8">
        <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <span className="text-ed-sm text-ink-muted">
            © {new Date().getFullYear()} Birash Thing
          </span>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                onClick={() => ReactGA.event({ category: 'Outbound', action: 'click', label })}
                className="text-ink-muted transition-colors hover:text-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
