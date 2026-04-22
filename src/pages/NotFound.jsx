import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  const { pathname } = useLocation()

  useEffect(() => {
    ReactGA.event({ category: '404', action: 'not_found', label: pathname })
  }, [pathname])

  return (
    <>
    <Helmet>
      <title>404 — Page Not Found · Birash Thing</title>
      <meta name="description" content="This page doesn't exist. Head back to Birash Thing's portfolio." />
    </Helmet>
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-6xl font-bold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
        The page <code className="text-sm">{pathname}</code> doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white
                   transition hover:bg-primary-700"
      >
        Back to Home
      </Link>
    </div>
    </>
  )
}
