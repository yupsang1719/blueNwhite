import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'
import EditorialLink from '../components/ui/EditorialLink'
import { BeeDoodle } from '../components/BeeSketch'

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
    <Container className="flex flex-col items-center py-32 text-center">
      <BeeDoodle size={48} className="text-ink-muted/40" />
      <p className="mt-6 font-ed-serif font-black text-ed-5xl leading-none text-accent">404</p>
      <h1 className="mt-4 font-ed-serif font-bold text-ed-2xl text-ink">Page not found</h1>
      <p className="mt-3 max-w-prose text-ed-base text-ink-muted">
        The page <code className="text-ed-sm">{pathname}</code> doesn't exist.
      </p>
      <EditorialLink to="/" className="mt-10">Back to Home</EditorialLink>
    </Container>
    </>
  )
}
