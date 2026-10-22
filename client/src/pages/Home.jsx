import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  Award, 
  Timer, 
  ShieldCheck, 
  HeartHandshake, 
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import CategoryCards from '../components/CategoryCards';
import { getEventConfig, getCategories } from '../services/api';

const Home = () => {
  const [eventData, setEventData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const showcaseSlides = [
    {
      title: 'High Energy Flag-Off Arena',
      subtitle: '01 • KAUVERY HOSPITAL ARENA',
      image: '/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (3).png',
      desc: 'The dawn atmosphere at the starting arch as hundreds of cyclists gather for flag-off.'
    },
    {
      title: 'The Endurance Peloton in Motion',
      subtitle: '02 • EASTERN BYPASS CORRIDOR',
      image: '/images/Golden Hour Mountain Climb.png',
      desc: 'Rolling tarmac, morning golden light, and disciplined pacelines pushing towards the 21.1 KM split.'
    },
    {
      title: 'Bib Collection & Pre-Race Expo',
      subtitle: '03 • HOSPITALITY & KIT ARENA',
      image: '/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (1).png',
      desc: 'Riders collecting personalized RFID timing chips, dry-fit jerseys, and breakfast passes.'
    }
  ];

  useEffect(() => {
    getEventConfig()
      .then((data) => setEventData(data))
      .catch(() => console.log('Loaded default event settings'));

    getCategories()
      .then((data) => setCategories(data))
      .catch(() => console.log('Loaded default categories'));
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? showcaseSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === showcaseSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20' }}>
      
      {/* =========================================================================
          HERO SECTION — Cinematic Golden Hour Background & Editorial Typography
          ========================================================================= */}
      <section style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '92vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden', 
        backgroundColor: '#0E1014', 
        color: '#FFFFFF',
        padding: '110px 24px 70px'
      }}>
        {/* Background Image with Cinematic Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/images/Golden Hour Mountain Climb.png"
            alt="Salem Cycle Marathon peloton climbing at sunrise"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.68) contrast(1.08)'
            }}
          />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(14,16,20,0.5) 0%, rgba(14,16,20,0.85) 100%)' 
          }} />
        </div>

        {/* Hero Content Container */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          textAlign: 'center', 
          maxWidth: 900, 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          {/* Eyebrow Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              marginBottom: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#C59A5A',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}
          >
            <Calendar size={13} />
            <span>30 OCTOBER 2026 • SALEM, TAMIL NADU</span>
          </motion.div>

          {/* Main Editorial Headline - Styled after Melanie Hay reference */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
              fontWeight: 500,
              lineHeight: 1.08,
              color: '#FFFFFF',
              marginBottom: 20
            }}
          >
            <em style={{ fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, display: 'block' }}>
              The Showcase of
            </em>
            <span style={{ 
              fontFamily: "'Cinzel', serif", 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              display: 'block', 
              marginTop: 4, 
              color: '#F7F5F0' 
            }}>
              Reimagined Spaces
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#DCDAD4',
              maxWidth: 680,
              margin: '0 auto 32px',
              fontWeight: 300,
              lineHeight: 1.7
            }}
          >
            Giving you a glimpse into the feel and flow of endurance cycling. Unite for heart health, green mobility, and sportsmanship at <strong>Kauvery Hospital, Salem</strong>.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ width: '100%', marginBottom: 36 }}
          >
            <CountdownTimer
              targetDate="2026-10-30T05:30:00+05:30"
              deadline="2026-10-25T23:00:00+05:30"
            />
          </motion.div>

          {/* Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link
              to="/register"
              style={{
                backgroundColor: '#C59A5A',
                color: '#0E1014',
                padding: '16px 36px',
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(197, 154, 90, 0.3)'
              }}
            >
              <span>Register for Marathon</span>
              <ArrowUpRight size={16} />
            </Link>

            <Link
              to="/event-info"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '16px 32px',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>View Route & Schedule</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL STATEMENT SECTION — Reference Design Typography Mirror
          ========================================================================= */}
      <section style={{ padding: '90px 24px', backgroundColor: '#FAF7F2', textAlign: 'center', borderBottom: '1px solid rgba(29,30,32,0.06)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ 
            display: 'block',
            letterSpacing: '0.22em', 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase',
            marginBottom: 14
          }}>
            FAVOURITE CORNERS • SALEM CYCLE MARATHON
          </span>

          <h2 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', 
            fontWeight: 500, 
            color: '#1D1E20', 
            lineHeight: 1.3,
            marginBottom: 20
          }}>
            "Creating artfully considered endurance journeys that welcome restoration,
            conversation, and celebration is what we do best."
          </h2>

          <p style={{ color: '#666', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: 640, margin: '0 auto' }}>
            From high-cadence pacelines to scenic morning breeze, the Salem Cycle Marathon echoes our community's passion for heart wellness. Every client and athlete who pedals with us serves as our muse — giving us the effortless inspiration to conceptualize an unforgettable race day.
          </p>
        </div>
      </section>

      {/* =========================================================================
          STAGGERED 3-PHOTO SHOWCASE WITH CIRCULAR ARROWS (Melanie Hay Style)
          ========================================================================= */}
      <section style={{ padding: '80px 24px 100px', backgroundColor: '#F3EFE8', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
                Visual Highlights
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 600, color: '#1D1E20', marginTop: 4 }}>
                Moments of Triumph & Unity
              </h3>
            </div>

            {/* Circular Carousel Controls */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handlePrevSlide}
                className="btn-circle-nav"
                title="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextSlide}
                className="btn-circle-nav"
                title="Next photo"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* 3-Photo Staggered Showcase Frame */}
          <div className="grid-responsive-1-2-3" style={{ alignItems: 'center' }}>
            {/* Card 1: Left */}
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 4, 
              overflow: 'hidden', 
              border: '1px solid rgba(29,30,32,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
            }}>
              <div style={{ height: 'clamp(240px, 32vw, 380px)', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={showcaseSlides[activeSlide % 3].image} 
                  alt="Left Showcase" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px 24px' }}>
                <span style={{ fontSize: '0.7rem', color: '#8C6830', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {showcaseSlides[activeSlide % 3].subtitle}
                </span>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, marginTop: 4 }}>
                  {showcaseSlides[activeSlide % 3].title}
                </h4>
                <p style={{ color: '#666', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.5 }}>
                  {showcaseSlides[activeSlide % 3].desc}
                </p>
              </div>
            </div>

            {/* Card 2: Center Elevated */}
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: 4, 
                overflow: 'hidden', 
                border: '2px solid #C59A5A',
                boxShadow: '0 16px 40px rgba(197, 154, 90, 0.15)'
              }}
            >
              <div style={{ height: 'clamp(260px, 36vw, 420px)', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={showcaseSlides[(activeSlide + 1) % 3].image} 
                  alt="Center Showcase" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px 28px' }}>
                <span style={{ fontSize: '0.7rem', color: '#8C6830', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {showcaseSlides[(activeSlide + 1) % 3].subtitle}
                </span>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 600, marginTop: 4 }}>
                  {showcaseSlides[(activeSlide + 1) % 3].title}
                </h4>
                <p style={{ color: '#666', fontSize: '0.88rem', marginTop: 6, lineHeight: 1.5 }}>
                  {showcaseSlides[(activeSlide + 1) % 3].desc}
                </p>
              </div>
            </div>

            {/* Card 3: Right */}
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 4, 
              overflow: 'hidden', 
              border: '1px solid rgba(29,30,32,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
            }}>
              <div style={{ height: 'clamp(240px, 32vw, 380px)', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={showcaseSlides[(activeSlide + 2) % 3].image} 
                  alt="Right Showcase" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px 24px' }}>
                <span style={{ fontSize: '0.7rem', color: '#8C6830', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {showcaseSlides[(activeSlide + 2) % 3].subtitle}
                </span>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, marginTop: 4 }}>
                  {showcaseSlides[(activeSlide + 2) % 3].title}
                </h4>
                <p style={{ color: '#666', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.5 }}>
                  {showcaseSlides[(activeSlide + 2) % 3].desc}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          REGISTRATION CATEGORIES DECK
          ========================================================================= */}
      <section id="categories" style={{ padding: '90px 24px', backgroundColor: '#FAF7F2' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <CategoryCards categories={categories} />
        </div>
      </section>

      {/* =========================================================================
          VENUE & HOSPITALITY — Kauvery Hospital Salem
          ========================================================================= */}
      <section style={{ padding: '90px 24px', backgroundColor: '#0E1014', color: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="grid-responsive-1-2" style={{ alignItems: 'center' }}>
            
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
                Venue & Medical Partner
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 600, marginTop: 8, marginBottom: 16 }}>
                Kauvery Hospital Salem
              </h3>
              <p style={{ color: '#A0A4AE', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 24 }}>
                Salem's premier healthcare institution hosts the flag-off arena, rider assembly, technical cycle inspection, and celebratory post-race breakfast buffet.
              </p>

              <div style={{ backgroundColor: '#16191E', padding: '20px 24px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 28 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div style={{ fontSize: '0.88rem' }}>
                    <strong style={{ color: '#FFF', display: 'block' }}>Address:</strong>
                    <span style={{ color: '#A0A4AE' }}>#9/50, Trichy Main Road, Opp. Chandra Mahal, Seelanaickenpatti, Salem – 636201</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div style={{ fontSize: '0.88rem' }}>
                    <strong style={{ color: '#FFF', display: 'block' }}>Kit Expo Dates:</strong>
                    <span style={{ color: '#A0A4AE' }}>28 & 29 October 2026 (10:00 AM – 06:00 PM IST)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/TSxqXnA53sUKqdsv9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#C59A5A',
                    color: '#0E1014',
                    padding: '12px 24px',
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </a>

                <Link
                  to="/event-info"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#FFF',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '12px 24px',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  <span>Event Guide</span>
                </Link>
              </div>
            </div>

            <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <img
                src="/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw.png"
                alt="Kauvery Hospital Salem Arena"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION BANNER
          ========================================================================= */}
      <section style={{ padding: '80px 24px', backgroundColor: '#F3EFE8', textAlign: 'center', borderTop: '1px solid rgba(197, 154, 90, 0.3)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
            Registration Deadline: 25 October 2026 at 11:00 PM IST
          </span>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', fontWeight: 600, color: '#1D1E20', marginTop: 8, marginBottom: 12 }}>
            Ready to Take Your Position at the Start Line?
          </h3>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 28 }}>
            Choose from 21.1 KM, 10 KM, or 5 KM. Secure instant slot verification via PhonePe & Google Pay QR scan.
          </p>

          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#1D1E20',
              color: '#FAF7F2',
              padding: '16px 36px',
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}
          >
            <span>Register Now for Salem Marathon</span>
            <ChevronRight size={16} className="text-amber-400" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
