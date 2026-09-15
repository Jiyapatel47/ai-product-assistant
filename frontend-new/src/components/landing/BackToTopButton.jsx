import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 animate-in fade-in slide-in-from-bottom-4"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  )
}
