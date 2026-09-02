import { useState, useEffect, useContext } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { ThemeContext } from '../../context/ThemeContext'

export default function Navbar({ isScrolling, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('product')
  const { isDark, toggleTheme } = useContext(ThemeContext)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navItems = [
    { label: 'Product', id: 'product' },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'AI Copilot', id: 'ai-copilot' },
    { label: 'Use Cases', id: 'use-cases' },
  ]

  const scrollToSection = (id) => {
    setActiveNav(id)
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? isScrolling
            ? 'bg-slate-950/95 backdrop-blur-md border-b border-cyan-500/20 shadow-sm'
            : 'bg-slate-950/80 backdrop-blur-sm'
          : isScrolling
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className={`text-2xl font-bold bg-linear-to-r ${
              isDark ? 'from-cyan-400 to-teal-400' : 'from-teal-600 to-cyan-500'
            } bg-clip-text text-transparent`}>
              FEEDLYTIC
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  activeNav === item.id
                    ? isDark ? 'text-cyan-400' : 'text-teal-600'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeNav === item.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${
                    isDark ? 'from-cyan-400 to-teal-400' : 'from-teal-600 to-cyan-500'
                  } rounded-full`} />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => onNavigate('auth')} className={`px-4 py-2 text-sm font-medium ${
              isDark ? 'text-slate-300 hover:text-slate-100' : 'text-slate-700 hover:text-slate-900'
            } transition`}>
              Login
            </button>
            <button onClick={() => onNavigate('auth')} className={`px-6 py-2 bg-linear-to-r ${
              isDark ? 'from-cyan-500 to-teal-400' : 'from-teal-600 to-cyan-500'
            } text-white text-sm font-medium rounded-full ${
              isDark ? 'hover:shadow-lg hover:shadow-cyan-500/30' : 'hover:shadow-lg hover:shadow-teal-500/30'
            } transition-all duration-300 hover:scale-105`}>
              Get Started
            </button>
          </div>

          {/* Theme toggle + Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 animate-in slide-in-from-top ${
            isDark ? 'bg-slate-900/50' : ''
          }`}>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    activeNav === item.id
                      ? isDark ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'bg-teal-100 text-teal-600 font-medium'
                      : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className={`pt-2 border-t ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              } flex flex-col gap-3`}>
                <button onClick={() => onNavigate('auth')} className={`w-full px-4 py-2 text-sm font-medium ${
                  isDark
                    ? 'border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition'
                    : 'border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition'
                }`}>
                  Login
                </button>
                <button onClick={() => onNavigate('auth')} className={`w-full px-4 py-2 bg-linear-to-r ${
                  isDark ? 'from-cyan-500 to-teal-400' : 'from-teal-600 to-cyan-500'
                } text-white text-sm font-medium rounded-lg ${
                  isDark ? 'hover:shadow-lg hover:shadow-cyan-500/30' : 'hover:shadow-lg hover:shadow-teal-500/30'
                } transition`}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
