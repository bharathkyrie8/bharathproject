import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  LogOut, 
  RefreshCw, 
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { 
  adminLogin, 
  adminLogout, 
  adminGetMe, 
  adminGetDashboard, 
  adminGetParticipants, 
  adminGetPendingUpi, 
  adminVerifyUpi, 
  adminRejectUpi, 
  adminToggleRegistration,
  adminExportCsvUrl 
} from '../services/api';

const AdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({ identifier: 'bharathkyrie8@gmail.com', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Tabs & Views
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'participants' | 'overview'

  // Data states
  const [stats, setStats] = useState(null);
  const [pendingUpiList, setPendingUpiList] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [selectedProof, setSelectedProof] = useState(null); // For screenshot view
  const [selectedParticipant, setSelectedParticipant] = useState(null); // Detail view
  const [rejectModal, setRejectModal] = useState({ open: false, regId: null, reason: '' });

  // Initial check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const currentAdmin = await adminGetMe();
      setAdmin(currentAdmin);
      loadDashboardData();
    } catch (err) {
      setAdmin(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmittingLogin(true);
    setLoginError(null);
    try {
      const res = await adminLogin(loginForm.identifier, loginForm.password);
      setAdmin(res.admin);
      loadDashboardData();
    } catch (err) {
      setLoginError(err.customMessage || 'Invalid email or password. Please try again.');
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      setAdmin(null);
    } catch (err) {
      setAdmin(null);
    }
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [dashStats, pending, partData] = await Promise.all([
        adminGetDashboard().catch(() => null),
        adminGetPendingUpi().catch(() => []),
        adminGetParticipants({ page: 1, limit: 100 }).catch(() => ({ data: [] }))
      ]);

      if (dashStats) setStats(dashStats);
      if (pending) setPendingUpiList(pending);
      if (partData && partData.data) setParticipants(partData.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApproveUpi = async (registrationId) => {
    if (!window.confirm(`Confirm payment & issue official Bib for ${registrationId}? This will automatically dispatch the Confirmation Ticket to the participant's email.`)) {
      return;
    }

    try {
      const res = await adminVerifyUpi(registrationId);
      setActionFeedback({ success: true, message: res.message || 'Payment verified! Ticket emailed to participant.' });
      loadDashboardData();
    } catch (err) {
      setActionFeedback({ success: false, message: err.customMessage || 'Verification failed.' });
    }
  };

  const handleRejectUpi = async () => {
    if (!rejectModal.reason.trim()) {
      alert('Please enter a rejection reason so the participant knows why.');
      return;
    }

    try {
      const res = await adminRejectUpi(rejectModal.regId, rejectModal.reason);
      setActionFeedback({ success: true, message: res.message || 'Payment proof rejected and participant informed.' });
      setRejectModal({ open: false, regId: null, reason: '' });
      loadDashboardData();
    } catch (err) {
      setActionFeedback({ success: false, message: err.customMessage || 'Rejection failed.' });
    }
  };

  const handleToggleRegistration = async (currentState) => {
    const nextState = !currentState;
    const confirmMsg = nextState 
      ? 'Re-open marathon registrations to the public?' 
      : 'Close registrations now? (New users will not be able to submit forms)';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await adminToggleRegistration(nextState, nextState ? '' : 'Registrations are currently closed by race administration.');
      setActionFeedback({ success: true, message: res.message || 'Registration status updated.' });
      loadDashboardData();
    } catch (err) {
      setActionFeedback({ success: false, message: err.customMessage || 'Status toggle failed.' });
    }
  };

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.registrationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery) ||
      (p.bibNumber && p.bibNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    const matchesCategory = categoryFilter === '' || p.category?.code === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // If loading session
  if (authLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-4" />
          <p style={{ color: '#666', fontFamily: "'Playfair Display', serif", fontSize: '1.2rem' }}>
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  // If Not Authenticated -> Show Editorial Login Form
  if (!admin) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ 
          maxWidth: 440, 
          width: '100%', 
          backgroundColor: '#FFFFFF', 
          borderRadius: 4, 
          padding: '48px 40px', 
          border: '1px solid rgba(29, 30, 32, 0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.06)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ 
              width: 52, 
              height: 52, 
              borderRadius: '50%', 
              backgroundColor: '#FAF5EE', 
              color: '#C59A5A', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1px solid rgba(197, 154, 90, 0.3)'
            }}>
              <ShieldCheck className="w-6 h-6" />
            </div>

            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C6830', fontWeight: 700 }}>
              Kauvery Hospital Salem
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#1D1E20', marginTop: 4 }}>
              Race Admin Portal
            </h1>
            <p style={{ color: '#777', fontSize: '0.88rem', marginTop: 6 }}>
              Authorized coordination desk & payment reconciliation
            </p>
          </div>

          {loginError && (
            <div style={{ 
              backgroundColor: '#FDECEA', 
              color: '#611A15', 
              padding: '12px 16px', 
              borderRadius: 3, 
              fontSize: '0.85rem', 
              marginBottom: 20,
              display: 'flex', 
              alignItems: 'center', 
              gap: 8 
            }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                Admin Email
              </label>
              <input 
                type="email" 
                required 
                value={loginForm.identifier} 
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                placeholder="bharathkyrie8@gmail.com"
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: 3, 
                  border: '1px solid rgba(29, 30, 32, 0.15)',
                  backgroundColor: '#FAF7F2',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
                Admin Password
              </label>
              <input 
                type="password" 
                required 
                value={loginForm.password} 
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: 3, 
                  border: '1px solid rgba(29, 30, 32, 0.15)',
                  backgroundColor: '#FAF7F2',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#888', marginTop: 4, display: 'block' }}>
                Default Seed: AdminSecure2026!
              </span>
            </div>

            <button
              type="submit"
              disabled={submittingLogin}
              style={{
                backgroundColor: '#1D1E20',
                color: '#FAF7F2',
                padding: '14px',
                borderRadius: 2,
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: submittingLogin ? 'not-allowed' : 'pointer',
                marginTop: 8,
                transition: 'background 0.3s ease'
              }}
            >
              {submittingLogin ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1D1E20', paddingBottom: 100 }}>
      
      {/* Top Admin Bar */}
      <div style={{ 
        backgroundColor: '#0E1014', 
        color: '#FFFFFF', 
        padding: '16px 32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 16 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
              Salem Marathon Admin Console
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#A0A4AE' }}>
              Logged in as: <strong style={{ color: '#FFF' }}>{admin.email}</strong> ({admin.role})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => loadDashboardData()}
            title="Refresh Data"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              color: '#FAF7F2', 
              border: 'none', 
              padding: '8px 14px', 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              fontSize: '0.8rem',
              cursor: 'pointer' 
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <a 
            href={adminExportCsvUrl} 
            download="salem_marathon_participants.csv"
            style={{ 
              backgroundColor: '#C59A5A', 
              color: '#0E1014', 
              padding: '8px 16px', 
              borderRadius: 2, 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleLogout}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: '#FFF', 
              padding: '8px 14px', 
              borderRadius: 3, 
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px' }}>
        
        {/* Action feedback toast */}
        {actionFeedback && (
          <div style={{ 
            backgroundColor: actionFeedback.success ? '#EDF7ED' : '#FDECEA', 
            color: actionFeedback.success ? '#1E4620' : '#611A15', 
            padding: '14px 20px', 
            borderRadius: 4, 
            marginBottom: 24, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {actionFeedback.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{actionFeedback.message}</span>
            </div>
            <button 
              onClick={() => setActionFeedback(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {/* Dashboard Metrics Row */}
        {stats && (
          <div className="grid-responsive-1-2-4" style={{ marginBottom: 36 }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 4, border: '1px solid rgba(29,30,32,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Total Registrations</span>
              <div style={{ fontSize: '2.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1D1E20', marginTop: 4 }}>
                {stats.summary?.totalRegistrations || 0}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: 4, display: 'block' }}>All categories & statuses</span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 4, border: '1px solid rgba(29,30,32,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1B6A50', fontWeight: 600 }}>Confirmed Riders</span>
              <div style={{ fontSize: '2.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1B6A50', marginTop: 4 }}>
                {stats.summary?.confirmed || 0}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: 4, display: 'block' }}>Bib issued & payment settled</span>
            </div>

            <div style={{ 
              backgroundColor: (pendingUpiList && pendingUpiList.length > 0) ? '#FFF9F0' : '#FFFFFF', 
              padding: '24px', 
              borderRadius: 4, 
              border: (pendingUpiList && pendingUpiList.length > 0) ? '1px solid #C59A5A' : '1px solid rgba(29,30,32,0.08)', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)' 
            }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C85A32', fontWeight: 700 }}>
                Pending UPI Proofs
              </span>
              <div style={{ fontSize: '2.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#C85A32', marginTop: 4 }}>
                {pendingUpiList?.length || 0}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#8C6830', marginTop: 4, display: 'block' }}>Requires 1-click verification</span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 4, border: '1px solid rgba(29,30,32,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Total Revenue</span>
              <div style={{ fontSize: '2.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1D1E20', marginTop: 4 }}>
                ₹{(stats.summary?.totalRevenue || 0).toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: 4, display: 'block' }}>From confirmed registrations</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '2px solid rgba(29, 30, 32, 0.08)', 
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16 
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'pending' ? '3px solid #C59A5A' : '3px solid transparent',
                padding: '12px 0',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: activeTab === 'pending' ? '#1D1E20' : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: -2
              }}
            >
              <span>Pending UPI Approvals</span>
              {pendingUpiList && pendingUpiList.length > 0 && (
                <span style={{ 
                  backgroundColor: '#C85A32', 
                  color: '#FFF', 
                  fontSize: '0.7rem', 
                  padding: '2px 8px', 
                  borderRadius: 12, 
                  fontWeight: 700 
                }}>
                  {pendingUpiList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('participants')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'participants' ? '3px solid #C59A5A' : '3px solid transparent',
                padding: '12px 0',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: activeTab === 'participants' ? '#1D1E20' : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: -2
              }}
            >
              <span>All Participants Directory</span>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>({participants.length})</span>
            </button>
          </div>

          {/* Quick Registration Status Toggle */}
          {stats?.event && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Public Registrations:</span>
              <button
                onClick={() => handleToggleRegistration(stats.event.isRegistrationOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: stats.event.isRegistrationOpen ? '1px solid #1B6A50' : '1px solid #C85A32',
                  backgroundColor: stats.event.isRegistrationOpen ? '#EAF5F0' : '#FDECEA',
                  color: stats.event.isRegistrationOpen ? '#1B6A50' : '#C85A32',
                  cursor: 'pointer'
                }}
              >
                {stats.event.isRegistrationOpen ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-red-600" />}
                <span>{stats.event.isRegistrationOpen ? 'Live (Open)' : 'Closed'}</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: PENDING UPI APPROVALS (Solution 2 - No PAN Needed) */}
        {activeTab === 'pending' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#1D1E20' }}>
                UPI Proof Verification Queue
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Review participant 12-digit UTR references and payment screenshots. Click <strong>Verify & Confirm</strong> to automatically mark as confirmed, assign official Bib number, and dispatch ticket confirmation email.
              </p>
            </div>

            {pendingUpiList.length === 0 ? (
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                padding: '60px 24px', 
                borderRadius: 4, 
                textAlign: 'center', 
                border: '1px solid rgba(29,30,32,0.08)' 
              }}>
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, color: '#1D1E20' }}>
                  No Pending UPI Verifications
                </h4>
                <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 440, margin: '6px auto 0' }}>
                  All submitted PhonePe and Google Pay proofs have been reviewed and processed.
                </p>
              </div>
            ) : (
              <div className="grid-responsive-1-2">
                {pendingUpiList.map((item) => (
                  <div 
                    key={item._id}
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: 4, 
                      padding: '24px', 
                      border: '1px solid #C59A5A', 
                      boxShadow: '0 8px 24px rgba(197, 154, 90, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: '#C59A5A', 
                          letterSpacing: '0.08em',
                          fontFamily: 'monospace' 
                        }}>
                          {item.registrationId}
                        </span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '3px 8px', 
                          borderRadius: 12, 
                          backgroundColor: '#FFF4E5', 
                          color: '#B76E00', 
                          fontWeight: 700, 
                          textTransform: 'uppercase' 
                        }}>
                          {item.paymentMode}
                        </span>
                      </div>

                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, color: '#1D1E20', marginBottom: 4 }}>
                        {item.fullName}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem', color: '#555', marginBottom: 16 }}>
                        <div><strong>Category:</strong> {item.category?.name || item.category?.code} ({item.category?.distanceKm} KM)</div>
                        <div><strong>Amount Due:</strong> ₹{item.amount}</div>
                        <div><strong>Email:</strong> {item.email}</div>
                        <div><strong>Phone:</strong> {item.phone}</div>
                      </div>

                      {/* UTR Reference Box */}
                      <div style={{ 
                        backgroundColor: '#FAF7F2', 
                        padding: '12px 14px', 
                        borderRadius: 3, 
                        border: '1px dashed #C59A5A', 
                        marginBottom: 16 
                      }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', display: 'block' }}>
                          Submitted 12-Digit UTR / Ref Number:
                        </span>
                        <span style={{ fontSize: '1.05rem', fontFamily: 'monospace', fontWeight: 700, color: '#1D1E20', letterSpacing: '0.08em' }}>
                          {item.upiReferenceNumber || 'N/A'}
                        </span>
                      </div>

                      {/* Screenshot Preview */}
                      {item.paymentProofUrl && (
                        <div style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: 6 }}>
                            Uploaded Payment Screenshot:
                          </span>
                          <div 
                            onClick={() => setSelectedProof(item.paymentProofUrl)}
                            style={{ 
                              position: 'relative', 
                              cursor: 'pointer', 
                              borderRadius: 4, 
                              overflow: 'hidden', 
                              height: 120, 
                              border: '1px solid rgba(0,0,0,0.1)' 
                            }}
                          >
                            <img 
                              src={item.paymentProofUrl} 
                              alt="Payment Proof" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ 
                              position: 'absolute', 
                              inset: 0, 
                              backgroundColor: 'rgba(0,0,0,0.3)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: '#FFF',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              gap: 6
                            }}>
                              <Eye className="w-4 h-4" />
                              <span>Click to Expand</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                      <button
                        onClick={() => handleApproveUpi(item.registrationId)}
                        style={{
                          backgroundColor: '#1B6A50',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px',
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setRejectModal({ open: true, regId: item.registrationId, reason: 'Incorrect UTR reference or amount mismatch' })}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#C85A32',
                          border: '1px solid #C85A32',
                          padding: '10px',
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PARTICIPANTS DIRECTORY */}
        {activeTab === 'participants' && (
          <div>
            {/* Filter Bar */}
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              padding: '20px 24px', 
              borderRadius: 4, 
              border: '1px solid rgba(29,30,32,0.08)',
              marginBottom: 24,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <Search className="w-4 h-4 text-gray-400" style={{ position: 'absolute', left: 12, top: 14 }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, email, or Bib number..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 3,
                    border: '1px solid rgba(29,30,32,0.15)',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 3,
                    border: '1px solid rgba(29,30,32,0.15)',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING_VERIFICATION">Pending Verification</option>
                  <option value="INITIATED">Initiated</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 3,
                    border: '1px solid rgba(29,30,32,0.15)',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="21K">21.1 KM Half-Century</option>
                  <option value="10K">10 KM Endurance</option>
                  <option value="5K">5 KM Community Fun</option>
                </select>
              </div>
            </div>

            {/* Participants Table */}
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 4, 
              border: '1px solid rgba(29,30,32,0.08)', 
              overflowX: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8F6F2', borderBottom: '1px solid rgba(29,30,32,0.1)' }}>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Reg ID / Bib</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Participant</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Category</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Age / Gender</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>T-Shirt</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Status</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#444', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px 18px', textAlign: 'center', color: '#888' }}>
                        No participants match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p) => {
                      const isConfirmed = p.status === 'CONFIRMED';
                      const isPending = p.status === 'PENDING_VERIFICATION';

                      return (
                        <tr key={p._id} style={{ borderBottom: '1px solid rgba(29,30,32,0.06)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1D1E20' }}>
                              {p.registrationId}
                            </div>
                            {p.bibNumber && (
                              <span style={{ 
                                display: 'inline-block',
                                fontSize: '0.72rem', 
                                backgroundColor: '#0E1014', 
                                color: '#C59A5A', 
                                padding: '2px 6px', 
                                borderRadius: 2, 
                                fontWeight: 700,
                                marginTop: 4 
                              }}>
                                BIB #{p.bibNumber}
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ fontWeight: 600, color: '#1D1E20' }}>{p.fullName}</div>
                            <div style={{ fontSize: '0.78rem', color: '#777' }}>{p.email}</div>
                            <div style={{ fontSize: '0.78rem', color: '#777' }}>{p.phone}</div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <span style={{ fontWeight: 600 }}>{p.category?.name || p.category?.code}</span>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{p.category?.distanceKm} KM</div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div>{p.ageOnRaceDay} yrs</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>{p.gender}</div>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <span style={{ padding: '2px 8px', backgroundColor: '#F0EBE1', borderRadius: 2, fontWeight: 700, fontSize: '0.8rem' }}>
                              {p.tshirtSize}
                            </span>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: 12, 
                              fontSize: '0.72rem', 
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: isConfirmed ? '#EAF5F0' : isPending ? '#FFF4E5' : '#FDECEA',
                              color: isConfirmed ? '#1B6A50' : isPending ? '#B76E00' : '#C85A32'
                            }}>
                              {p.status}
                            </span>
                          </td>

                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => setSelectedParticipant(p)}
                                title="View Details"
                                style={{ 
                                  backgroundColor: '#FAF7F2', 
                                  border: '1px solid rgba(29,30,32,0.15)', 
                                  padding: '6px 10px', 
                                  borderRadius: 2, 
                                  cursor: 'pointer',
                                  fontSize: '0.78rem' 
                                }}
                              >
                                View
                              </button>

                              {isPending && (
                                <button
                                  onClick={() => handleApproveUpi(p.registrationId)}
                                  title="Approve UPI"
                                  style={{ 
                                    backgroundColor: '#1B6A50', 
                                    color: '#FFF', 
                                    border: 'none', 
                                    padding: '6px 10px', 
                                    borderRadius: 2, 
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    fontWeight: 600
                                  }}
                                >
                                  Verify
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Screenshot Viewer */}
      <AnimatePresence>
        {selectedProof && (
          <div 
            onClick={() => setSelectedProof(null)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(0,0,0,0.85)', 
              zIndex: 10000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 24 
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ maxWidth: 600, width: '100%', backgroundColor: '#15181F', borderRadius: 4, overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', color: '#FFF' }}>
                <span style={{ fontWeight: 600 }}>Payment Screenshot Preview</span>
                <button onClick={() => setSelectedProof(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
              </div>
              <div style={{ padding: 16, backgroundColor: '#000', textAlign: 'center', maxHeight: '75vh', overflow: 'auto' }}>
                <img src={selectedProof} alt="Full Proof" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Participant Full Details Modal */}
      <AnimatePresence>
        {selectedParticipant && (
          <div 
            onClick={() => setSelectedParticipant(null)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              zIndex: 10000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 24 
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                maxWidth: 600, 
                width: '100%', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 4, 
                padding: '32px', 
                maxHeight: '90vh', 
                overflowY: 'auto' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C59A5A', fontWeight: 700 }}>
                    Participant Dossier
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 600 }}>
                    {selectedParticipant.fullName}
                  </h3>
                </div>
                <button onClick={() => setSelectedParticipant(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.9rem', marginBottom: 24 }}>
                <div><strong>Registration ID:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedParticipant.registrationId}</span></div>
                <div><strong>Bib Number:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedParticipant.bibNumber || 'Pending'}</span></div>
                <div><strong>Category:</strong> {selectedParticipant.category?.name || selectedParticipant.category?.code}</div>
                <div><strong>Status:</strong> {selectedParticipant.status}</div>
                <div><strong>Email:</strong> {selectedParticipant.email}</div>
                <div><strong>Phone:</strong> {selectedParticipant.phone}</div>
                <div><strong>Date of Birth:</strong> {selectedParticipant.dateOfBirth ? new Date(selectedParticipant.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Age on Race Day:</strong> {selectedParticipant.ageOnRaceDay} years</div>
                <div><strong>Gender:</strong> {selectedParticipant.gender}</div>
                <div><strong>T-Shirt Size:</strong> {selectedParticipant.tshirtSize}</div>
                <div><strong>City / State:</strong> {selectedParticipant.city || 'Salem'}, {selectedParticipant.state || 'Tamil Nadu'}</div>
                <div><strong>Blood Group:</strong> {selectedParticipant.bloodGroup || 'Not specified'}</div>
              </div>

              {/* Emergency Contact */}
              <div style={{ backgroundColor: '#FAF7F2', padding: 16, borderRadius: 4, marginBottom: 16 }}>
                <h5 style={{ fontWeight: 700, color: '#1D1E20', marginBottom: 6 }}>Emergency Contact</h5>
                <div style={{ fontSize: '0.88rem', color: '#555' }}>
                  Name: <strong>{selectedParticipant.emergencyContact?.name || 'N/A'}</strong> ({selectedParticipant.emergencyContact?.relationship || 'Contact'})<br />
                  Phone: <strong>{selectedParticipant.emergencyContact?.phone || 'N/A'}</strong>
                </div>
              </div>

              {/* Minor Guardian Info */}
              {selectedParticipant.isMinor && (
                <div style={{ backgroundColor: '#FFF9F0', border: '1px solid #C59A5A', padding: 16, borderRadius: 4 }}>
                  <h5 style={{ fontWeight: 700, color: '#8C6830', marginBottom: 6 }}>Minor Participant - Guardian Consent</h5>
                  <div style={{ fontSize: '0.88rem', color: '#555' }}>
                    Guardian: <strong>{selectedParticipant.guardian?.name || 'N/A'}</strong><br />
                    Phone: <strong>{selectedParticipant.guardian?.phone || 'N/A'}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Rejection Modal */}
      <AnimatePresence>
        {rejectModal.open && (
          <div 
            onClick={() => setRejectModal({ open: false, regId: null, reason: '' })}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              zIndex: 10000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 24 
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ maxWidth: 450, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 4, padding: '28px' }}
            >
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#C85A32', marginBottom: 8 }}>
                Reject Payment Proof
              </h3>
              <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: 16 }}>
                State why this transaction was rejected (e.g. wrong UTR, amount mismatch, duplicate reference). An email update will be triggered to the participant.
              </p>

              <textarea 
                rows={3} 
                value={rejectModal.reason} 
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: 3, 
                  border: '1px solid rgba(29,30,32,0.2)', 
                  backgroundColor: '#FAF7F2',
                  fontSize: '0.9rem',
                  outline: 'none',
                  marginBottom: 20 
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  onClick={() => setRejectModal({ open: false, regId: null, reason: '' })}
                  style={{ backgroundColor: 'transparent', border: '1px solid #888', padding: '8px 16px', borderRadius: 2, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectUpi}
                  style={{ backgroundColor: '#C85A32', color: '#FFF', border: 'none', padding: '8px 18px', borderRadius: 2, fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPanel;
