import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CursorFollower from './components/CursorFollower'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Estimator from './pages/Estimator'
import EstimatorAdmin from './pages/EstimatorAdmin'
import Inclusions from './pages/Inclusions'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isEstimator = location.pathname.startsWith('/estimator')
  const isAdmin = location.pathname === '/estimator/admin'

  return (
    <div className={`min-h-screen ${isEstimator ? 'bg-void' : 'bg-void text-white lg:cursor-none'}`}>
      {!isEstimator && <CursorFollower />}
      <ScrollToTop />
      {!isEstimator && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inclusions" element={<Inclusions />} />
          <Route path="/estimator" element={<Estimator />} />
          <Route path="/estimator/admin" element={<EstimatorAdmin />} />
        </Routes>
      </AnimatePresence>
      {!isEstimator && <Footer />}
    </div>
  )
}
