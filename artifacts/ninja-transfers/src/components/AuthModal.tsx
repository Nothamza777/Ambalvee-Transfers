import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getWebsiteCopy } from '../data/siteCopy';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    registerUser,
    loginUser,
    websiteSettings,
    checkoutLoginRequired,
    clearCheckoutLoginRequirement
  } = useStore();
  const copy = (key: string, fallback: string) => getWebsiteCopy(websiteSettings.siteCopy, key, fallback);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (authModalMode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      const res = registerUser(name, email, password);
      setLoading(false);

      if (res.success) {
        setAuthModalMode('login');
        setPassword('');
        setConfirmPassword('');
        setName('');
         setNotice(checkoutLoginRequired
           ? 'Your account has been created. Sign in to continue checkout.'
           : copy('auth.register.success', 'Your account has been created. Sign in with your new email and password.'));
      } else {
        setError(res.error || 'Registration failed.');
      }
    } else {
      setLoading(true);
      const res = loginUser(email, password);
      setLoading(false);

      if (res.success) {
        setNotice(null);
        setAuthModalOpen(false);
      } else {
        setError(res.error || 'Login failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 relative">
          <button
            onClick={() => {
              setNotice(null);
              clearCheckoutLoginRequirement();
              setAuthModalOpen(false);
            }}
            className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#c83220] flex items-center justify-center text-white font-black text-sm">
              A
            </div>
            <span className="font-extrabold uppercase tracking-tight text-sm">
              {websiteSettings.brandName}
            </span>
          </div>

          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            {authModalMode === 'login'
              ? copy('auth.login.heading', 'Sign In to Your Account')
              : copy('auth.register.heading', 'Create Free Printmaker Account')}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {authModalMode === 'login'
              ? copy('auth.login.description', 'Access saved gang sheets, past orders, and prepress proof files.')
              : copy('auth.register.description', 'Join 500,000+ creators for wholesale pricing and saved artwork history.')}
          </p>
        </div>

        {checkoutLoginRequired && (
          <div role="status" className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-900">
            Sign in or create an account before placing your order. The order will be assigned to your account email.
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthModalMode('login'); setError(null); setNotice(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {copy('auth.tab.signIn', 'Sign In')}
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('register'); setError(null); setNotice(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {copy('auth.tab.register', 'Create Account')}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">{copy('auth.field.name', 'Full Name *')}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            )}

            <div>
                <label className="block text-neutral-700 font-semibold mb-1">{copy('auth.field.email', 'Email Address *')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
                <label className="block text-neutral-700 font-semibold mb-1">{copy('auth.field.password', 'Password *')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">{copy('auth.field.confirmPassword', 'Confirm Password *')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
                  <span>{authModalMode === 'login'
                    ? copy('auth.submit.signIn', 'Sign In')
                    : copy('auth.submit.register', 'Create Free Account')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
