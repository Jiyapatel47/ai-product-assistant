import { Mail, Github, Twitter, Linkedin } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer className={`border-t ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent mb-4">
              FEEDLYTIC
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              AI-powered product intelligence from customer feedback.
            </p>

            {/* Newsletter */}
            <div className="space-y-2">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                />
                <button className={`px-3 py-2 rounded-lg transition ${isDark ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Security', 'Roadmap'].map((link) => (
                <li key={link}>
                  <a href="#" className={`text-sm transition ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-purple-600'}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className={`text-sm transition ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-purple-600'}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Docs', 'Help Center', 'Templates'].map((link) => (
                <li key={link}>
                  <a href="#" className={`text-sm transition ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-purple-600'}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Legal</h4>
            <ul className="space-y-3">
              {['Privacy', 'Terms', 'Security', 'Compliance'].map((link) => (
                <li key={link}>
                  <a href="#" className={`text-sm transition ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-purple-600'}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            © 2024 FEEDLYTIC. All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: Twitter, label: 'Twitter' },
              { icon: Github, label: 'GitHub' },
              { icon: Linkedin, label: 'LinkedIn' },
            ].map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className={`p-3 rounded-lg border transition-all duration-300 hover:scale-110 ${
                    isDark
                      ? 'border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-slate-800'
                      : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
