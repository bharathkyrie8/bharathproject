import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  ZoomIn, 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  Sparkles, 
  MapPin, 
  LayoutGrid, 
  Columns, 
  Eye, 
  Compass,
  Award,
  Calendar
} from 'lucide-react';
import { getGallery } from '../services/api';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [gridStyle, setGridStyle] = useState('bento'); // 'bento' or 'museum'
  const [activePhoto, setActivePhoto] = useState(null);
  const [apiPhotos, setApiPhotos] = useState([]);

  // Curated collection featuring the newly generated ultra-res imagery + authentic user event photos
  const curatedPhotos = [
    {
      id: 'photo-new-1',
      index: '01',
      title: 'High-Speed Peloton at Sunrise',
      category: 'PELOTON',
      tag: 'LEAD PACELINE • 21.1 KM SPLIT',
      bentoSpan: 'span-2-wide',
      aspect: 'wide',
      url: '/images/peloton_dawn_new.jpg',
      caption: 'Dawn breaks over the rolling Salem eastern highway as the 21.1 KM lead peloton initiates high-speed paceline synchronization.',
      location: 'Salem Bypass Corridor',
      shutter: '1/1200s • f/2.8 • ISO 100',
      elevation: '+110m Rolling Hills'
    },
    {
      id: 'photo-new-2',
      index: '02',
      title: 'Solo Summit Ascent & Determination',
      category: 'ROUTE',
      tag: 'ELEVATION CLIMB • SHEVAROY FOOTHILLS',
      bentoSpan: 'span-tall',
      aspect: 'tall',
      url: '/images/cyclist_ascent_new.jpg',
      caption: 'Pushing through the gradient incline near Seelanaickenpatti hills with sunrise glow reflecting on the smooth asphalt.',
      location: 'Eastern Ghats Highway Loop',
      shutter: '1/800s • f/1.8 • ISO 80',
      elevation: '+185m Peak'
    },
    {
      id: 'photo-new-3',
      index: '03',
      title: 'Victory Finish Arch & Confetti Celebration',
      category: 'FINISH',
      tag: 'CHAMPIONS PODIUM • FINISH LINE',
      bentoSpan: 'span-2-wide',
      aspect: 'wide',
      url: '/images/finish_line_triumph_new.jpg',
      caption: 'Cyclists crossing the grand finish arch at Kauvery Hospital Salem with arms raised in triumph and gold confetti raining down.',
      location: 'Kauvery Hospital Salem Arena',
      shutter: '1/2000s • f/3.2 • ISO 200',
      elevation: 'Finish Line Plaza'
    },
    {
      id: 'photo-new-4',
      index: '04',
      title: 'Pre-Race Kit Expo & Cycle Inspection',
      category: 'EXPO',
      tag: 'EXPO VILLAGE • REGISTRATION',
      bentoSpan: 'span-normal',
      aspect: 'square',
      url: '/images/expo_village_new.jpg',
      caption: 'Participants collecting customized moisture-wicking jerseys and RFID timing bibs during the 2-day Expo.',
      location: 'Kauvery Hospital Grounds',
      shutter: '1/500s • f/2.4 • ISO 160',
      elevation: 'Hospital Courtyard'
    },
    {
      id: 'photo-user-1',
      index: '05',
      title: 'Golden Hour Mountain Highway Climb',
      category: 'ROUTE',
      tag: 'SCENIC HORIZON • SUNRISE MIST',
      bentoSpan: 'span-normal',
      aspect: 'wide',
      url: '/images/Golden Hour Mountain Climb.png',
      caption: 'Morning mist and mountain silhouettes setting the scene for an iconic endurance journey.',
      location: 'Salem Southern Ring Corridor',
      shutter: '1/1000s • f/4.0 • ISO 100',
      elevation: 'Southern Bypass'
    },
    {
      id: 'photo-user-2',
      index: '06',
      title: 'Aerodynamic Pack in Motion',
      category: 'PELOTON',
      tag: 'PELOTON DRAFTING • SYNCHRONY',
      bentoSpan: 'span-normal',
      aspect: 'square',
      url: '/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw.png',
      caption: 'Cohesive formation of riders cutting through headwind in the 10 KM and 21.1 KM categories.',
      location: 'Seelanaickenpatti Highway',
      shutter: '1/1600s • f/2.8 • ISO 120',
      elevation: '4-Lane Corridor'
    },
    {
      id: 'photo-user-3',
      index: '07',
      title: 'Finisher Medals & Personal Bests',
      category: 'FINISH',
      tag: 'AWARDS CEREMONY • TRIUMPH',
      bentoSpan: 'span-normal',
      aspect: 'square',
      url: '/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (1).png',
      caption: 'Riders celebrating their race times and receiving handcrafted metallic medals.',
      location: 'Kauvery Victory Plaza',
      shutter: '1/640s • f/2.0 • ISO 100',
      elevation: 'Podium Stage'
    },
    {
      id: 'photo-user-4',
      index: '08',
      title: 'Scenic Elevation Profile & Horizon',
      category: 'ROUTE',
      tag: 'COURSE LANDSCAPE • GREEN BELT',
      bentoSpan: 'span-2-wide',
      aspect: 'wide',
      url: '/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (2).png',
      caption: 'Green lush tree canopy flanking the sanctioned closed-highway cycling track.',
      location: 'Salem Bypass Outer Ring',
      shutter: '1/1200s • f/3.5 • ISO 100',
      elevation: 'Elevation Crest'
    },
    {
      id: 'photo-user-5',
      index: '09',
      title: 'Community Spirit & Expo Registration',
      category: 'EXPO',
      tag: 'COMMUNITY BRIEFING • ALL AGES',
      bentoSpan: 'span-normal',
      aspect: 'tall',
      url: '/images/Gemini_Generated_Image_rzxwqzrzxwqzrzxw (3).png',
      caption: 'Cyclists and families gathering at the registration briefing hall before race morning.',
      location: 'Kauvery Hospital Convention Desk',
      shutter: '1/400s • f/2.8 • ISO 200',
      elevation: 'Auditorium Hall'
    }
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        if (data && data.length > 0) {
          setApiPhotos(data);
        }
      } catch (err) {
        console.log('Displaying curated gallery collection');
      }
    };
    fetchGallery();
  }, []);

  // Merge photos
  const allPhotos = [...curatedPhotos, ...apiPhotos.map((p, idx) => ({
    id: p._id,
    index: String(curatedPhotos.length + idx + 1).padStart(2, '0'),
    title: p.title || 'Marathon Moment',
    category: (p.category || 'EVENT').toUpperCase(),
    tag: p.tags ? p.tags.join(' • ') : 'ARCHIVAL CAPTURE',
    bentoSpan: 'span-normal',
    aspect: 'square',
    url: p.imageUrl,
    caption: p.caption || '',
    location: 'Kauvery Hospital Salem',
    shutter: '1/1000s • f/2.8 • ISO 100',
    elevation: 'Salem Route'
  }))];

  const categories = [
    { key: 'ALL', label: 'All Exhibits', count: allPhotos.length },
    { key: 'PELOTON', label: 'The Peloton & Speed', count: allPhotos.filter(p => p.category === 'PELOTON').length },
    { key: 'ROUTE', label: 'Scenic Highway Routes', count: allPhotos.filter(p => p.category === 'ROUTE').length },
    { key: 'FINISH', label: 'Finish Line & Victory', count: allPhotos.filter(p => p.category === 'FINISH').length },
    { key: 'EXPO', label: 'Bib Expo & Kit Village', count: allPhotos.filter(p => p.category === 'EXPO').length }
  ];

  const filteredPhotos = selectedCategory === 'ALL'
    ? allPhotos
    : allPhotos.filter(p => p.category === selectedCategory);

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activePhoto) return;
      if (e.key === 'Escape') setActivePhoto(null);
      if (e.key === 'ArrowRight') {
        const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
        setActivePhoto(filteredPhotos[(currentIndex + 1) % filteredPhotos.length]);
      }
      if (e.key === 'ArrowLeft') {
        const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
        setActivePhoto(filteredPhotos[(currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, filteredPhotos]);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20' }}>
      
      {/* =========================================================================
          EDITORIAL HEADER & GALLERY CURATOR INTRO
          ========================================================================= */}
      <section style={{ padding: '130px 24px 40px', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ 
            display: 'inline-block',
            letterSpacing: '0.24em', 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase',
            marginBottom: 12
          }}>
            Archival Exhibition • Salem Cycle Marathon 2026
          </span>

          <h1 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2.4rem, 5vw, 4.4rem)', 
            fontWeight: 600, 
            lineHeight: 1.15,
            marginBottom: 16
          }}>
            The Visual <em>Chronicle</em>
          </h1>

          <p style={{ 
            fontFamily: "'Cormorant Garamond', Georgia, serif", 
            fontSize: '1.4rem', 
            fontStyle: 'italic',
            color: '#666',
            maxWidth: 680,
            margin: '0 auto 36px',
            lineHeight: 1.55
          }}>
            "A high-definition editorial collection capturing the quiet intensity of sunrise pacelines, scenic gradient climbs, and triumphant finish line celebrations at Kauvery Hospital Salem."
          </p>

          {/* Controls Bar: Categories on Left, Grid Style Switcher on Right */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 16,
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: 40,
            border: '1px solid rgba(29, 30, 32, 0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            maxWidth: 1140,
            margin: '0 auto'
          }}>
            {/* Category Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const active = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      backgroundColor: active ? '#1D1E20' : 'transparent',
                      color: active ? '#FAF7F2' : '#555',
                      border: active ? '1px solid #1D1E20' : '1px solid transparent',
                      padding: '7px 16px',
                      borderRadius: 30,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      opacity: active ? 0.9 : 0.6,
                      fontFamily: 'monospace' 
                    }}>
                      ({cat.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid Style Switcher (Bento vs Museum Archival) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#FAF7F2', padding: 4, borderRadius: 24, border: '1px solid rgba(29,30,32,0.1)' }}>
              <button
                type="button"
                onClick={() => setGridStyle('bento')}
                title="Editorial Bento Mosaic"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: 'none',
                  backgroundColor: gridStyle === 'bento' ? '#1D1E20' : 'transparent',
                  color: gridStyle === 'bento' ? '#FAF7F2' : '#666',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <LayoutGrid size={13} />
                <span>Bento Mosaic</span>
              </button>

              <button
                type="button"
                onClick={() => setGridStyle('museum')}
                title="Museum Archival Frames"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: 'none',
                  backgroundColor: gridStyle === 'museum' ? '#1D1E20' : 'transparent',
                  color: gridStyle === 'museum' ? '#FAF7F2' : '#666',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Columns size={13} />
                <span>Museum Matting</span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          STYLE 1: EDITORIAL BENTO MOSAIC GRID
          ========================================================================= */}
      {gridStyle === 'bento' && (
        <section style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 24px 100px' }}>
          <motion.div 
            layout
            className="gallery-bento-grid"
          >
            {filteredPhotos.map((photo, index) => {
              const isFeatureWide = photo.bentoSpan === 'span-2-wide' && selectedCategory === 'ALL';
              const isFeatureTall = photo.bentoSpan === 'span-tall' && selectedCategory === 'ALL';

              return (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  onClick={() => setActivePhoto(photo)}
                  className={isFeatureWide ? 'bento-feature-wide' : ''}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(29,30,32,0.08)',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C59A5A';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(197, 154, 90, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(29,30,32,0.08)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Photo Visual Box with Editorial Badges */}
                  <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    height: isFeatureTall 
                      ? 'clamp(320px, 45vw, 500px)' 
                      : isFeatureWide 
                      ? 'clamp(250px, 34vw, 380px)' 
                      : 'clamp(220px, 28vw, 300px)',
                    backgroundColor: '#0E1014'
                  }}>
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                    {/* Dark Editorial Gradient Overlay on Image Bottom */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(14,16,20,0.85) 0%, rgba(14,16,20,0.2) 40%, transparent 100%)',
                      pointerEvents: 'none'
                    }} />

                    {/* Top Index & Tag Ribbons */}
                    <div style={{ 
                      position: 'absolute', 
                      top: 16, 
                      left: 16, 
                      right: 16, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      zIndex: 2 
                    }}>
                      <span style={{
                        backgroundColor: 'rgba(14, 16, 20, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#C59A5A',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: 3
                      }}>
                        EXHIBIT {photo.index}
                      </span>

                      <div style={{
                        backgroundColor: 'rgba(14, 16, 20, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FAF7F2',
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ZoomIn size={15} />
                      </div>
                    </div>

                    {/* Bottom Metadata in Image Frame */}
                    <div style={{
                      position: 'absolute',
                      bottom: 14,
                      left: 18,
                      right: 18,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      color: '#FFF',
                      zIndex: 2
                    }}>
                      <div>
                        <span style={{
                          fontSize: '0.68rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: '#C59A5A',
                          fontWeight: 700,
                          display: 'block'
                        }}>
                          {photo.tag}
                        </span>
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: isFeatureWide ? '1.5rem' : '1.25rem',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          marginTop: 2,
                          lineHeight: 1.2
                        }}>
                          {photo.title}
                        </h3>
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        color: '#A0A4AE',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: '3px 8px',
                        borderRadius: 2
                      }}>
                        {photo.shutter}
                      </span>
                    </div>
                  </div>

                  {/* Card Description Footer */}
                  <div style={{ padding: '20px 22px', backgroundColor: '#FFFFFF', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>
                      {photo.caption}
                    </p>

                    <div style={{ 
                      paddingTop: 12, 
                      borderTop: '1px solid rgba(29,30,32,0.06)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontSize: '0.76rem',
                      color: '#8C6830',
                      fontWeight: 600
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={13} />
                        <span>{photo.location}</span>
                      </div>
                      <span style={{ color: '#888', fontFamily: 'monospace' }}>
                        {photo.elevation}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* =========================================================================
          STYLE 2: MUSEUM MATTING FINE-ART EXHIBITION GRID
          ========================================================================= */}
      {gridStyle === 'museum' && (
        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 24px 100px' }}>
          <motion.div 
            layout
            className="grid-responsive-1-2-3"
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                onClick={() => setActivePhoto(photo)}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 16,
                  borderRadius: 3,
                  border: '1px solid rgba(29,30,32,0.1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C59A5A';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(197, 154, 90, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(29,30,32,0.1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.03)';
                }}
              >
                {/* Museum Matting Outer Frame */}
                <div style={{ 
                  backgroundColor: '#FAF7F2', 
                  padding: 12, 
                  border: '1px solid rgba(29,30,32,0.06)',
                  marginBottom: 16
                }}>
                  <div style={{ height: 320, overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 10, 
                      right: 10, 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      padding: '4px 8px', 
                      borderRadius: 2, 
                      fontSize: '0.68rem', 
                      fontWeight: 700, 
                      color: '#1D1E20',
                      letterSpacing: '0.08em' 
                    }}>
                      CLICK TO ENLARGE
                    </div>
                  </div>
                </div>

                {/* Museum Label */}
                <div style={{ padding: '0 6px 8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
                      PLATE {photo.index} • {photo.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'monospace' }}>
                      {photo.shutter}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, color: '#1D1E20', marginBottom: 8 }}>
                    {photo.title}
                  </h3>

                  <p style={{ color: '#666', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 12 }}>
                    {photo.caption}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888', borderTop: '1px solid #F0ECE4', paddingTop: 8 }}>
                    <span>{photo.location}</span>
                    <span style={{ color: '#C59A5A', fontWeight: 600 }}>{photo.elevation}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* =========================================================================
          CINEMATIC MODAL LIGHTBOX
          ========================================================================= */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(10, 12, 16, 0.96)',
              backdropFilter: 'blur(18px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(10px, 2.5vw, 24px)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#FAF7F2',
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10001
              }}
            >
              <X size={20} />
            </button>

            {/* Prev Arrow (Desktop / Tablet) */}
            <button
              onClick={handlePrevPhoto}
              className="hidden md:flex"
              style={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FAF7F2',
                width: 48,
                height: 48,
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10001
              }}
            >
              <ArrowLeft size={20} />
            </button>

            {/* Next Arrow (Desktop / Tablet) */}
            <button
              onClick={handleNextPhoto}
              className="hidden md:flex"
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FAF7F2',
                width: 48,
                height: 48,
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10001
              }}
            >
              <ArrowRight size={20} />
            </button>

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 1100,
                width: '100%',
                maxHeight: '92vh',
                backgroundColor: '#15181F',
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ flex: 1, maxHeight: '72vh', overflow: 'hidden', backgroundColor: '#0A0C10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={activePhoto.url} 
                  alt={activePhoto.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '72vh',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              <div style={{ padding: 'clamp(14px, 3.5vw, 28px)', backgroundColor: '#15181F', color: '#FAF7F2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ color: '#C59A5A', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                    EXHIBIT {activePhoto.index} • {activePhoto.tag}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    {activePhoto.shutter}
                  </span>
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 600, color: '#FFF', marginBottom: 8, lineHeight: 1.25 }}>
                  {activePhoto.title}
                </h2>

                <p style={{ color: '#B0B4BC', fontSize: 'clamp(0.82rem, 1.8vw, 0.92rem)', lineHeight: 1.5, marginBottom: 12 }}>
                  {activePhoto.caption}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} className="text-amber-500 flex-shrink-0" />
                    <span>{activePhoto.location}</span>
                  </span>
                  <span style={{ color: '#C59A5A', fontWeight: 600 }}>
                    Course Elevation: {activePhoto.elevation}
                  </span>
                </div>

                {/* Mobile Thumb Navigation (Shown on mobile devices) */}
                <div className="flex md:hidden items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)]">
                  <button
                    onClick={handlePrevPhoto}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FAF7F2',
                      padding: '8px 14px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Previous</span>
                  </button>

                  <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                    {activePhoto.index} of 07
                  </span>

                  <button
                    onClick={handleNextPhoto}
                    style={{
                      background: 'rgba(197,154,90,0.15)',
                      border: '1px solid rgba(197,154,90,0.4)',
                      color: '#C59A5A',
                      padding: '8px 14px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Next</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
