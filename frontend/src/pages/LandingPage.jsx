import { useEffect, useState, useContext } from 'react'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import TrustedSourcesStrip from '../components/landing/TrustedSourcesStrip'
import ProblemSection from '../components/landing/ProblemSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import FeaturesGrid from '../components/landing/FeaturesGrid'
import ProductPreviewSection from '../components/landing/ProductPreviewSection'
import AICopilorPreview from '../components/landing/AICopilorPreview'
import RoadmapPreview from '../components/landing/RoadmapPreview'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'
import ScrollProgressBar from '../components/landing/ScrollProgressBar'
import BackToTopButton from '../components/landing/BackToTopButton'
import { ThemeContext } from '../context/ThemeContext'

export default function LandingPage({ onNavigate }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const { isDark } = useContext(ThemeContext)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`w-full min-h-screen overflow-x-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      <ScrollProgressBar />
      <Navbar isScrolling={isScrolling} onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <TrustedSourcesStrip />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesGrid />
      <ProductPreviewSection />
      <AICopilorPreview />
      <RoadmapPreview />
      <FinalCTA onNavigate={onNavigate} />
      <Footer />
      <BackToTopButton />
    </div>
  )
}
