import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Logo } from '../common/Logo';
import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
  subscribeToSms,
} from '../../services/smsService';
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  AtSign,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  RotateCcw,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
];

const COUNTRY_CODES = [
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    loginWithEmail,
    loginWithPhone,
    registerUser,
    setShowDevGuideModal,
  } = useMusic();

  // Mode: 'login' | 'signup' | 'phone' | 'forgot' | 'terms'
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'phone' | 'forgot' | 'terms'>(authModalMode);

  // Form states - Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Form states - Sign Up
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCountryCode, setSignupCountryCode] = useState('+977');
  const [signupPhoneNum, setSignupPhoneNum] = useState('');
  const [signupStep, setSignupStep] = useState<'details' | 'verify'>('details');
  const [signupVerificationCode, setSignupVerificationCode] = useState('');
  const [signupResendTimer, setSignupResendTimer] = useState(60);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);

  // Form states - Phone Login
  const [phoneCountryCode, setPhoneCountryCode] = useState('+977');
  const [phoneNum, setPhoneNum] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [phoneResendTimer, setPhoneResendTimer] = useState(60);

  // Forgot password
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Listen for incoming SMS to auto-suggest
  useEffect(() => {
    const unsub = subscribeToSms((event) => {
      if (signupStep === 'verify') {
        setSignupVerificationCode(event.code);
      }
      if (phoneStep === 'verify') {
        setPhoneOtpCode(event.code);
      }
    });
    return unsub;
  }, [signupStep, phoneStep]);

  // Resend Countdown Timer for Sign Up
  useEffect(() => {
    if (signupStep !== 'verify' || signupResendTimer <= 0) return;
    const timer = setInterval(() => {
      setSignupResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [signupStep, signupResendTimer]);

  // Resend Countdown Timer for Phone Sign-in
  useEffect(() => {
    if (phoneStep !== 'verify' || phoneResendTimer <= 0) return;
    const timer = setInterval(() => {
      setPhoneResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phoneStep, phoneResendTimer]);

  if (!showAuthModal) return null;

  const fullSignupPhone = `${signupCountryCode} ${signupPhoneNum.trim()}`;
  const fullLoginPhone = `${phoneCountryCode} ${phoneNum.trim()}`;

  // 1. LOGIN HANDLER
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setErrorMsg(null);
    loginWithEmail(email);
  };

  // 2. SIGN UP: STEP 1 -> SEND CODE TO PHONE
  const handleInitiateSignupPhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !username.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMsg('Please complete your name, username, email, and password.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (!signupPhoneNum.trim() || signupPhoneNum.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile phone number so we can send your verification code.');
      return;
    }

    setIsSendingCode(true);
    try {
      const res = await sendPhoneVerificationCode(fullSignupPhone);
      setSuccessMsg(res.message);
      setSignupStep('verify');
      setSignupResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send verification SMS.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 2. SIGN UP: STEP 2 -> VERIFY CODE & REGISTER
  const handleVerifySignupCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signupVerificationCode.trim()) {
      setErrorMsg('Please enter the 6-digit verification code sent to your phone.');
      return;
    }

    const verification = verifyPhoneCode(fullSignupPhone, signupVerificationCode);
    if (!verification.success) {
      setErrorMsg(verification.message);
      return;
    }

    // Successfully verified!
    registerUser({
      name: fullName.trim(),
      username: username.trim(),
      email: signupEmail.trim(),
      phone: fullSignupPhone,
      phoneVerified: true,
      avatarUrl: selectedAvatar,
    });
  };

  // Resend code in sign up
  const handleResendSignupCode = async () => {
    if (signupResendTimer > 0) return;
    setErrorMsg(null);
    setIsSendingCode(true);
    try {
      const res = await sendPhoneVerificationCode(fullSignupPhone);
      setSuccessMsg(`New code dispatched to ${fullSignupPhone}`);
      setSignupResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend SMS.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 3. PHONE LOGIN: STEP 1 -> SEND CODE
  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!phoneNum.trim() || phoneNum.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile phone number.');
      return;
    }

    setIsSendingCode(true);
    try {
      const res = await sendPhoneVerificationCode(fullLoginPhone);
      setSuccessMsg(res.message);
      setPhoneStep('verify');
      setPhoneResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch SMS.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 3. PHONE LOGIN: STEP 2 -> VERIFY CODE & ENTER
  const handleVerifyLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!phoneOtpCode.trim()) {
      setErrorMsg('Please enter the 6-digit code received via SMS.');
      return;
    }

    const verification = verifyPhoneCode(fullLoginPhone, phoneOtpCode);
    if (!verification.success) {
      setErrorMsg(verification.message);
      return;
    }

    loginWithPhone(fullLoginPhone);
  };

  // Resend code in phone login
  const handleResendLoginOtp = async () => {
    if (phoneResendTimer > 0) return;
    setErrorMsg(null);
    setIsSendingCode(true);
    try {
      const res = await sendPhoneVerificationCode(fullLoginPhone);
      setSuccessMsg(`New code dispatched to ${fullLoginPhone}`);
      setPhoneResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend SMS.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 4. FORGOT PASSWORD
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setErrorMsg('Please enter your recovery email.');
      return;
    }
    setErrorMsg(null);
    setRecoverySent(true);
  };

  return (
    <div
      id="c-town-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#121212] border border-[#282828] rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#282828] flex items-center justify-between bg-[#181818]">
          <Logo size="sm" />
          <button
            id="auth-modal-close-btn"
            onClick={() => setShowAuthModal(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 max-h-[82vh] overflow-y-auto">
          {/* Main Tabs */}
          <div className="flex rounded-full bg-[#181818] p-1 mb-6 border border-[#282828]">
            <button
              onClick={() => {
                setActiveTab('signup');
                setSignupStep('details');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-[#1ed760] text-black font-bold shadow-md'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Sign Up (Phone Code)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setActiveTab('phone');
                setPhoneStep('input');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'phone'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Sign-In</span>
            </button>
          </div>

          {/* Alerts / Error notifications */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#1ed760]/15 border border-[#1ed760]/30 text-[#1ed760] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: SIGN UP WITH PHONE CODE VERIFICATION (USER REQUEST) */}
          {/* ======================================================== */}
          {activeTab === 'signup' && (
            <div>
              {signupStep === 'details' ? (
                <form onSubmit={handleInitiateSignupPhoneVerification} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-[#282828]">
                    <div>
                      <h3 className="text-sm font-bold text-white">Create Account with Phone Verification</h3>
                      <p className="text-[11px] text-[#b3b3b3]">
                        We will send a live 6-digit SMS verification code to your phone
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#1ed760]/15 text-[#1ed760] text-[10px] font-mono font-bold">
                      Step 1 of 2
                    </span>
                  </div>

                  {/* Profile Avatar Selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Choose Avatar</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedAvatar}
                        alt="Current Avatar"
                        className="w-11 h-11 rounded-full ring-2 ring-[#1ed760] object-cover"
                      />
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {AVATAR_PRESETS.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt="Avatar choice"
                            onClick={() => setSelectedAvatar(url)}
                            className={`w-8 h-8 rounded-full object-cover cursor-pointer transition-all ${
                              selectedAvatar === url ? 'ring-2 ring-[#1ed760] scale-105' : 'opacity-60 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Anish Sharma"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="anish_music"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="name@email.com"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* PHONE NUMBER FIELD WITH COUNTRY CODE SELECTOR */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mobile Phone Number <span className="text-[#1ed760]">* (Required for SMS Code)</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={signupCountryCode}
                        onChange={(e) => setSignupCountryCode(e.target.value)}
                        className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1ed760] cursor-pointer shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#181818] text-white">
                            {c.flag} {c.code} ({c.country})
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="tel"
                          value={signupPhoneNum}
                          onChange={(e) => setSignupPhoneNum(e.target.value)}
                          placeholder="9801234567"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500 font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      We will dispatch a real 6-digit SMS verification code to <span className="text-white font-mono">{fullSignupPhone}</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <button
                    id="signup-send-sms-btn"
                    type="submit"
                    disabled={isSendingCode}
                    className="w-full py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-95 text-black font-bold text-xs sm:text-sm shadow-lg shadow-[#1ed760]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSendingCode ? (
                      <span>Sending SMS Code...</span>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Send SMS Code to Phone</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* SIGN UP STEP 2: VERIFY CODE */
                <form onSubmit={handleVerifySignupCode} className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-[#282828]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSignupStep('details')}
                        className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Edit Phone Number"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="text-sm font-bold text-white">Enter Phone Verification Code</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#1ed760]/15 text-[#1ed760] text-[10px] font-mono font-bold">
                      Step 2 of 2
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181818] border border-[#282828] text-xs space-y-1.5">
                    <p className="text-[#b3b3b3]">
                      We sent an SMS with a 6-digit verification code to:
                    </p>
                    <p className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#1ed760]" />
                      <span>{fullSignupPhone}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Check your notifications or the carrier SMS banner at the top of your screen.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                      6-Digit SMS Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={signupVerificationCode}
                      onChange={(e) => setSignupVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      autoFocus
                      className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl bg-black/60 border border-[#1ed760]/40 focus:outline-none focus:border-[#1ed760] text-white shadow-inner"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Didn't receive the SMS?</span>
                    <button
                      type="button"
                      onClick={handleResendSignupCode}
                      disabled={signupResendTimer > 0 || isSendingCode}
                      className={`font-semibold transition-colors flex items-center gap-1 ${
                        signupResendTimer > 0
                          ? 'text-slate-500 cursor-not-allowed'
                          : 'text-[#1ed760] hover:underline'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>
                        {signupResendTimer > 0 ? `Resend Code in ${signupResendTimer}s` : 'Resend SMS Code'}
                      </span>
                    </button>
                  </div>

                  <button
                    id="signup-verify-btn"
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-95 text-black font-bold text-sm shadow-lg shadow-[#1ed760]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code &amp; Complete Sign-Up</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setSignupStep('details')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Change phone number or details
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SIGN IN (EMAIL & PASSWORD) */}
          {/* ======================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="login-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-[#1ed760] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="login-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#1ed760] focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-95 text-black font-bold text-sm shadow-lg shadow-[#1ed760]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to C-Town</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setSignupStep('details');
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Don't have an account? <span className="text-[#1ed760] font-semibold">Sign Up with Phone Code</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PHONE OTP SIGN IN */}
          {/* ======================================================== */}
          {activeTab === 'phone' && (
            <div>
              {phoneStep === 'input' ? (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Sign In via Phone Number</h3>
                    <p className="text-xs text-[#b3b3b3] mb-3">
                      Enter your mobile phone number and we will send you a 6-digit code.
                    </p>

                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Phone Number</label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="px-2.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1ed760] cursor-pointer shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#181818] text-white">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value)}
                          placeholder="9801234567"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#1ed760] text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingCode}
                    className="w-full py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-95 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send 6-Digit SMS Code</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#181818] border border-[#282828] text-xs space-y-1">
                    <p className="text-[#b3b3b3]">SMS Code dispatched to:</p>
                    <p className="font-bold text-white font-mono text-sm">{fullLoginPhone}</p>
                    <p className="text-[11px] text-slate-400">
                      Check your phone notification banner or messages.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 text-center">
                      Enter Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      autoFocus
                      className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl bg-black/60 border border-[#1ed760]/40 focus:outline-none focus:border-[#1ed760] text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Need another code?</span>
                    <button
                      type="button"
                      onClick={handleResendLoginOtp}
                      disabled={phoneResendTimer > 0 || isSendingCode}
                      className={`font-semibold ${
                        phoneResendTimer > 0 ? 'text-slate-500' : 'text-[#1ed760] hover:underline'
                      }`}
                    >
                      {phoneResendTimer > 0 ? `Resend in ${phoneResendTimer}s` : 'Resend SMS'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-95 text-black font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Verify &amp; Enter C-Town
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('input')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Change phone number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: FORGOT PASSWORD */}
          {/* ======================================================== */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Reset Your Password</h3>
              <p className="text-xs text-[#b3b3b3]">
                Enter your registered email address and we'll send an account recovery link with reset instructions.
              </p>

              {recoverySent ? (
                <div className="p-4 rounded-xl bg-[#1ed760]/15 border border-[#1ed760]/30 text-[#1ed760] text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    Password reset link sent to <strong>{recoveryEmail}</strong>. Please check your inbox or spam folder.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="your-email@domain.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#1ed760] text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold text-sm transition-all cursor-pointer"
                  >
                    Send Recovery Link
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-[#1ed760] hover:underline block text-center w-full"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* TAB 5: TERMS & PRIVACY */}
          {activeTab === 'terms' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white">C-TOWN Terms &amp; Privacy</h3>
              <div className="p-3 bg-white/5 rounded-xl space-y-2 border border-white/5 text-[11px] leading-relaxed">
                <p>
                  <strong>1. Zero Ads Guarantee:</strong> C-TOWN is strictly ad-free. We never display commercial banner
                  ads or interstitial popups.
                </p>
                <p>
                  <strong>2. Privacy Protection:</strong> Your phone number is strictly used for one-time verification
                  codes and security. We never sell or share user data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-xs text-[#1ed760] hover:underline block text-center w-full pt-2"
              >
                Return to Account Registration
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#181818] border-t border-[#282828] flex items-center justify-between text-[11px] text-[#b3b3b3]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1ed760]" />
            <span>Secure 256-bit Phone Verification</span>
          </span>
          <button
            onClick={() => {
              setShowDevGuideModal(true);
              setShowAuthModal(false);
            }}
            className="text-[#1ed760] hover:underline flex items-center gap-1 font-medium"
          >
            <span>SMS &amp; Auth Config</span>
          </button>
        </div>
      </div>
    </div>
  );
};
