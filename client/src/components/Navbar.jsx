import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ArrowUpRight, Sparkles, Bike, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Categories', path: '/#categories' },
    { name: 'Event Guide', path: '/event-info' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const isHome = location.pathname === '/';

  return (
    <>
      {/* Floating Capsule Header Container */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 999,
          padding: isScrolled ? '8px 12px' : '14px 16px',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none' // Allows clicking around the floating capsule
        }}
        className="md:py-4 md:px-6"
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            pointerEvents: 'auto',
            backgroundColor: isScrolled
              ? 'rgba(14, 16, 20, 0.92)'
              : isHome
              ? 'rgba(14, 16, 20, 0.82)'
              : 'rgba(250, 247, 242, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 50,
            border: isScrolled || isHome
              ? '1px solid rgba(197, 154, 90, 0.35)'
              : '1px solid rgba(29, 30, 32, 0.12)',
            boxShadow: isScrolled
              ? '0 16px 40px rgba(0, 0, 0, 0.35), 0 0 20px rgba(197, 154, 90, 0.12)'
              : '0 8px 30px rgba(0, 0, 0, 0.15)',
            padding: '6px 10px 6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="md:px-5 md:py-2"
        >
          {/* Brand Logo & Monogram */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            {/* Glowing Monogram Circle */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: isScrolled || isHome ? '#1D212A' : '#FAF5EE',
                border: '1.5px solid #C59A5A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C59A5A',
                fontFamily: "'Cinzel', serif",
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                boxShadow: '0 0 12px rgba(197, 154, 90, 0.25)',
                flexShrink: 0
              }}
            >
              SM
            </div>

            {/* Brand Title */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Cinzel', 'Playfair Display', serif",
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isScrolled || isHome ? '#FFFFFF' : '#1D1E20',
                  lineHeight: 1.1
                }}
                className="md:text-sm md:tracking-widest"
              >
                SALEM MARATHON
              </span>
              <span
                className="hidden sm:block"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#C59A5A',
                  fontWeight: 600,
                  marginTop: 2
                }}
              >
                KAUVERY HOSPITAL • 2026
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop Pill Navigation) */}
          <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: 6 }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: 30,
                    color: active
                      ? '#0E1014'
                      : isScrolled || isHome
                      ? '#E0E2E8'
                      : '#33363F',
                    backgroundColor: active ? '#C59A5A' : 'transparent',
                    transition: 'all 0.25s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = isScrolled || isHome
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(29, 30, 32, 0.06)';
                      e.currentTarget.style.color = '#C59A5A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = isScrolled || isHome ? '#E0E2E8' : '#33363F';
                    }
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Island (Status + Admin + Register + Mobile Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Live Event Date Badge (Hidden on mobile & tablet) */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                backgroundColor: isScrolled || isHome ? 'rgba(255, 255, 255, 0.06)' : '#FAF5EE',
                border: isScrolled || isHome ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(197, 154, 90, 0.3)',
                color: '#C59A5A',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#1B6A50',
                  boxShadow: '0 0 6px #1B6A50'
                }}
              />
              <span>30 OCT 2026</span>
            </div>

            {/* Register CTA Button (Responsive padding) */}
            <Link
              to="/register"
              style={{
                backgroundColor: '#C59A5A',
                color: '#0E1014',
                padding: '8px 16px',
                borderRadius: 30,
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 4px 14px rgba(197, 154, 90, 0.3)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              className="md:px-5 md:py-2.5 md:text-xs"
            >
              <span>Register</span>
              <ArrowUpRight size={13} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
              className="flex lg:hidden"
              style={{
                background: 'none',
                border: 'none',
                color: isScrolled || isHome ? '#FFFFFF' : '#1D1E20',
                padding: 6,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: 'rgba(10, 12, 16, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 998,
              padding: '110px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700, display: 'block', marginBottom: 20 }}>
                Navigation & Directory
              </span>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { name: 'Home', path: '/', num: '01' },
                  { name: 'About Marathon', path: '/about', num: '02' },
                  { name: 'Race Categories', path: '/#categories', num: '03' },
                  { name: 'Event Guide & Route', path: '/event-info', num: '04' },
                  { name: 'Photo Gallery', path: '/gallery', num: '05' },
                  { name: 'Contact & Support', path: '/contact', num: '06' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 16,
                      color: location.pathname === item.path ? '#C59A5A' : '#FAF7F2',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingBottom: 12
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#888' }}>
                      {item.num}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 600 }}>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div style={{ paddingTop: 28, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.82rem', color: '#A0A4AE', lineHeight: 1.6, marginBottom: 16 }}>
                <strong style={{ color: '#FFF' }}>Kauvery Hospital Salem</strong><br />
                Race Day: 30 October 2026 • 04:30 AM IST
              </div>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  backgroundColor: '#C59A5A',
                  color: '#0E1014',
                  padding: '14px',
                  borderRadius: 30,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none'
                }}
              >
                <span>Register for Marathon</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
