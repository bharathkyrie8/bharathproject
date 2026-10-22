import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  ShieldCheck, 
  Compass, 
  Navigation, 
  Coffee, 
  HeartPulse, 
  ChevronRight,
  ExternalLink,
  Bike
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EventInfo = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const flagOffSchedule = [
    {
      time: '04:30 AM',
      title: 'Reporting & Cycle Inspection',
      desc: 'Participants arrive at Kauvery Hospital Salem holding area. Helmet check and bib chip scanning.',
      category: 'All Categories',
      badge: 'Mandatory'
    },
    {
      time: '05:00 AM',
      title: 'Warm-up & Elite Briefing',
      desc: 'Professional physiotherapist-led dynamic stretches and route safety briefing by marshals.',
      category: 'All Categories',
      badge: 'Briefing'
    },
    {
      time: '05:30 AM',
      title: '21.1 KM Half-Century Flag-Off',
      desc: 'Official horn blown by Kauvery Hospital Chief Medical Officer and Salem dignitaries.',
      category: '21.1 KM (Timed)',
      badge: 'Flag-Off'
    },
    {
      time: '06:00 AM',
      title: '10 KM Endurance Ride Flag-Off',
      desc: 'Second wave flag-off towards the scenic Salem ring route.',
      category: '10 KM (Timed)',
      badge: 'Flag-Off'
    },
    {
      time: '06:30 AM',
      title: '5 KM Community & Family Fun Ride',
      desc: 'Joyful community wave welcoming riders, teenagers, and families.',
      category: '5 KM (Open)',
      badge: 'Flag-Off'
    },
    {
      time: '08:30 AM',
      title: 'Podium & Awards Ceremony',
      desc: 'Trophy presentation for top 3 male and female riders in 21.1 KM & 10 KM at the Kauvery grounds.',
      category: 'All Riders',
      badge: 'Ceremony'
    },
    {
      time: '09:00 AM',
      title: 'Post-Race Celebration & Buffet',
      desc: 'Hot healthy South Indian breakfast, cold pressed juices, and finisher certificate photo wall.',
      category: 'Hospitality',
      badge: 'Included'
    }
  ];

  const expoHighlights = [
    {
      icon: <Calendar className="w-5 h-5 text-amber-600" />,
      title: 'Expo Dates',
      value: '28 & 29 October 2026',
      sub: '10:00 AM to 06:00 PM IST'
    },
    {
      icon: <MapPin className="w-5 h-5 text-amber-600" />,
      title: 'Venue',
      value: 'Kauvery Hospital Salem',
      sub: '#9/50, Trichy Main Road, Seelanaickenpatti'
    },
    {
      icon: <Award className="w-5 h-5 text-amber-600" />,
      title: 'Kit Distribution',
      value: 'Premium Marathon T-Shirt',
      sub: 'RFID Timing Bib, Cycle Sticker & Goodie Bag'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      title: 'Identity Verification',
      value: 'Govt Photo ID + Pass',
      sub: 'Bring digital or printed confirmation voucher'
    }
  ];

  const guidelines = [
    {
      title: 'Helmet is Strictly Compulsory',
      desc: 'No helmet, no ride. Every participant must wear a certified bicycling helmet fastened at all times during the race.'
    },
    {
      title: 'Cycle Check & Readiness',
      desc: 'Check brake pads, tire pressure, and chain lubrication before arrival. Complimentary mechanics will be stationed at the start zone for quick adjustments.'
    },
    {
      title: 'Timing Chip Placement',
      desc: 'For 21.1 KM & 10 KM timed riders, your RFID timing chip must be affixed firmly to the bicycle seat post or front fork as instructed on the bib.'
    },
    {
      title: 'Hydration & Medical Support',
      desc: 'Water, electrolyte drinks (Enerzal), bananas, and medical first-aid ambulances with Kauvery Hospital doctors are deployed every 2.5 kilometers along the loop.'
    },
    {
      title: 'Pacing & Etiquette',
      desc: 'Ride on the designated left lane. Give voice warnings before overtaking ("On your right!"). Headphones/earphones are prohibited for track awareness.'
    },
    {
      title: 'Baggage Drop & Parking',
      desc: 'Secure baggage counter and dedicated car/cycle parking available inside the Kauvery Hospital premises.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20' }}>
      
      {/* Editorial Hero Header */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px 80px', backgroundColor: '#0E1014', color: '#FFFFFF' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35, zIndex: 0 }}>
          <img 
            src="/images/Golden Hour Mountain Climb.png" 
            alt="Salem Marathon Course" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,16,20,0.85) 0%, rgba(14,16,20,0.95) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ 
              display: 'inline-block',
              letterSpacing: '0.22em', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#C59A5A', 
              textTransform: 'uppercase',
              marginBottom: 16
            }}>
              Official Race Guide & Briefing
            </span>
            <h1 style={{ 
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', 
              fontWeight: 600, 
              lineHeight: 1.15,
              marginBottom: 24
            }}>
              The Course, Expo & Race Day
            </h1>
            <p style={{ 
              maxWidth: 680, 
              margin: '0 auto 36px', 
              color: '#B0B4BC', 
              fontSize: '1.1rem', 
              fontWeight: 300,
              lineHeight: 1.7 
            }}>
              Everything you need to know about bib collection, flag-off schedules, route hydration, and race morning logistics at Kauvery Hospital Salem.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a 
                href="#schedule" 
                style={{ 
                  backgroundColor: '#C59A5A', 
                  color: '#0E1014', 
                  padding: '14px 28px', 
                  borderRadius: 2, 
                  fontWeight: 600, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Race Day Timeline
              </a>
              <a 
                href="#route" 
                style={{ 
                  border: '1px solid rgba(255,255,255,0.25)', 
                  color: '#FFFFFF', 
                  padding: '14px 28px', 
                  borderRadius: 2, 
                  fontWeight: 500, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                Route & Maps
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expo Section — Luxury Linen Layout */}
      <section style={{ padding: '90px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ 
            letterSpacing: '0.22em', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase' 
          }}>
            Bib Collection & Kit Distribution
          </span>
          <h2 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
            fontWeight: 600, 
            color: '#1D1E20',
            marginTop: 8
          }}>
            Pre-Race Marathon Expo
          </h2>
          <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 24, 
          marginBottom: 64 
        }}>
          {expoHighlights.map((item, idx) => (
            <div 
              key={idx}
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid rgba(29, 30, 32, 0.08)', 
                padding: '32px 24px', 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                backgroundColor: '#FAF5EE', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
                {item.title}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#1D1E20' }}>
                {item.value}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 4 }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Expo Important Callout */}
        <div style={{ 
          backgroundColor: '#F3EFE8', 
          borderLeft: '4px solid #C59A5A', 
          padding: '24px 32px', 
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <h4 style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1D1E20', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            Important Expo Note
          </h4>
          <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6 }}>
            There will be <strong>NO Bib collection on Race Day morning (30 October)</strong> to ensure seamless safety and timely flag-offs. 
            All riders must collect their kit at Kauvery Hospital Expo on 28th or 29th October. If you cannot attend in person, an authorized representative may collect on your behalf with a signed authority letter and your registration ID pass.
          </p>
        </div>
      </section>

      {/* Race Day Flag-Off Schedule */}
      <section id="schedule" style={{ backgroundColor: '#F4EFE6', padding: '90px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ 
              letterSpacing: '0.22em', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#8C6830', 
              textTransform: 'uppercase' 
            }}>
              30 October 2026 Timeline
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 600, 
              color: '#1D1E20',
              marginTop: 8
            }}>
              Flag-Off & Race Day Schedule
            </h2>
            <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
          </div>

          <div style={{ position: 'relative' }}>
            {/* Timeline Vertical Line */}
            <div style={{ 
              position: 'absolute', 
              left: 28, 
              top: 20, 
              bottom: 20, 
              width: 2, 
              backgroundColor: 'rgba(197, 154, 90, 0.4)',
              display: 'block'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {flagOffSchedule.map((slot, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 24, position: 'relative' }}>
                  {/* Timeline Badge */}
                  <div style={{ 
                    width: 58, 
                    height: 58, 
                    borderRadius: '50%', 
                    backgroundColor: '#FFFFFF', 
                    border: '2px solid #C59A5A', 
                    boxShadow: '0 4px 12px rgba(197, 154, 90, 0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                    color: '#8C6830',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    <Clock className="w-5 h-5" />
                  </div>

                  {/* Timeline Card */}
                  <div style={{ 
                    flex: 1, 
                    backgroundColor: '#FFFFFF', 
                    padding: '24px 28px', 
                    borderRadius: 4, 
                    border: '1px solid rgba(29, 30, 32, 0.08)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <span style={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif", 
                        fontWeight: 700, 
                        color: '#C59A5A', 
                        fontSize: '1rem',
                        letterSpacing: '0.05em' 
                      }}>
                        {slot.time}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        letterSpacing: '0.12em', 
                        textTransform: 'uppercase', 
                        padding: '4px 10px', 
                        borderRadius: 20, 
                        backgroundColor: '#FAF5EE', 
                        color: '#8C6830', 
                        fontWeight: 600,
                        border: '1px solid rgba(197, 154, 90, 0.3)'
                      }}>
                        {slot.badge}
                      </span>
                    </div>

                    <h3 style={{ 
                      fontFamily: "'Playfair Display', serif", 
                      fontSize: '1.3rem', 
                      fontWeight: 600, 
                      color: '#1D1E20', 
                      marginBottom: 6 
                    }}>
                      {slot.title}
                    </h3>

                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 10 }}>
                      {slot.desc}
                    </p>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>
                      <Bike className="w-4 h-4 text-amber-600" />
                      <span>Applicable for: {slot.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Route & Map Section */}
      <section id="route" style={{ padding: '90px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ 
            letterSpacing: '0.22em', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase' 
          }}>
            Elevation & Scenic Course
          </span>
          <h2 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
            fontWeight: 600, 
            color: '#1D1E20',
            marginTop: 8
          }}>
            Salem Marathon Route Experience
          </h2>
          <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
        </div>

        <div className="grid-responsive-1-2" style={{ alignItems: 'center' }}>
          <div>
            <div style={{ 
              borderRadius: 6, 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
              border: '1px solid rgba(0,0,0,0.08)',
              position: 'relative'
            }}>
              <img 
                src="/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (2).png" 
                alt="Marathon Route Map Visual" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                padding: '16px 20px', 
                backgroundColor: 'rgba(14, 16, 20, 0.85)', 
                backdropFilter: 'blur(8px)',
                color: '#FFF'
              }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C59A5A' }}>
                  Scenic Elevation Profile
                </span>
                <p style={{ fontSize: '0.9rem', color: '#DDD', marginTop: 4 }}>
                  Fast tarmac, scenic green corridors, mild rolling gradient, and 100% barricaded pilot vehicle escort.
                </p>
              </div>
            </div>
          </div>

          <div>
            <span style={{ 
              letterSpacing: '0.2em', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#8C6830', 
              textTransform: 'uppercase' 
            }}>
              Course Highlights
            </span>
            <h3 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '2rem', 
              fontWeight: 600, 
              color: '#1D1E20',
              marginTop: 8,
              marginBottom: 16
            }}>
              Engineered for Speed, Beauty & Absolute Safety
            </h3>

            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24 }}>
              The Salem Cycle Marathon begins at the premier healthcare facility of <strong>Kauvery Hospital Salem</strong>, passing through Seelanaickenpatti, entering the bypass green belt, and looping back along the scenic hills of the Eastern Ghats backdrop.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16, padding: 0, marginBottom: 32 }}>
              {[
                { title: '21.1 KM Half-Century Route', detail: 'Includes the scenic southern bypass loop with gradual +110m elevation gain and fast flats.' },
                { title: '10 KM Endurance Route', detail: 'Wide 4-lane tarmac with dedicated cycling corridors and 4 hydration stations.' },
                { title: '5 KM Community Fun Route', detail: 'Completely flat and secure inner ring course, perfect for amateur riders and youngsters.' }
              ].map((route, i) => (
                <li key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C59A5A', marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontWeight: 600, color: '#1D1E20', fontSize: '0.95rem' }}>{route.title}</h5>
                    <p style={{ color: '#666', fontSize: '0.85rem', marginTop: 2 }}>{route.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link 
              to="/register" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                backgroundColor: '#1D1E20', 
                color: '#FAF7F2', 
                padding: '14px 28px', 
                borderRadius: 2, 
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <span>Choose Your Category</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kauvery Hospital Salem Google Map Venue Section */}
      <section style={{ backgroundColor: '#0E1014', color: '#FFFFFF', padding: '90px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ 
              letterSpacing: '0.22em', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#C59A5A', 
              textTransform: 'uppercase' 
            }}>
              Flag-Off & Expo Ground
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 600, 
              marginTop: 8
            }}>
              Kauvery Hospital Salem
            </h2>
            <p style={{ color: '#A0A4AE', maxWidth: 640, margin: '12px auto 0', fontSize: '1rem' }}>
              #9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti, Salem, Tamil Nadu 636201
            </p>
            <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
          </div>

          <div style={{ 
            borderRadius: 8, 
            overflow: 'hidden', 
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)', 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <iframe 
              title="Kauvery Hospital Salem Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.067425126135!2d78.14729127588382!3d11.618529243075253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babefdbffcfbb9f%3A0xe54d6d62886c5ea3!2sKauvery%20Hospital%20Salem!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
              width="100%" 
              height="450" 
              style={{ border: 0, display: 'block' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>Direct Google Maps Navigation:</span>
              <p style={{ color: '#FFF', fontWeight: 600, fontSize: '1rem', marginTop: 2 }}>
                Search "Kauvery Hospital Salem" on Google Maps or Apple Maps.
              </p>
            </div>
            
            <a 
              href="https://maps.app.goo.gl/TSxqXnA53sUKqdsv9" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                backgroundColor: '#C59A5A', 
                color: '#0E1014', 
                padding: '12px 24px', 
                borderRadius: 2, 
                fontWeight: 600, 
                fontSize: '0.85rem',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Safety & Participant Rules Grid */}
      <section style={{ padding: '90px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ 
            letterSpacing: '0.22em', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase' 
          }}>
            Code of Conduct & Safety
          </span>
          <h2 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
            fontWeight: 600, 
            color: '#1D1E20',
            marginTop: 8
          }}>
            Participant Regulations
          </h2>
          <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
        </div>

        <div className="grid-responsive-1-2-3">
          {guidelines.map((g, idx) => (
            <div 
              key={idx}
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid rgba(29, 30, 32, 0.08)', 
                padding: '28px', 
                borderRadius: 4,
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  backgroundColor: '#FAF5EE', 
                  color: '#C59A5A', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '0.85rem' 
                }}>
                  {idx + 1}
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#1D1E20' }}>
                  {g.title}
                </h4>
              </div>
              <p style={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.65 }}>
                {g.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div style={{ 
          marginTop: 64, 
          textAlign: 'center', 
          padding: '48px 24px', 
          backgroundColor: '#F3EFE8', 
          borderRadius: 4,
          border: '1px solid rgba(197, 154, 90, 0.3)'
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#1D1E20', marginBottom: 12 }}>
            Ready to Take Your Position at the Start Line?
          </h3>
          <p style={{ color: '#666', maxWidth: 540, margin: '0 auto 28px', fontSize: '0.95rem' }}>
            Registrations close on 25 October 2026 at 11:00 PM IST. Secure your slot and official race kit now.
          </p>
          <Link 
            to="/register" 
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#C59A5A', 
              color: '#0E1014', 
              padding: '16px 36px', 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              fontSize: '0.85rem', 
              borderRadius: 2, 
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(197, 154, 90, 0.3)'
            }}
          >
            Register for Salem Marathon 2026
          </Link>
        </div>
      </section>

    </div>
  );
};

export default EventInfo;
