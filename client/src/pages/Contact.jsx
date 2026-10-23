import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { submitContact } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Registration Query',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: false, error: null, message: '' });
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I pay without a PAN Card using Google Pay or PhonePe?',
      a: 'We offer direct UPI QR scanning! When you register, select "PhonePe / Google Pay QR" on the payment step. Scan our official merchant QR code using any UPI app (GPay, PhonePe, Paytm, BHIM), complete the exact category amount, and enter the 12-digit UPI Reference / UTR Number. Your registration is validated within 2 hours and confirmation pass is emailed directly.'
    },
    {
      q: 'Where and when do I collect my Marathon Bib & Race Kit?',
      a: 'Bib collection takes place exclusively during the Pre-Race Expo on 28 & 29 October 2026 (10:00 AM - 6:00 PM) at Kauvery Hospital Salem, Seelanaickenpatti. Please bring your digital registration confirmation ID or government photo ID. Note: No bibs will be issued on race morning (30 October).'
    },
    {
      q: 'Can a friend or family member collect my Bib on my behalf?',
      a: 'Yes. Your representative must present a digital or printed copy of your Registration ID Confirmation Pass along with a photocopy of your photo ID (Aadhaar / Driving License / Passport).'
    },
    {
      q: 'Is wearing a helmet mandatory for all categories?',
      a: 'Yes! Strict safety protocol applies across all distances: 21.1 KM, 10 KM, and 5 KM. Riders without a securely strapped cycling helmet will not be permitted into the flag-off enclosure.'
    },
    {
      q: 'What is the refund and cancellation policy?',
      a: 'Registrations are strictly non-refundable and non-transferrable due to prior allocation of personalized RFID chips, customized bibs, and event merchandise. However, if the event is rescheduled due to unforeseen governmental regulations, your registration will be automatically rolled over.'
    },
    {
      q: 'Can minors register for the marathon?',
      a: 'Yes. 10 KM permits riders aged 16 and above. 5 KM permits youth aged 12 and above. For any participant under 18 years on race day, the registration form requires digital parental/guardian consent and emergency guardian contact details.'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: false, error: null, message: '' });

    try {
      const res = await submitContact(formData);
      setStatus({ 
        success: true, 
        error: null, 
        message: res.message || 'Thank you! Your message has been received. Our coordination team will get back to you shortly.' 
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Registration Query',
        message: ''
      });
    } catch (err) {
      setStatus({ 
        success: false, 
        error: err.customMessage || 'Failed to submit your message. Please try again or email us directly.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20' }}>
      
      {/* Editorial Header */}
      <section style={{ padding: '120px 24px 60px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
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
            color: '#8C6830', 
            textTransform: 'uppercase',
            marginBottom: 14
          }}>
            Assistance & Organizing Desk
          </span>

          <h1 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', 
            fontWeight: 600, 
            lineHeight: 1.15,
            marginBottom: 20
          }}>
            Get in Touch With Us
          </h1>

          <p style={{ 
            maxWidth: 620, 
            margin: '0 auto', 
            color: '#666', 
            fontSize: '1.05rem', 
            lineHeight: 1.7 
          }}>
            Have questions regarding registration, payment verification, corporate bulk entries, or race morning logistics? We are here to support your marathon journey.
          </p>
        </motion.div>
      </section>

      {/* Main Content Layout: Form & Organizer Card */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 90px' }}>
        <div className="contact-split-grid">
          
          {/* Contact Form Card */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 4, 
            padding: '40px 36px', 
            border: '1px solid rgba(29, 30, 32, 0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 600, color: '#1D1E20', marginBottom: 8 }}>
              Send an Official Inquiry
            </h3>
            <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: 28 }}>
              Fill in your details and our team will respond to your email within 12 hours.
            </p>

            {status.success && (
              <div style={{ 
                backgroundColor: '#EDF7ED', 
                color: '#1E4620', 
                padding: '16px', 
                borderRadius: 4, 
                marginBottom: 24,
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                fontSize: '0.9rem'
              }}>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {status.error && (
              <div style={{ 
                backgroundColor: '#FDECEA', 
                color: '#611A15', 
                padding: '16px', 
                borderRadius: 4, 
                marginBottom: 24,
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                fontSize: '0.9rem'
              }}>
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                  Full Name *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="e.g. Bharath Sundaram"
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    borderRadius: 3, 
                    border: '1px solid rgba(29, 30, 32, 0.15)',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-row-responsive">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      borderRadius: 3, 
                      border: '1px solid rgba(29, 30, 32, 0.15)',
                      backgroundColor: '#FAF7F2',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      borderRadius: 3, 
                      border: '1px solid rgba(29, 30, 32, 0.15)',
                      backgroundColor: '#FAF7F2',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                  Inquiry Topic
                </label>
                <select 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    borderRadius: 3, 
                    border: '1px solid rgba(29, 30, 32, 0.15)',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                >
                  <option value="Registration Query">Registration & Eligibility Query</option>
                  <option value="UPI Payment Verification">UPI / QR Payment Verification</option>
                  <option value="Bib Collection">Bib Expo & T-Shirt Collection</option>
                  <option value="Corporate / Group Booking">Corporate / Club Group Registration</option>
                  <option value="Sponsorship & Medical Partner">Sponsorship & Partnership</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                  Your Message *
                </label>
                <textarea 
                  name="message" 
                  required 
                  minLength={2}
                  rows={5}
                  value={formData.message} 
                  onChange={handleChange}
                  placeholder="How can we assist you with your marathon entry or event query?"
                  style={{ 
                    width: '100%', 
                    padding: '12px 14px', 
                    borderRadius: 3, 
                    border: '1px solid rgba(29, 30, 32, 0.15)',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#1D1E20',
                  color: '#FAF7F2',
                  padding: '14px 28px',
                  borderRadius: 2,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'background 0.3s ease'
                }}
              >
                {loading ? 'Sending Message...' : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4 text-amber-400" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Organizer Details & Venue Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            <div style={{ 
              backgroundColor: '#0E1014', 
              color: '#FFFFFF', 
              borderRadius: 4, 
              padding: '36px 32px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
                Venue & Medical Partner
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, marginTop: 6, marginBottom: 20 }}>
                Kauvery Hospital Salem
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h5 style={{ fontWeight: 600, color: '#FFF', fontSize: '0.95rem' }}>Hospital Campus & Expo Ground</h5>
                    <p style={{ color: '#A0A4AE', fontSize: '0.9rem', marginTop: 2, lineHeight: 1.5 }}>
                      #9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti, Salem, Tamil Nadu 636201
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <Mail className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h5 style={{ fontWeight: 600, color: '#FFF', fontSize: '0.95rem' }}>Official Contact Email</h5>
                    <p style={{ color: '#A0A4AE', fontSize: '0.9rem', marginTop: 2 }}>
                      <a href="mailto:bharathkyrie8@gmail.com" style={{ color: '#C59A5A', textDecoration: 'none' }}>
                        bharathkyrie8@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <Phone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h5 style={{ fontWeight: 600, color: '#FFF', fontSize: '0.95rem' }}>Helpline & WhatsApp Support</h5>
                    <p style={{ color: '#A0A4AE', fontSize: '0.9rem', marginTop: 2 }}>
                      +91 94422 10820 / +91 427 232 4000
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h5 style={{ fontWeight: 600, color: '#FFF', fontSize: '0.95rem' }}>Desk Timings</h5>
                    <p style={{ color: '#A0A4AE', fontSize: '0.9rem', marginTop: 2 }}>
                      Monday – Saturday: 09:00 AM to 06:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <a 
                  href="https://maps.app.goo.gl/TSxqXnA53sUKqdsv9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    color: '#C59A5A', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>Open Venue in Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Assistance Badge */}
            <div style={{ 
              backgroundColor: '#F3EFE8', 
              borderRadius: 4, 
              padding: '28px', 
              border: '1px solid rgba(197, 154, 90, 0.25)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h4 style={{ fontWeight: 700, color: '#1D1E20', fontSize: '1rem' }}>
                  Medical Emergency & First-Aid Standby
                </h4>
              </div>
              <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.6 }}>
                2 dedicated Advanced Cardiac Life Support (ACLS) ambulances from Kauvery Hospital Salem with doctors and paramedic teams will pilot and trail the riders along the route with instant triage support.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section style={{ backgroundColor: '#F4EFE6', padding: '90px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{ 
              letterSpacing: '0.22em', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: '#8C6830', 
              textTransform: 'uppercase' 
            }}>
              Common Inquiries
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 600, 
              marginTop: 8
            }}>
              Frequently Asked Questions
            </h2>
            <div style={{ width: 60, height: 2, backgroundColor: '#C59A5A', margin: '20px auto 0' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index}
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: 4, 
                    border: '1px solid rgba(29, 30, 32, 0.08)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '22px 28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: 16
                    }}
                  >
                    <span style={{ 
                      fontFamily: "'Playfair Display', serif", 
                      fontSize: '1.15rem', 
                      fontWeight: 600, 
                      color: isOpen ? '#8C6830' : '#1D1E20' 
                    }}>
                      {faq.q}
                    </span>
                    <span style={{ color: isOpen ? '#C59A5A' : '#888' }}>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div style={{ padding: '0 28px 24px', color: '#555', fontSize: '0.95rem', lineHeight: 1.7, borderTop: '1px solid #FAF7F2' }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
