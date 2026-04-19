import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { FiSun, FiMoon, FiGithub, FiLinkedin, FiMail, FiMenu, FiX } from 'react-icons/fi'
import { useDarkMode } from '../shared/useDarkMode'

const socials = [
  { icon: FiGithub,   label: 'GitHub',   href: 'https://github.com/yourname' },
  { icon: FiLinkedin, label: 'LinkedIn',  href: 'https://linkedin.com/in/yourname' },
  { icon: FiMail,     label: 'Email',     href: 'mailto:you@email.com' },
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
    <div className="min-h-dvh flex flex-col">
      <header ref={headerRef} className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur dark:bg-neutral-950/70 dark:border-neutral-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

          <Link to="/" className="text-lg font-bold tracking-tight" onClick={() => setMenuOpen(false)}>
            Birash<span className="text-primary-600">.</span>
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
                    `rounded-lg px-3 py-1.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ` +
                    (isActive ? 'font-semibold text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-300')
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
              className="ml-1 grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white
                         text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800
                         dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400
                         dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="ml-1 grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white
                         text-neutral-500 transition hover:bg-neutral-100 sm:hidden
                         dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {menuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="border-t bg-white/95 px-4 pb-4 pt-2 backdrop-blur sm:hidden
                          dark:border-neutral-800 dark:bg-neutral-950/95">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ` +
                  (isActive ? 'font-semibold text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-300')
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 dark:border-neutral-800">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} Birash Thing
          </span>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 text-neutral-500
                           transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600
                           dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-primary-700
                           dark:hover:bg-primary-950/40 dark:hover:text-primary-400"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
