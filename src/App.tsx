import { LoadingPopover } from 'components/common/Loaders'
import Page from 'components/common/Page'
import Footer from 'components/Footer'
import Header from 'components/Header'
import StyledMainLayout from 'components/StyledMainLayout'
import { lazy, Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NotFound from 'views/NotFound'

const ErrorBoundary = lazy(() => import('views/ErrorBoundary'))
const DAppConnector = lazy(() => import('views/DAppConnector'))

const Home = lazy(() => import('views/Home'))

// const Impressum = lazy(() => import('views/Impressum'))
const PrivacyPolicy = lazy(() => import('views/PrivacyPolicy'))
const TermsOfService = lazy(() => import('views/TermsOfService'))
const CookieBanner = lazy(() => import('components/common/CookieBanner'))

export default function App() {
  const [, setHideSideMenu] = useState(false)
  return (
    <>
      <Header setHideSideMenu={setHideSideMenu} />

      <StyledMainLayout>
        <ErrorBoundary>
          <Suspense
            fallback={
              <Page>
                <LoadingPopover />
              </Page>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              <Route path="/internal/dapp-connector-bridge" element={<DAppConnector />} />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </StyledMainLayout>

      <Footer />
      <CookieBanner />
    </>
  )
}
