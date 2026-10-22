import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  Leaf, 
  Users, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Stethoscope,
  Bike,
  Compass
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: '5,000+', label: 'Registered Cyclists', detail: 'From amateur youth to seasoned masters' },
    { number: '30+ KM', label: 'Barricaded Highway', detail: 'Smooth asphalt corridor via Salem bypass' },
    { number: '100%', label: 'Medical Coverage', detail: 'ACLS cardiac ambulances by Kauvery' },
    { number: '3 Waves', label: 'Staggered Flag-offs', detail: '21.1 KM, 10 KM & 5 KM distinct waves' }
  ];

  const pillars = [
    {
      icon: <Heart className="w-6 h-6 text-amber-700" />,
      tag: 'PILLAR 01',
      title: 'Preventative Cardiology',
      desc: 'Partnered with Kauvery Hospital Salem to champion regular aerobic movement. Cycling activates 70% of major muscle groups while reducing coronary artery disease risks by up to 50%.'
    },
    {
      icon: <Leaf className="w-6 h-6 text-amber-700" />,
      tag: 'PILLAR 02',
      title: 'Green & Zero-Emission Salem',
      desc: 'Advocating for bicycle commuting, cleaner air, and eco-friendly mobility across the historic Mango City of Salem. Every pedal stroke is a stand against vehicular carbon pollution.'
    },
    {
      icon: <Users className="w-6 h-6 text-amber-700" />,
      tag: 'PILLAR 03',
      title: 'Inclusive Community Sports',
      desc: 'Bringing together school teenagers, working corporate professionals, veteran cyclists, and families onto a shared, safe tarmac arena celebrating camaraderie and personal triumph.'
    }
  ];

  const organizers = [
    {
      role: 'Chief Medical Patron',
      name: 'Kauvery Hospital Medical Board',
      desc: 'Overseeing comprehensive on-course emergency triage, rider screening, and physiotherapist recovery stations.',
      badge: 'Healthcare Partner'
    },
    {
      role: 'Race Technical Director',
      name: 'Salem Cycling & Endurance Club',
      desc: 'Managing electronic RFID timing transponders, course marshaling, barricades, and elevation course certification.',
      badge: 'Technical Team'
    },
    {
      role: 'Safety & Highway Logistics',
      name: 'Salem City Traffic Liaison',
      desc: 'Coordinating pilot vehicle escorts, rolling road closures, hydration stations, and continuous sweeper vans.',
      badge: 'Course Safety'
    }
  ];

  const testimonials = [
    {
      quote: "The Salem Cycle Marathon redefined morning fitness for me. The rolling bypass roads and Kauvery Hospital's prompt medical cheer points made the 21.1 KM ride unforgettable.",
      author: "Sundararaman V.",
      category: "21.1 KM Half-Century Rider",
      city: "Salem"
    },
    {
      quote: "As a parent riding with my 14-year-old son in the 5 KM Fun Ride, the safety standards and helmet mandate gave us complete peace of mind. Truly a world-class sporting atmosphere.",
      author: "Priya Chandrasekar",
      category: "5 KM Community Rider",
      city: "Namakkal"
    },
    {
      quote: "The electronic RFID split times and instant finisher medal presentation at Kauvery Hospital grounds was as professional as any major metropolitan marathon.",
      author: "Arunachalam K.",
      category: "10 KM Endurance Rider",
      city: "Coimbatore"
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20' }}>
      
      {/* =========================================================================
          SECTION 1: EDITORIAL HERO HEADER
          ========================================================================= */}
      <section style={{ 
        position: 'relative', 
        padding: '120px 24px 80px', 
        backgroundColor: '#0E1014', 
        color: '#FFFFFF', 
        overflow: 'hidden',
        textAlign: 'center' 
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.32, zIndex: 0 }}>
          <img 
            src="/images/Golden Hour Mountain Climb.png" 
            alt="Salem Marathon Course" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,16,20,0.7) 0%, rgba(14,16,20,0.95) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          <span style={{ 
            display: 'inline-block',
            letterSpacing: '0.22em', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: '#C59A5A', 
            textTransform: 'uppercase',
            marginBottom: 16
          }}>
            Purpose • Heritage • Movement
          </span>

          <h1 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)', 
            fontWeight: 600, 
            lineHeight: 1.15,
            marginBottom: 20
          }}>
            Pedaling for Health, <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#FAF7F2' }}>Riding for Glory</em>
          </h1>

          <p style={{ 
            maxWidth: 680, 
            margin: '0 auto 36px', 
            color: '#B0B4BC', 
            fontSize: '1.1rem', 
            fontWeight: 300, 
            lineHeight: 1.7 
          }}>
            Born out of a shared passion between endurance athletes and the cardiology leadership of <strong>Kauvery Hospital Salem</strong>, the Salem Cycle Marathon is Tamil Nadu’s premier annual cycling celebration.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                backgroundColor: '#C59A5A',
                color: '#0E1014',
                padding: '14px 32px',
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
              <span>Join the 2026 Movement</span>
              <ArrowUpRight size={16} />
            </Link>

            <Link
              to="/event-info"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '14px 28px',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>Explore Race Day Guide</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 4-COLUMN KEY MILESTONE STATS GRID
          ========================================================================= */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '60px 24px 40px', maxWidth: 1240, margin: '0 auto' }}>
        <div className="grid-responsive-1-2-4">
          {stats.map((s, idx) => (
            <div 
              key={idx}
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid rgba(29, 30, 32, 0.08)', 
                borderRadius: 4, 
                padding: '28px 24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', backgroundColor: '#C59A5A' }} />
              <div style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: '2.5rem', 
                fontWeight: 700, 
                color: '#1D1E20',
                lineHeight: 1
              }}>
                {s.number}
              </div>
              <h4 style={{ 
                fontSize: '0.92rem', 
                fontWeight: 700, 
                letterSpacing: '0.04em', 
                color: '#8C6830', 
                marginTop: 8,
                textTransform: 'uppercase'
              }}>
                {s.label}
              </h4>
              <p style={{ color: '#666', fontSize: '0.82rem', marginTop: 4, lineHeight: 1.5 }}>
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ASYMMETRIC STORY & NARRATIVE GRID
          ========================================================================= */}
      <section style={{ padding: '80px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div className="grid-responsive-1-2" style={{ alignItems: 'center' }}>
          {/* Left Column: Visual Photo Frame */}
          <div>
            <div style={{ 
              borderRadius: 6, 
              overflow: 'hidden', 
              boxShadow: '0 20px 48px rgba(0,0,0,0.1)', 
              border: '1px solid rgba(29,30,32,0.08)',
              position: 'relative'
            }}>
              <img 
                src="/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (3).png" 
                alt="Cyclists gathering at sunrise in Salem"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                backgroundColor: 'rgba(14,16,20,0.85)', 
                backdropFilter: 'blur(8px)',
                padding: '16px 20px', 
                color: '#FFF' 
              }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
                  Salem Highway Corridor
                </span>
                <p style={{ fontSize: '0.88rem', color: '#DDD', marginTop: 2 }}>
                  The annual start line transforms Salem into Tamil Nadu's vibrant cycling capital.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Manifesto */}
          <div>
            <span style={{ 
              letterSpacing: '0.22em', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              color: '#8C6830', 
              textTransform: 'uppercase' 
            }}>
              Our Founding Story
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 600, 
              color: '#1D1E20',
              marginTop: 8,
              marginBottom: 18,
              lineHeight: 1.25
            }}>
              Transforming Urban Roads into Arenas of Athletic Health
            </h2>

            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: 16 }}>
              Salem is a city of historic energy, framed by the peaks of the Eastern Ghats and bustling commerce. Yet, modern sedentary lifestyles bring escalating risks of cardiovascular complications and lifestyle ailments.
            </p>

            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: 24 }}>
              The <strong>Salem Cycle Marathon</strong> was initiated to dismantle barriers to fitness. By securing professional road permits, electronic RFID timing technology, and full clinical support from Kauvery Hospital Salem, we give everyday citizens and seasoned athletes alike an inspiring stage to test their endurance.
            </p>

            <div className="form-row-responsive" style={{ marginBottom: 28 }}>
              <div style={{ backgroundColor: '#F3EFE8', padding: '16px 20px', borderRadius: 4, borderLeft: '3px solid #C59A5A' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1D1E20', display: 'block' }}>Zero Emission</span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Promoting carbon-neutral green commuting</span>
              </div>
              <div style={{ backgroundColor: '#F3EFE8', padding: '16px 20px', borderRadius: 4, borderLeft: '3px solid #1B6A50' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1D1E20', display: 'block' }}>Heart Health</span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Preventative cardiology in motion</span>
              </div>
            </div>

            <Link 
              to="/event-info" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                backgroundColor: '#1D1E20', 
                color: '#FAF7F2', 
                padding: '13px 26px', 
                borderRadius: 2, 
                fontWeight: 600, 
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>View Route Elevation</span>
              <ChevronRight size={14} className="text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 3-COLUMN PILLARS & VALUES GRID
          ========================================================================= */}
      <section style={{ backgroundColor: '#F4EFE6', padding: '90px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
            <span style={{ 
              letterSpacing: '0.22em', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              color: '#8C6830', 
              textTransform: 'uppercase' 
            }}>
              Core Commitments
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 600, 
              color: '#1D1E20', 
              marginTop: 8 
            }}>
              The Three Pillars of Our Ride
            </h2>
            <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
          </div>

          <div className="grid-responsive-1-2-3">
            {pillars.map((p, idx) => (
              <div 
                key={idx}
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: 4, 
                  padding: '36px 30px', 
                  border: '1px solid rgba(29,30,32,0.08)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  backgroundColor: '#FAF5EE', 
                  border: '1px solid rgba(197, 154, 90, 0.3)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {p.icon}
                </div>

                <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
                  {p.tag}
                </span>

                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#1D1E20' }}>
                  {p.title}
                </h3>

                <p style={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 3-PHOTO STAGGERED PHOTO GRID (Melanie Hay Aesthetic)
          ========================================================================= */}
      <section style={{ padding: '90px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ 
            letterSpacing: '0.22em', 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase' 
          }}>
            FAVOURITE CORNERS • THE SIGHTS OF THE MARATHON
          </span>
          <h2 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
            fontWeight: 600, 
            marginTop: 8 
          }}>
            Captured Moments Across the Route
          </h2>
          <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
        </div>

        <div className="grid-responsive-1-2-3" style={{ alignItems: 'center' }}>
          {/* Frame 1 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 4, 
            overflow: 'hidden', 
            border: '1px solid rgba(29,30,32,0.08)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)' 
          }}>
            <div style={{ height: 'clamp(240px, 32vw, 360px)', overflow: 'hidden' }}>
              <img 
                src="/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw.png" 
                alt="Lead peloton on highway" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '20px 24px' }}>
              <span style={{ fontSize: '0.7rem', color: '#8C6830', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                High-Speed Pacelines
              </span>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, marginTop: 4 }}>
                Synchronized Aerodynamics
              </h4>
            </div>
          </div>

          {/* Frame 2 - Center */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 4, 
              overflow: 'hidden', 
              border: '2px solid #C59A5A',
              boxShadow: '0 16px 40px rgba(197, 154, 90, 0.15)'
            }}
          >
            <div style={{ height: 'clamp(260px, 36vw, 420px)', overflow: 'hidden' }}>
              <img 
                src="/images/Golden Hour Mountain Climb.png" 
                alt="Mountain climb during sunrise" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '24px 28px' }}>
              <span style={{ fontSize: '0.7rem', color: '#8C6830', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                Summit Ascent
              </span>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 600, marginTop: 4 }}>
                Sunrise Over Salem Bypass
              </h4>
            </div>
          </div>

          {/* Frame 3 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 4, 
            overflow: 'hidden', 
            border: '1px solid rgba(29,30,32,0.08)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)' 
          }}>
            <div style={{ height: 'clamp(240px, 32vw, 360px)', overflow: 'hidden' }}>
              <img 
                src="/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (1).png" 
                alt="Finisher celebration" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '20px 24px' }}>
              <span style={{ fontSize: '0.7rem', color: '#8C6830', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                Finish Line Arena
              </span>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, marginTop: 4 }}>
                Medals & Personal Bests
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HEALTHCARE ALLIANCE — KAUVERY HOSPITAL SALEM
          ========================================================================= */}
      <section style={{ backgroundColor: '#0E1014', color: '#FFFFFF', padding: '90px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          
          <div className="grid-responsive-1-2" style={{ alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
                Institutional Healthcare Partner
              </span>
              <h2 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', 
                fontWeight: 600, 
                marginTop: 8, 
                marginBottom: 20,
                lineHeight: 1.2
              }}>
                Kauvery Hospital Salem
              </h2>
              
              <p style={{ color: '#A0A4AE', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24 }}>
                Medical safety is not an afterthought — it is the bedrock of our event. Kauvery Hospital Salem brings tertiary-level cardiac care, emergency response ambulances, and seasoned sports physiotherapists to ensure every rider is sheltered under world-class clinical oversight.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  'Advanced Cardiac Life Support (ACLS) ambulances piloting and trailing riders',
                  'Emergency trauma physicians and paramedics stationed every 5 KM',
                  'Post-race sports physiotherapy recovery tent at the flag-off grounds',
                  'Pre-race vitals check and complimentary BP / ECG screening booth'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#E0E2E8' }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
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
                  <span>Locate Hospital Venue</span>
                  <ArrowUpRight size={14} />
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
                  <span>Expo Timings & Passes</span>
                </Link>
              </div>
            </div>

            <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
              <img 
                src="/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (2).png" 
                alt="Kauvery Hospital medical staging area"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: 3-COLUMN ORGANIZING COMMITTEE & PATRONS GRID
          ========================================================================= */}
      <section style={{ padding: '90px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{ 
            letterSpacing: '0.22em', 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase' 
          }}>
            Leadership & Governance
          </span>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
            fontWeight: 600, 
            marginTop: 8 
          }}>
            Organizing Council & Operations
          </h2>
          <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
        </div>

        <div className="grid-responsive-1-2-3">
          {organizers.map((org, i) => (
            <div 
              key={i}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: 4, 
                padding: '32px 28px', 
                border: '1px solid rgba(29,30,32,0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '4px 10px', 
                borderRadius: 20, 
                backgroundColor: '#FAF5EE', 
                color: '#8C6830', 
                fontWeight: 700, 
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                {org.badge}
              </span>

              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, color: '#1D1E20', marginTop: 14, marginBottom: 4 }}>
                {org.name}
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#C59A5A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {org.role}
              </span>

              <p style={{ color: '#666', fontSize: '0.88rem', marginTop: 10, lineHeight: 1.6 }}>
                {org.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: 3-COLUMN COMMUNITY VOICES & TESTIMONIALS GRID
          ========================================================================= */}
      <section style={{ backgroundColor: '#F3EFE8', padding: '90px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{ 
              letterSpacing: '0.22em', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              color: '#8C6830', 
              textTransform: 'uppercase' 
            }}>
              Community Testimonials
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 600, 
              marginTop: 8 
            }}>
              Voices from the Saddle
            </h2>
            <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
          </div>

          <div className="grid-responsive-1-2-3">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: 4, 
                  padding: '36px 30px', 
                  border: '1px solid rgba(29,30,32,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <p style={{ 
                  fontFamily: "'Cormorant Garamond', Georgia, serif", 
                  fontSize: '1.2rem', 
                  fontStyle: 'italic', 
                  color: '#333', 
                  lineHeight: 1.6,
                  marginBottom: 20
                }}>
                  "{t.quote}"
                </p>

                <div style={{ borderTop: '1px solid rgba(29,30,32,0.06)', paddingTop: 14 }}>
                  <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1D1E20' }}>
                    {t.author}
                  </h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888', marginTop: 2 }}>
                    <span>{t.category}</span>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 9: FINAL CALL TO ACTION BANNER
          ========================================================================= */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0E1014', color: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
            30 October 2026 Flag-off
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 600, marginTop: 8, marginBottom: 12 }}>
            Become Part of the Salem Cycling Legacy
          </h2>
          <p style={{ color: '#A0A4AE', fontSize: '0.95rem', marginBottom: 28 }}>
            Registrations close on 25 October 2026 at 11:00 PM IST. Choose 21.1 KM, 10 KM, or 5 KM and claim your official timing chip and kit.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#C59A5A',
              color: '#0E1014',
              padding: '16px 36px',
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(197, 154, 90, 0.3)'
            }}
          >
            <span>Register for Salem Marathon</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
