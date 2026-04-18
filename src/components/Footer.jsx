import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpeg'

const footerLinks = {
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/about' },
    { label: 'Careers', path: '/contact' },
    { label: 'News', path: '/about' },
  ],
  Services: [
    { label: 'Architecture', path: '/services' },
    { label: 'Residential', path: '/services' },
    { label: 'Commercial', path: '/services' },
    { label: 'Inclusions', path: '/inclusions' },
  ],
  Projects: [
    { label: 'Featured Work', path: '/projects' },
    { label: 'Case Studies', path: '/projects' },
    { label: 'Portfolio', path: '/projects' },
    { label: 'Testimonials', path: '/projects' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-void border-t border-white/5">
      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-3">
              Let's Build Together
            </h2>
            <p className="text-white/50 text-lg">
              Ready to start your next project? Get in touch with our team.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-10 py-4 bg-amber text-white font-semibold tracking-wider uppercase text-sm hover:bg-amber-light transition-all duration-300 shrink-0 hover:shadow-lg hover:shadow-amber/20"
          >
            Start a Project
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="NPI" className="h-10 w-10 rounded-lg object-cover" />
              <div>
                <span className="text-white font-semibold text-sm tracking-wider uppercase block leading-tight">
                  Nationwide
                </span>
                <span className="text-amber text-[10px] font-medium tracking-[0.2em] uppercase">
                  Projects & Investments
                </span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Building the future through innovative architecture, quality construction,
              and strategic infrastructure development.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'LinkedIn', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-amber hover:border-amber/30 transition-all duration-300 text-xs font-bold"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-amber text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-white/40 text-sm hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Nationwide Projects Investments. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
