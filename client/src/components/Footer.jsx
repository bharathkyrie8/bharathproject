import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Shield, 
  ArrowUp, 
  Heart, 
  Award, 
  CheckCircle2, 
  Send,
  Compass
} from 'lucide-react';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0E1014',
        color: '#F3EFE8',
        borderTop: '1px solid rgba(197, 154, 90, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* =========================================================================
          TOP BANNER: NEWSLETTER & RACE MORNING ALERTS
          ========================================================================= */}
      <div 
        style={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
          padding: '40px 24px',
          backgroundColor: '#14171E'
        }}
      >
        <div 
          style={{ 
            maxWidth: 1240, 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 24 
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
              Race Morning Dispatch & Advisories
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.45rem', fontWeight: 600, color: '#FFF', marginTop: 4 }}>
              Stay Updated on Weather & Bib Collection
            </h3>
            <p style={{ color: '#A0A4AE', fontSize: '0.85rem', marginTop: 2 }}>
              Receive race dawn temperature updates, kit collection guidelines, and traffic advisories.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', maxWidth: 460 }}>
            <input 
              type="email" 
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                padding: '12px 18px',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFF',
                fontSize: '0.88rem',
                outline: 'none',
                flex: 1,
                minWidth: 'min(100%, 220px)'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#C59A5A',
                color: '#0E1014',
                padding: '12px 24px',
                borderRadius: 2,
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {subscribed ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-900" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send size={13} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================================
          GRAND EDITORIAL WATERMARK TYPOGRAPHY
          ========================================================================= */}
      <div 
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          textAlign: 'center',
          fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 8vw, 7.5rem)',
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: 'rgba(255, 255, 255, 0.02)',
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0
        }}
      >
        SALEM CYCLE MARATHON
      </div>

      {/* =========================================================================
          MAIN 4-COLUMN KNOWLEDGE & CURATION GRID
          ========================================================================= */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '70px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div className="grid-responsive-1-2-4" style={{ 
          paddingBottom: 60, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)' 
        }}>
          
          {/* Column 1: Heritage & Hospital Alliance */}
          <div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
              Institutional Alliance
            </span>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#FFF', marginTop: 6, marginBottom: 14 }}>
              Salem Cycle Marathon
            </h4>
            <p style={{ color: '#A0A4AE', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 16 }}>
              Under the patron clinical leadership of <strong>Kauvery Hospital Salem</strong>. Dedicated to cardiovascular heart wellness, sportsmanship, and clean zero-emission mobility across Tamil Nadu.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#C59A5A', fontWeight: 600 }}>
              <Heart size={14} />
              <span>Preventative Cardiology in Motion</span>
            </div>
          </div>

          {/* Column 2: Race Distances & Shortcuts */}
          <div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
              Race Categories
            </span>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#FFF', marginTop: 6, marginBottom: 14 }}>
              Choose Your Distance
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
              <li>
                <Link to="/register?category=21k-timed" style={{ color: '#DDD', textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <span>21.1 KM Half-Century (Timed)</span>
                  <strong style={{ color: '#C59A5A' }}>₹699</strong>
                </Link>
              </li>
              <li>
                <Link to="/register?category=10k-timed" style={{ color: '#DDD', textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <span>10 KM Challenge (Timed)</span>
                  <strong style={{ color: '#C59A5A' }}>₹499</strong>
                </Link>
              </li>
              <li>
                <Link to="/register?category=5k-fun-ride" style={{ color: '#DDD', textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <span>5 KM Community Fun Ride</span>
                  <strong style={{ color: '#C59A5A' }}>₹349</strong>
                </Link>
              </li>
              <li style={{ paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Link to="/event-info" style={{ color: '#C59A5A', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span>View Course Elevation & Timetable</span>
                  <ExternalLink size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Venue, Expo Dates & Coordinates */}
          <div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
              Flag-Off & Expo Ground
            </span>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#FFF', marginTop: 6, marginBottom: 14 }}>
              Kauvery Hospital Salem
            </h4>
            <div style={{ color: '#A0A4AE', fontSize: '0.85rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>#9/50, Trichy Main Road, Opp. Chandra Mahal, Seelanaickenpatti, Salem – 636201</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Calendar size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Kit Expo: 28 & 29 October 2026 (10 AM – 6 PM)</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: '#888' }}>
                <Compass size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span>GPS: 11.6185° N, 78.1473° E</span>
              </div>
            </div>
          </div>

          {/* Column 4: Help Desk & Direct Payment Verification */}
          <div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
              Assistance & Help Desk
            </span>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#FFF', marginTop: 6, marginBottom: 14 }}>
              Organizer Support
            </h4>
            <div style={{ color: '#A0A4AE', fontSize: '0.85rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>Official Inquiries:</span>
                <a href="mailto:bharathkyrie8@gmail.com" style={{ color: '#C59A5A', textDecoration: 'none' }}>
                  bharathkyrie8@gmail.com
                </a>
              </div>
              <div>
                <span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>Helpline & WhatsApp:</span>
                <span style={{ color: '#FFF' }}>+91 94422 10820 / +91 427 232 4000</span>
              </div>
              <div>
                <span style={{ color: '#888', fontSize: '0.75rem', display: 'block' }}>Payment Mode:</span>
                <span style={{ color: '#FFF' }}>Direct PhonePe / Google Pay QR (No PAN Required)</span>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM SIGNATURE BAR WITH BACK TO TOP BUTTON
            ========================================================================= */}
        <div style={{ 
          paddingTop: 32, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 16,
          fontSize: '0.78rem',
          color: '#8A8D96'
        }}>
          <div>
            © 2026 Salem Cycle Marathon. Handcrafted for Tamil Nadu Cycling League & Kauvery Hospital.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ & Support</Link>
            <Link to="/event-info" style={{ color: 'inherit', textDecoration: 'none' }}>Safety Code</Link>
            <Link to="/admin" style={{ color: '#C59A5A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Shield size={12} />
              <span>Admin Console</span>
            </Link>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              title="Return to Top"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(197, 154, 90, 0.35)',
                color: '#C59A5A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
