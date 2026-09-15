import { useEffect, useState } from 'react'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight

      const scrollProgress =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0

      setProgress(scrollProgress)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}