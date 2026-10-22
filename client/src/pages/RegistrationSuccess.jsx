import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, MapPin, Calendar, Printer, Home, Download, AlertCircle, Shield } from 'lucide-react';
import { getRegistrationStatus } from '../services/api';

const RegistrationSuccess = () => {
  const { registrationId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'upi' or 'razorpay'

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C59A5A', '#155E47', '#1D1E20', '#FFFFFF']
      });
    } catch (e) {
      // Ignore if confetti not supported
    }

    if (registrationId) {
      getRegistrationStatus(registrationId)
        .then((data) => {
          setRegistration(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log('Using simulated status');
          setLoading(false);
        });
    }
  }, [registrationId]);

  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = registration && registration.status === 'CONFIRMED';
  const isPendingUpi = mode === 'upi' || (registration && registration.status === 'PENDING_VERIFICATION');

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20">
      <div className="container-editorial max-w-3xl mx-auto">
        {/* Main Printable Ticket Card */}
        <div className="bg-white border border-[rgba(29,30,32,0.1)] rounded-sm p-8 md:p-12 shadow-lg relative overflow-hidden print:shadow-none print:border-none">
          {/* Top Status Header */}
          <div className="text-center pb-8 border-b border-[rgba(29,30,32,0.08)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#155E47]/10 text-[#155E47] mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="tracking-luxury text-xs text-[#C59A5A] block mb-1">
              OFFICIAL PARTICIPANT ENTRY PASS
            </span>

            <h1 className="headline-editorial text-3xl md:text-4xl text-[#1D1E20] mb-3">
              Registration <em>{isPendingUpi ? 'Submitted' : 'Confirmed'}!</em>
            </h1>

            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-luxury uppercase border bg-[#155E47]/10 text-[#155E47] border-[#155E47]/20">
              {isPendingUpi ? '● Status: Payment Under Verification' : '● Status: Officially Confirmed'}
            </div>
          </div>

          {/* Registration Code Banner */}
          <div className="my-8 p-6 bg-[#FAF7F2] border border-[rgba(29,30,32,0.08)] rounded-sm text-center">
            <span className="text-[10px] tracking-luxury uppercase text-[#8B8E96] block mb-1">
              YOUR UNIQUE REGISTRATION NUMBER
            </span>
            <span className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-[#1D1E20]">
              {registrationId || 'CYC-2026-XXXXXX'}
            </span>
            <p className="text-[11px] text-[#64666B] mt-2 font-sans">
              Please save this ID or take a screenshot. You will present this during Bib collection.
            </p>
          </div>

          {/* Participant & Event Summary Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-[rgba(29,30,32,0.08)] text-xs">
            <div>
              <span className="text-[#8B8E96] uppercase tracking-wider block mb-1">Participant Name:</span>
              <strong className="text-sm text-[#1D1E20]">
                {registration ? registration.participant.fullName : 'Registered Cyclist'}
              </strong>
            </div>

            <div>
              <span className="text-[#8B8E96] uppercase tracking-wider block mb-1">Category & Distance:</span>
              <strong className="text-sm text-[#1D1E20]">
                {registration ? registration.category.name : 'Cycle Marathon Entry'}
              </strong>
            </div>

            <div>
              <span className="text-[#8B8E96] uppercase tracking-wider block mb-1">T-Shirt Size:</span>
              <strong className="text-sm text-[#1D1E20]">
                {registration ? registration.participant.tShirtSize : 'M'}
              </strong>
            </div>

            <div>
              <span className="text-[#8B8E96] uppercase tracking-wider block mb-1">Amount Paid:</span>
              <strong className="text-sm text-[#1D1E20]">
                ₹{registration ? registration.amountDueInr : 699} (INR)
              </strong>
            </div>
          </div>

          {/* Bib & Kit Expo Collection Instructions */}
          <div className="py-8 border-b border-[rgba(29,30,32,0.08)] space-y-4">
            <span className="text-xs font-semibold tracking-luxury uppercase text-[#C59A5A] block">
              BIB & TIMING CHIP COLLECTION DETAILS
            </span>

            <div className="space-y-3 text-xs text-[#2D3036]">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C59A5A] shrink-0 mt-0.5" />
                <div>
                  <strong>Expo Venue: Kauvery Hospital, Salem</strong>
                  <p className="text-[#64666B] mt-0.5">
                    #9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti,
                    Salem, Tamil Nadu – 636201
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-[#C59A5A] shrink-0 mt-0.5" />
                <div>
                  <strong>Collection Dates: 28 & 29 October 2026</strong>
                  <p className="text-[#64666B] mt-0.5">9:00 AM to 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#C59A5A] shrink-0 mt-0.5" />
                <div>
                  <strong>Race Day Flag-Off: 30 October 2026</strong>
                  <p className="text-[#64666B] mt-0.5">
                    Assembly from 4:30 AM IST. Helmets are strictly mandatory for all riders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              to="/"
              className="btn-editorial-outline text-xs w-full sm:w-auto"
              style={{ textDecoration: 'none' }}
            >
              <Home size={14} />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={handlePrint}
              className="btn-editorial-primary text-xs w-full sm:w-auto"
              style={{
                backgroundColor: 'var(--accent-gold)',
                borderColor: 'var(--accent-gold)',
                color: '#FFFFFF'
              }}
            >
              <Printer size={14} />
              <span>Print Registration Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
