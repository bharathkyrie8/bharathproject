import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Upload,
  User,
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Lock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  Clock,
  Bike,
  CheckCircle2,
  FileCheck,
  Info,
  HelpCircle,
  X
} from 'lucide-react';
import {
  getEventConfig,
  getCategories,
  initiateRegistration,
  verifyRazorpayPayment,
  getUpiDetails,
  submitUpiProof
} from '../services/api';

const Registration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Wizard Step (1: Category, 2: Details, 3: Payment & Summary)
  const [currentStep, setCurrentStep] = useState(1);

  // Categories & Preselection
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMinor, setIsMinor] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [eventStatus, setEventStatus] = useState({ isOpen: true, reason: '' });

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'MALE',
    bloodGroup: 'O+',
    tShirtSize: 'M',
    address: {
      street: 'Salem Main Road',
      city: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636001',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    guardian: {
      fullName: '',
      relation: 'Father',
      phone: '',
      consentGiven: false
    },
    termsAccepted: false,
    medicalDeclarationAccepted: false
  });

  // Payment Selection State
  const [paymentMode, setPaymentMode] = useState('UPI'); // 'UPI' or 'RAZORPAY'
  const [activeQrApp, setActiveQrApp] = useState('phonepe'); // 'phonepe' or 'gpay'
  const [upiDetails, setUpiDetails] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  // Processing & Error Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default Fallback Categories
  const defaultCategories = [
    {
      _id: 'cat-21k',
      slug: '21k-timed',
      code: '21K',
      name: '21.1 KM Half-Century',
      distanceKm: 21.1,
      timingType: 'TIMED',
      priceInr: 699,
      minAge: 18,
      description: 'Premier endurance challenge for seasoned riders along Salem bypass hills. Includes official RFID chip & podium trophies.',
      deliverables: ['RFID Timing Chip', 'Finisher Trophy Medal', 'Dry-Fit Cycling Jersey', 'Kauvery Hospital Breakfast', 'Digital Certificate'],
      benefitsIncluded: ['RFID Timing Chip', 'Finisher Trophy Medal', 'Dry-Fit Cycling Jersey', 'Kauvery Hospital Breakfast', 'Digital Certificate']
    },
    {
      _id: 'cat-10k',
      slug: '10k-timed',
      code: '10K',
      name: '10 KM Endurance Challenge',
      distanceKm: 10.0,
      timingType: 'TIMED',
      priceInr: 499,
      minAge: 16,
      description: 'The definitive test of pacing and endurance. Fast 4-lane course with hydration stations every 2.5 KM.',
      deliverables: ['RFID Timing Chip', 'Finisher Medal', 'Event T-Shirt', 'Kauvery Hospital Breakfast', 'Digital Certificate'],
      benefitsIncluded: ['RFID Timing Chip', 'Finisher Medal', 'Event T-Shirt', 'Kauvery Hospital Breakfast', 'Digital Certificate']
    },
    {
      _id: 'cat-5k',
      slug: '5k-fun-ride',
      code: '5K',
      name: '5 KM Community Fun Ride',
      distanceKm: 5.0,
      timingType: 'NON_TIMED',
      priceInr: 349,
      minAge: 12,
      description: 'Open to youth, beginners, and families. Celebrate healthy hearts and green cycling culture in Salem.',
      deliverables: ['Finisher Medal', 'Event T-Shirt', 'Kauvery Hospital Breakfast', 'Participation Certificate', 'Goodie Bag'],
      benefitsIncluded: ['Finisher Medal', 'Event T-Shirt', 'Kauvery Hospital Breakfast', 'Participation Certificate', 'Goodie Bag']
    }
  ];

  useEffect(() => {
    getCategories()
      .then((cats) => {
        const list = cats && cats.length > 0 ? cats : defaultCategories;
        setCategories(list);
        const preselected = searchParams.get('category');
        if (preselected) {
          const match = list.find((c) =>
            c.slug === preselected ||
            c._id === preselected ||
            c.code === preselected ||
            String(c.distanceKm) === preselected ||
            String(c.priceInr) === preselected
          );
          if (match) setSelectedCategory(match);
          else if (list.length > 0) setSelectedCategory(list[0]);
        } else if (list.length > 0) {
          setSelectedCategory(list[0]);
        }
      })
      .catch((err) => {
        console.warn('API getCategories error, using default fallback categories:', err);
        setCategories(defaultCategories);
        const preselected = searchParams.get('category');
        if (preselected) {
          const match = defaultCategories.find((c) =>
            c.slug === preselected ||
            c._id === preselected ||
            c.code === preselected ||
            String(c.distanceKm) === preselected ||
            String(c.priceInr) === preselected
          );
          if (match) setSelectedCategory(match);
          else setSelectedCategory(defaultCategories[0]);
        } else {
          setSelectedCategory(defaultCategories[0]);
        }
      });

    // Fetch UPI details for direct pay
    getUpiDetails(699, '')
      .then((data) => setUpiDetails(data))
      .catch(() => console.log('UPI initialized locally'));

    // Check if registrations are open or closed by admin
    getEventConfig()
      .then((data) => {
        if (data && typeof data.isRegistrationOpen === 'boolean') {
          setEventStatus({
            isOpen: data.isRegistrationOpen,
            reason: data.closureReason || 'Online registrations for Salem Cycling Marathon are currently closed.'
          });
        }
      })
      .catch((err) => console.log('Could not load event status:', err));
  }, [searchParams]);

  // Handle Date of Birth and age calculation against event date (30 Oct 2026)
  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    setFormData((prev) => ({ ...prev, dob: dobValue }));

    if (dobValue) {
      const birth = new Date(dobValue);
      const eventDate = new Date('2026-10-30');
      let age = eventDate.getFullYear() - birth.getFullYear();
      const m = eventDate.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && eventDate.getDate() < birth.getDate())) {
        age--;
      }
      setCalculatedAge(age);
      setIsMinor(age < 18);
    } else {
      setCalculatedAge(null);
      setIsMinor(false);
    }
  };

  const handleCopyUpi = () => {
    const upiToCopy = upiDetails?.upiId || 'bharathkyrie8-1@oksbi';
    navigator.clipboard.writeText(upiToCopy);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please select a smaller screenshot.');
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  // Step 1 to Step 2 validation
  const handleGoToDetails = () => {
    if (!eventStatus.isOpen) {
      setErrorMsg(eventStatus.reason || 'Online registrations are currently closed by race administration.');
      return;
    }
    if (!selectedCategory) {
      setErrorMsg('Please select a marathon category to proceed.');
      return;
    }
    setErrorMsg('');
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 2 to Step 3 validation
  const handleGoToPayment = () => {
    if (!eventStatus.isOpen) {
      setErrorMsg(eventStatus.reason || 'Online registrations are currently closed by race administration.');
      return;
    }
    setErrorMsg('');
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name as printed on your government photo ID.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address for pass delivery.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for WhatsApp race alerts.');
      return;
    }
    if (calculatedAge === null || isNaN(calculatedAge)) {
      setErrorMsg('Please enter your Date of Birth.');
      return;
    }
    if (calculatedAge < selectedCategory.minAge) {
      setErrorMsg(
        `Age requirement not met: Minimum age for ${selectedCategory.name} is ${selectedCategory.minAge} years (Your calculated age on 30 October 2026: ${calculatedAge} years).`
      );
      return;
    }
    if (isMinor && (!formData.guardian.fullName || !formData.guardian.phone || !formData.guardian.consentGiven)) {
      setErrorMsg('Parent or legal guardian consent and phone number are mandatory for participants under 18.');
      return;
    }
    if (!formData.emergencyContact.name || !formData.emergencyContact.phone) {
      setErrorMsg('Please provide an emergency contact name and phone number for medical safety.');
      return;
    }
    if (!formData.termsAccepted || !formData.medicalDeclarationAccepted) {
      setErrorMsg('You must accept the Event Terms and Medical Declaration before proceeding.');
      return;
    }

    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Payment Submission
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!eventStatus.isOpen) {
      setErrorMsg(eventStatus.reason || 'Online registrations are currently closed by race administration.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Create Pending Registration on Backend
      const payload = {
        ...formData,
        categoryId: selectedCategory._id
      };

      const result = await initiateRegistration(payload);
      const registrationId = result.registrationId;

      // 2. Route based on selected payment mode
      if (paymentMode === 'UPI') {
        // Direct UPI with 12-digit UTR proof
        if (!utrNumber || utrNumber.trim().length < 8) {
          setErrorMsg('Please enter the 12-digit UPI UTR / Transaction Reference Number from your payment app.');
          setLoading(false);
          return;
        }

        const upiFormData = new FormData();
        upiFormData.append('registrationId', registrationId);
        upiFormData.append('utrNumber', utrNumber.trim());
        if (screenshotFile) {
          upiFormData.append('screenshot', screenshotFile);
        }

        await submitUpiProof(upiFormData);
        navigate(`/registration-success/${registrationId}?mode=upi`);
      } else {
        // Razorpay Standard Checkout
        const paymentOrder = result.paymentOrder;

        const options = {
          key: paymentOrder.keyId || 'rzp_test_placeholder_key_id',
          amount: paymentOrder.amount,
          currency: paymentOrder.currency || 'INR',
          name: 'Salem Cycle Marathon 2026',
          description: `${selectedCategory.name} Official Entry`,
          image: '/images/Golden Hour Mountain Climb.png',
          order_id: paymentOrder.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#1D1E20'
          },
          handler: async (response) => {
            try {
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                method: 'razorpay'
              });
              navigate(`/registration-success/${registrationId}?mode=razorpay`);
            } catch (verErr) {
              setErrorMsg('Payment verification failed. Please contact organizer desk.');
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setErrorMsg('Checkout was closed. You can complete verification using Direct UPI.');
            }
          }
        };

        if (window.Razorpay) {
          const rzpInstance = new window.Razorpay(options);
          rzpInstance.open();
        } else {
          setErrorMsg('Payment gateway script loading. Please use Direct UPI mode.');
          setLoading(false);
        }
      }
    } catch (err) {
      setErrorMsg(err.customMessage || 'Registration initiation failed. Please check form errors.');
      setLoading(false);
    }
  };

  const currentPrice = selectedCategory ? selectedCategory.priceInr : 699;

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20', paddingTop: 110, paddingBottom: 100 }}>
      <div className="container-editorial" style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Editorial Top Headline */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 36px' }}>
          <span style={{ 
            display: 'inline-block',
            letterSpacing: '0.22em', 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: '#8C6830', 
            textTransform: 'uppercase',
            marginBottom: 10
          }}>
            Salem Cycle Marathon 2026 • Kauvery Hospital Salem
          </span>
          <h1 style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", 
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', 
            fontWeight: 600, 
            lineHeight: 1.15,
            color: '#1D1E20'
          }}>
            Participant <em>Registration</em>
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem', marginTop: 10, lineHeight: 1.6 }}>
            Confirm your starting slot for the annual endurance cycling classic on <strong>30 October 2026</strong>. 
            Includes RFID timing chip, official cycling jersey, finisher medal, and hospitality breakfast.
          </p>
        </div>

        {/* REGISTRATION CLOSED NOTICE */}
        {!eventStatus.isOpen && (
          <div style={{
            backgroundColor: '#FFF5F5',
            border: '2px solid #C85A32',
            borderRadius: 6,
            padding: '24px 28px',
            marginBottom: 36,
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(200, 90, 50, 0.08)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', backgroundColor: '#FDECEA', marginBottom: 12 }}>
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#C85A32', marginBottom: 8 }}>
              Registrations Are Currently Closed
            </h3>
            <p style={{ color: '#555', fontSize: '0.95rem', maxWidth: 640, margin: '0 auto 16px', lineHeight: 1.6 }}>
              {eventStatus.reason || 'Online registrations for Salem Cycling Marathon are currently closed by race administration. For inquiries or group bookings, please contact the organizers.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="mailto:bharathkyrie8@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#1D1E20',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: 3,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <Mail className="w-4 h-4" />
                <span>Contact Organizer</span>
              </a>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#1D1E20',
                  border: '1px solid #1D1E20',
                  padding: '10px 20px',
                  borderRadius: 3,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            DESIGN COMPONENT 1: INTERACTIVE STEP WIZARD
            ========================================================================= */}
        <div className="stepper-nav">
          <div 
            onClick={() => setCurrentStep(1)}
            className={`stepper-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <div className="stepper-number">
              {currentStep > 1 ? <Check size={14} className="text-amber-600" /> : '1'}
            </div>
            <span>Category</span>
          </div>

          <div className="stepper-divider" />

          <div 
            onClick={() => { if (selectedCategory) setCurrentStep(2); }}
            className={`stepper-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            style={{ cursor: selectedCategory ? 'pointer' : 'not-allowed' }}
          >
            <div className="stepper-number">
              {currentStep > 2 ? <Check size={14} className="text-amber-600" /> : '2'}
            </div>
            <span>Rider Details</span>
          </div>

          <div className="stepper-divider" />

          <div 
            className={`stepper-item ${currentStep === 3 ? 'active' : ''}`}
          >
            <div className="stepper-number">3</div>
            <span>Payment & Pass</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div style={{ 
            backgroundColor: '#FDECEA', 
            color: '#611A15', 
            border: '1px solid #F5C6CB', 
            padding: '14px 20px', 
            borderRadius: 4, 
            marginBottom: 28,
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            fontSize: '0.9rem'
          }}>
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Two-Column Grid: Left Main Form, Right Sticky Summary Receipt */}
        <div className="registration-split-grid">
          
          {/* LEFT COLUMN: ACTIVE STEP CONTENTS */}
          <div>
            
            {/* STEP 1: CATEGORY SELECTION DECK */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div className="responsive-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(29,30,32,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
                        Step 01 of 03
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1D1E20', marginTop: 2 }}>
                        Select Race Category
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      Eligibility based on age on 30 Oct 2026
                    </span>
                  </div>

                  {/* Interactive Cards (Converts to luxury black box when clicked) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {categories.map((cat) => {
                      const isSelected = Boolean(
                        selectedCategory && (
                          selectedCategory._id === cat._id ||
                          selectedCategory.slug === cat.slug ||
                          (selectedCategory.code && selectedCategory.code === cat.code) ||
                          selectedCategory.priceInr === cat.priceInr
                        )
                      );
                      return (
                        <div
                          key={cat._id || cat.slug}
                          onClick={() => setSelectedCategory(cat)}
                          style={{
                            border: isSelected ? '2px solid #C59A5A' : '1px solid rgba(29, 30, 32, 0.12)',
                            backgroundColor: isSelected ? '#0E1014' : '#FFFFFF',
                            color: isSelected ? '#FAF7F2' : '#1D1E20',
                            borderRadius: 4,
                            padding: '24px 28px',
                            cursor: 'pointer',
                            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: isSelected
                              ? '0 16px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(197, 154, 90, 0.25)'
                              : '0 2px 8px rgba(0, 0, 0, 0.03)',
                            transform: isSelected ? 'translateY(-2px)' : 'none',
                            position: 'relative'
                          }}
                        >
                          {/* Selected Pass Ribbon/Badge */}
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                top: -10,
                                right: 20,
                                backgroundColor: '#C59A5A',
                                color: '#0E1014',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                padding: '3px 12px',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(197, 154, 90, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <span>SELECTED PASS ✓</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                <span style={{
                                  backgroundColor: isSelected ? '#C59A5A' : '#FAF5EE',
                                  color: isSelected ? '#0E1014' : '#8C6830',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  padding: '4px 12px',
                                  borderRadius: 20,
                                  letterSpacing: '0.05em'
                                }}>
                                  {cat.distanceKm} KM
                                </span>
                                {cat.timingType === 'TIMED' ? (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    color: isSelected ? '#4ADE80' : '#1B6A50',
                                    backgroundColor: isSelected ? 'rgba(74, 222, 128, 0.14)' : 'transparent',
                                    padding: isSelected ? '2px 8px' : '0',
                                    borderRadius: 4,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                  }}>
                                    ● Official RFID Timed
                                  </span>
                                ) : (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    color: isSelected ? '#93C5FD' : '#888',
                                    backgroundColor: isSelected ? 'rgba(147, 197, 253, 0.14)' : 'transparent',
                                    padding: isSelected ? '2px 8px' : '0',
                                    borderRadius: 4,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                  }}>
                                    ● Open Community Ride
                                  </span>
                                )}
                              </div>

                              <h4 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.35rem',
                                fontWeight: 600,
                                color: isSelected ? '#FAF7F2' : '#1D1E20',
                                marginTop: 8
                              }}>
                                {cat.name}
                              </h4>

                              <p style={{
                                color: isSelected ? '#C0C4CC' : '#666',
                                fontSize: '0.88rem',
                                marginTop: 4,
                                maxWidth: 480,
                                lineHeight: 1.5
                              }}>
                                {cat.description}
                              </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.8rem',
                                fontWeight: 700,
                                color: isSelected ? '#F3BA63' : '#1D1E20'
                              }}>
                                ₹{cat.priceInr}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: isSelected ? '#A0A4AC' : '#888' }}>
                                Min Age: {cat.minAge} Yrs
                              </span>
                            </div>
                          </div>

                          {/* Included deliverable chips */}
                          <div style={{
                            marginTop: 16,
                            paddingTop: 14,
                            borderTop: isSelected ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(29,30,32,0.06)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8
                          }}>
                            {(cat.benefitsIncluded || cat.deliverables || ['Official Jersey', 'Finisher Medal', 'RFID Bib', 'Hot Breakfast', 'E-Certificate']).map((del, dIdx) => (
                              <span
                                key={dIdx}
                                style={{
                                  fontSize: '0.72rem',
                                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : '#FAF7F2',
                                  border: isSelected ? '1px solid rgba(197, 154, 90, 0.35)' : '1px solid rgba(29, 30, 32, 0.08)',
                                  color: isSelected ? '#EDE9E1' : '#555',
                                  padding: '4px 10px',
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 5
                                }}
                              >
                                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-amber-600'}`} />
                                <span>{del}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleGoToDetails}
                      disabled={!eventStatus.isOpen}
                      style={{
                        backgroundColor: !eventStatus.isOpen ? '#999999' : '#1D1E20',
                        color: '#FAF7F2',
                        padding: '14px 32px',
                        border: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: !eventStatus.isOpen ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <span>{!eventStatus.isOpen ? 'Registrations Closed' : 'Proceed to Rider Details'}</span>
                      {eventStatus.isOpen && <ChevronRight className="w-4 h-4 text-amber-400" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: RIDER PARTICIPANT DETAILS */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div className="responsive-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(29,30,32,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
                        Step 02 of 03
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1D1E20', marginTop: 2 }}>
                        Participant Information
                      </h3>
                    </div>
                    {calculatedAge !== null && (
                      <span style={{ 
                        fontSize: '0.78rem', 
                        padding: '4px 10px', 
                        borderRadius: 20, 
                        backgroundColor: isMinor ? '#FFF4E5' : '#EAF5F0', 
                        color: isMinor ? '#B76E00' : '#1B6A50', 
                        fontWeight: 700 
                      }}>
                        {calculatedAge} Yrs on Race Day ({isMinor ? 'Minor' : 'Adult'})
                      </span>
                    )}
                  </div>

                  {/* Form Inputs Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    
                    {/* Full Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                        Full Name (as per Govt ID) *
                      </label>
                      <input 
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Karthikeyan Ramanathan"
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

                    {/* Email & Phone */}
                    <div className="form-row-responsive">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                          Email Address (Ticket sent here) *
                        </label>
                        <input 
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                          Mobile Number (WhatsApp updates) *
                        </label>
                        <input 
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit phone"
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

                    {/* DOB & Gender */}
                    <div className="form-row-responsive">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                          Date of Birth *
                        </label>
                        <input 
                          type="date"
                          required
                          value={formData.dob}
                          onChange={handleDobChange}
                          max={new Date().toISOString().split('T')[0]}
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
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                          Gender *
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setFormData({ ...formData, gender: g })}
                              style={{
                                flex: 1,
                                padding: '11px',
                                borderRadius: 3,
                                border: formData.gender === g ? '2px solid #C59A5A' : '1px solid rgba(29,30,32,0.15)',
                                backgroundColor: formData.gender === g ? '#1D1E20' : '#FAF7F2',
                                color: formData.gender === g ? '#FAF7F2' : '#555',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                              }}
                            >
                              {g.toLowerCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* DESIGN COMPONENT: T-SHIRT SIZE SELECTOR */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444' }}>
                          Official Cycling Jersey / T-Shirt Size *
                        </label>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>Included free in race kit</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8 }}>
                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => {
                          const isPicked = formData.tShirtSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setFormData({ ...formData, tShirtSize: size })}
                              style={{
                                padding: '10px 4px',
                                borderRadius: 3,
                                border: isPicked ? '2px solid #C59A5A' : '1px solid rgba(29,30,32,0.15)',
                                backgroundColor: isPicked ? '#C59A5A' : '#FAF7F2',
                                color: isPicked ? '#0E1014' : '#333',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Address Fields */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                        Street / Residential Address
                      </label>
                      <input 
                        type="text" 
                        value={formData.address.street} 
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                        placeholder="e.g. 12, Anna Nagar / Trichy Main Road"
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

                    <div className="form-row-3">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>
                          City *
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={formData.address.city} 
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FAF7F2', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>
                          State *
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={formData.address.state} 
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FAF7F2', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#444', marginBottom: 4 }}>
                          Pincode *
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={formData.address.pincode} 
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FAF7F2', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    {/* Emergency Contact Box */}
                    <div style={{ backgroundColor: '#FAF7F2', padding: '20px', borderRadius: 4, border: '1px solid rgba(29,30,32,0.08)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C85A32', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <Heart className="w-4 h-4" />
                        Emergency Medical Contact *
                      </span>
                      <div className="form-row-3">
                        <input 
                          type="text" 
                          required 
                          placeholder="Contact Person Name" 
                          value={formData.emergencyContact.name} 
                          onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                          style={{ padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FFF', fontSize: '0.88rem' }}
                        />
                        <input 
                          type="text" 
                          required 
                          placeholder="Relation (e.g. Spouse / Parent)" 
                          value={formData.emergencyContact.relation} 
                          onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relation: e.target.value } })}
                          style={{ padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FFF', fontSize: '0.88rem' }}
                        />
                        <input 
                          type="tel" 
                          required 
                          placeholder="Emergency Mobile #" 
                          value={formData.emergencyContact.phone} 
                          onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                          style={{ padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FFF', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    {/* Minor Guardian Consent (Under 18) */}
                    {isMinor && (
                      <div style={{ backgroundColor: '#FFF9F0', border: '1px solid #C59A5A', padding: '20px', borderRadius: 4 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8C6830', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <ShieldCheck className="w-4 h-4" />
                          Parent / Legal Guardian Consent (Mandatory for riders under 18)
                        </span>
                        <div className="form-row-responsive" style={{ marginBottom: 12 }}>
                          <input 
                            type="text" 
                            required={isMinor} 
                            placeholder="Guardian Full Name" 
                            value={formData.guardian.fullName} 
                            onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, fullName: e.target.value } })}
                            style={{ padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FFF', fontSize: '0.88rem' }}
                          />
                          <input 
                            type="tel" 
                            required={isMinor} 
                            placeholder="Guardian Phone #" 
                            value={formData.guardian.phone} 
                            onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, phone: e.target.value } })}
                            style={{ padding: '10px 12px', borderRadius: 3, border: '1px solid rgba(29,30,32,0.15)', backgroundColor: '#FFF', fontSize: '0.88rem' }}
                          />
                        </div>
                        <label style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: '#444', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            required={isMinor} 
                            checked={formData.guardian.consentGiven} 
                            onChange={(e) => setFormData({ ...formData, guardian: { ...formData.guardian, consentGiven: e.target.checked } })}
                            style={{ marginTop: 2 }}
                          />
                          <span>I, parent/guardian, grant permission for this minor to compete and affirm helmet and route safety compliance.</span>
                        </label>
                      </div>
                    )}

                    {/* Terms & Medical Checkboxes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
                      <label style={{ display: 'flex', gap: 10, fontSize: '0.82rem', color: '#333', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          required 
                          checked={formData.termsAccepted} 
                          onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                          style={{ marginTop: 2 }}
                        />
                        <span>I accept the official <strong>Salem Cycle Marathon 2026 Regulations</strong> and declare that wearing an approved bicycle helmet is strictly mandatory.</span>
                      </label>

                      <label style={{ display: 'flex', gap: 10, fontSize: '0.82rem', color: '#333', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          required 
                          checked={formData.medicalDeclarationAccepted} 
                          onChange={(e) => setFormData({ ...formData, medicalDeclarationAccepted: e.target.checked })}
                          style={{ marginTop: 2 }}
                        />
                        <span><strong>Medical Fitness:</strong> I certify that I am in good physical condition and have trained sufficiently for this distance.</span>
                      </label>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#666',
                        border: '1px solid rgba(29,30,32,0.2)',
                        padding: '12px 24px',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Category</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGoToPayment}
                      disabled={!eventStatus.isOpen}
                      style={{
                        backgroundColor: !eventStatus.isOpen ? '#999999' : '#1D1E20',
                        color: '#FAF7F2',
                        padding: '14px 32px',
                        border: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: !eventStatus.isOpen ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <span>{!eventStatus.isOpen ? 'Registrations Closed' : 'Proceed to Payment'}</span>
                      {eventStatus.isOpen && <ChevronRight className="w-4 h-4 text-amber-400" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT & CONFIRMATION (DIRECT UPI QR vs RAZORPAY) */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div className="responsive-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(29,30,32,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
                        Step 03 of 03
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1D1E20', marginTop: 2 }}>
                        Payment & Bib Confirmation
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>Total Payable:</span>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#1D1E20' }}>
                        ₹{currentPrice}
                      </div>
                    </div>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="form-row-responsive" style={{ marginBottom: 24 }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('UPI')}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 3,
                        border: paymentMode === 'UPI' ? '2px solid #C59A5A' : '1px solid rgba(29,30,32,0.15)',
                        backgroundColor: paymentMode === 'UPI' ? '#FFFDF9' : '#FAF7F2',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      <QrCode className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1D1E20' }}>
                          PhonePe & GPay QR
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#666' }}>
                          Direct UPI Scan • Zero Extra Fee
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('RAZORPAY')}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 3,
                        border: paymentMode === 'RAZORPAY' ? '2px solid #C59A5A' : '1px solid rgba(29,30,32,0.15)',
                        backgroundColor: paymentMode === 'RAZORPAY' ? '#FFFDF9' : '#FAF7F2',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      <CreditCard className="w-5 h-5 text-gray-700 flex-shrink-0" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1D1E20' }}>
                          Online Payment Gateway
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#666' }}>
                          Cards, NetBanking, Gateway UPI
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* DIRECT UPI SCAN INTERACTION (SOLUTION 2) */}
                  {paymentMode === 'UPI' && (
                    <div style={{ backgroundColor: '#FAF7F2', borderRadius: 4, padding: '28px', border: '1px solid rgba(197, 154, 90, 0.3)', marginBottom: 24 }}>
                      
                      {/* App Switcher Pills */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                        <button
                          type="button"
                          onClick={() => setActiveQrApp('phonepe')}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            border: activeQrApp === 'phonepe' ? '2px solid #5F259F' : '1px solid rgba(0,0,0,0.15)',
                            backgroundColor: activeQrApp === 'phonepe' ? '#5F259F' : '#FFF',
                            color: activeQrApp === 'phonepe' ? '#FFF' : '#333',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span>PhonePe QR</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveQrApp('gpay')}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            border: activeQrApp === 'gpay' ? '2px solid #4285F4' : '1px solid rgba(0,0,0,0.15)',
                            backgroundColor: activeQrApp === 'gpay' ? '#4285F4' : '#FFF',
                            color: activeQrApp === 'gpay' ? '#FFF' : '#333',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span>Google Pay QR</span>
                        </button>
                      </div>

                      {/* Display QR Code */}
                      <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ 
                          width: 220, 
                          height: 220, 
                          margin: '0 auto 12px', 
                          backgroundColor: '#FFF', 
                          padding: 12, 
                          borderRadius: 6, 
                          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                          border: '2px solid #C59A5A'
                        }}>
                          <img 
                            src={activeQrApp === 'phonepe' 
                              ? (upiDetails?.phonepeQrUrl || '/qr/phonepe_qr.jpg') 
                              : (upiDetails?.gpayQrUrl || '/qr/gpay_qr.jpg')}
                            alt={`${activeQrApp} QR`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#555' }}>
                          Scan using any UPI app & transfer <strong>₹{currentPrice}</strong>
                        </span>
                      </div>

                      {/* UPI ID copyable strip */}
                      <div style={{ 
                        backgroundColor: '#FFF', 
                        padding: '12px 16px', 
                        borderRadius: 3, 
                        border: '1px dashed rgba(29,30,32,0.2)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        maxWidth: 420,
                        margin: '0 auto 24px'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#888', display: 'block' }}>Merchant UPI ID:</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.92rem', color: '#1D1E20' }}>
                            {upiDetails?.upiId || 'bharathkyrie8-1@oksbi'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          style={{
                            backgroundColor: copiedUpi ? '#EAF5F0' : '#1D1E20',
                            color: copiedUpi ? '#1B6A50' : '#FFF',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: 2,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* UTR Input Form */}
                      <div style={{ maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1D1E20' }}>
                              12-Digit UPI Reference / UTR Number *
                            </label>
                            <span style={{ fontSize: '0.72rem', color: utrNumber.length === 12 ? '#1B6A50' : '#888', fontWeight: 600 }}>
                              {utrNumber.length} / 12 Digits
                            </span>
                          </div>
                          <input 
                            type="text"
                            required={paymentMode === 'UPI'}
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 16))}
                            placeholder="e.g. 428912345678"
                            style={{ 
                              width: '100%', 
                              padding: '12px 14px', 
                              borderRadius: 3, 
                              border: utrNumber.length >= 12 ? '2px solid #1B6A50' : '1px solid rgba(29,30,32,0.2)',
                              backgroundColor: '#FFF',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '1rem',
                              letterSpacing: '0.08em',
                              outline: 'none'
                            }}
                          />
                          <span style={{ fontSize: '0.72rem', color: '#777', marginTop: 4, display: 'block' }}>
                            Visible on the payment success screen of GPay, PhonePe, or Paytm.
                          </span>
                        </div>

                        {/* Screenshot Upload Dropzone */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1D1E20', marginBottom: 4 }}>
                            Upload Payment Screenshot (Optional for instant pass)
                          </label>
                          <div style={{ 
                            border: '1px dashed rgba(29,30,32,0.25)', 
                            borderRadius: 4, 
                            padding: '16px', 
                            textAlign: 'center', 
                            backgroundColor: '#FFF',
                            cursor: 'pointer' 
                          }}>
                            {screenshotPreview ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                <img src={screenshotPreview} alt="Screenshot Preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 3 }} />
                                <div style={{ textAlign: 'left' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B6A50', display: 'block' }}>✓ Screenshot attached</span>
                                  <span style={{ fontSize: '0.72rem', color: '#888' }}>{screenshotFile?.name}</span>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => { setScreenshotFile(null); setScreenshotPreview(''); }}
                                  style={{ background: 'none', border: 'none', color: '#C85A32', cursor: 'pointer', padding: 4 }}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <Upload className="w-5 h-5 text-amber-600" />
                                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1D1E20' }}>Click to select screenshot</span>
                                <span style={{ fontSize: '0.72rem', color: '#888' }}>PNG, JPG or JPEG up to 8MB</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleScreenshotChange} 
                                  style={{ display: 'none' }} 
                                />
                              </label>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* RAZORPAY GATEWAY NOTICE */}
                  {paymentMode === 'RAZORPAY' && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '24px', borderRadius: 4, border: '1px solid rgba(29,30,32,0.1)', marginBottom: 24, textAlign: 'center' }}>
                      <CreditCard className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600 }}>
                        Standard Payment Gateway Checkout
                      </h4>
                      <p style={{ color: '#666', fontSize: '0.88rem', maxWidth: 420, margin: '6px auto 0' }}>
                        Clicking the button below will open the secure gateway checkout modal supporting Credit/Debit cards, NetBanking, and UPI apps.
                      </p>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#666',
                        border: '1px solid rgba(29,30,32,0.2)',
                        padding: '12px 24px',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={loading || !eventStatus.isOpen}
                      style={{
                        backgroundColor: !eventStatus.isOpen ? '#999999' : '#C59A5A',
                        color: !eventStatus.isOpen ? '#FFFFFF' : '#0E1014',
                        padding: '16px 36px',
                        border: 'none',
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: (loading || !eventStatus.isOpen) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        boxShadow: !eventStatus.isOpen ? 'none' : '0 8px 24px rgba(197, 154, 90, 0.3)'
                      }}
                    >
                      {loading ? (
                        <span>Processing Entry...</span>
                      ) : !eventStatus.isOpen ? (
                        <span>Registrations Closed</span>
                      ) : (
                        <>
                          <span>Complete Registration & Confirm</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY EDITORIAL ORDER SUMMARY & RECEIPT */}
          <div className="sticky-summary-desktop">
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 4, 
              border: '1px solid rgba(29, 30, 32, 0.08)', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}>
              {/* Receipt Header */}
              <div style={{ backgroundColor: '#0E1014', color: '#FFF', padding: 'clamp(16px, 3.5vw, 28px)' }}>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
                  Official Event Pass Receipt
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, marginTop: 4 }}>
                  Salem Marathon 2026
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#B0B4BC' }}>
                  Venue: Kauvery Hospital Salem
                </span>
              </div>

              {/* Receipt Body */}
              <div style={{ padding: 'clamp(16px, 3.5vw, 28px)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.88rem', borderBottom: '1px dashed rgba(29,30,32,0.15)', paddingBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#777' }}>Category:</span>
                    <strong style={{ color: '#1D1E20' }}>{selectedCategory?.name || '21.1 KM'}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#777' }}>Distance:</span>
                    <strong>{selectedCategory?.distanceKm || 21.1} Kilometers</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#777' }}>Race Date:</span>
                    <strong>30 October 2026</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#777' }}>Assembly Time:</span>
                    <strong>04:30 AM IST</strong>
                  </div>

                  {formData.fullName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#777' }}>Participant:</span>
                      <strong style={{ maxWidth: 160, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formData.fullName}
                      </strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#777' }}>Jersey Size:</span>
                    <strong style={{ padding: '2px 8px', backgroundColor: '#FAF7F2', borderRadius: 2 }}>{formData.tShirtSize}</strong>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{ padding: '20px 0', borderBottom: '1px solid rgba(29,30,32,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                    <span style={{ color: '#777' }}>Registration Fee:</span>
                    <span>₹{currentPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                    <span style={{ color: '#777' }}>Goods & Services Tax (GST):</span>
                    <span style={{ color: '#1B6A50', fontWeight: 600 }}>Inclusive (₹0)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1D1E20', paddingTop: 8 }}>
                    <span>Total Amount:</span>
                    <span>₹{currentPrice}</span>
                  </div>
                </div>

                {/* Included Kit Deliverables */}
                <div style={{ marginTop: 20 }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700, display: 'block', marginBottom: 10 }}>
                    Kit Deliverables at Expo (28-29 Oct):
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      'RFID Timing Chip & Numbered Bib',
                      'Official Moisture-Wicking Jersey',
                      'Handcrafted Finisher Medal',
                      'Kauvery Hospital Hot Breakfast Buffet',
                      'Digital Timing Certificate & Photo Wall'
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#555' }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Stamp */}
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(29,30,32,0.06)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: '#888' }}>
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>256-Bit SSL Encrypted Verification</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Registration;
