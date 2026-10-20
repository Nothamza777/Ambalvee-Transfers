import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, ArrowRight, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { getGetAdminCaptchaQueryKey, useGetAdminCaptcha } from '@workspace/api-client-react';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, setView } = useStore();
  const captchaQuery = useGetAdminCaptcha({ query: { queryKey: getGetAdminCaptchaQueryKey(), refetchOnWindowFocus: false } });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const captcha = captchaQuery.data || null;
  const captchaLoading = captchaQuery.isLoading || captchaQuery.isFetching;

  const refreshCaptcha = async () => {
    setCaptchaAnswer('');
    try {
      const result = await captchaQuery.refetch();
      if (result.error || !result.data?.id || !result.data.imageDataUrl) {
        throw result.error || new Error('The security challenge could not be loaded.');
      }
      setError(null);
    } catch (challengeError) {
      setError(challengeError instanceof Error
        ? challengeError.message
        : 'The secure sign-in service is unavailable. Try refreshing.');
    }
  };

  useEffect(() => {
    if (captchaQuery.isError) setError('The security challenge could not be loaded. Refresh to try again.');
  }, [captchaQuery.isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!captcha) {
      setLoading(false);
      setError('Load the security challenge before signing in.');
      return;
    }

    const result = await loginAdmin(email, password, captcha.id, captchaAnswer);
    setLoading(false);
    setPassword('');
    setCaptchaAnswer('');
    if (!result.success) {
      setError(result.error || 'Sign-in details or CAPTCHA were not accepted.');
      await refreshCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 via-red-600 to-rose-700 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg shadow-red-950">
            N
          </div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-white">
            Ambalvee Transfers Admin
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in with the administrator credentials configured for this project.
          </p>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Administrator Passkey</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="admin-captcha-answer" className="block text-neutral-300 font-semibold">Security check</label>
              <button
                type="button"
                onClick={() => { setError(null); void refreshCaptcha(); }}
                disabled={captchaLoading || loading}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${captchaLoading ? 'animate-spin' : ''}`} />
                Refresh challenge
              </button>
            </div>
            {captcha ? (
              <img
                src={captcha.imageDataUrl}
                alt="Six-character sign-in challenge"
                className="h-[76px] w-[210px] max-w-full rounded-xl border border-neutral-700 bg-[#f5f0e8]"
              />
            ) : (
              <div className="grid h-[76px] w-[210px] max-w-full place-items-center rounded-xl border border-dashed border-neutral-700 bg-neutral-950 text-[11px] text-neutral-500">
                {captchaLoading ? 'Loading challenge…' : 'Challenge unavailable'}
              </div>
            )}
            <input
              id="admin-captcha-answer"
              type="text"
              required
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={6}
              value={captchaAnswer}
              onChange={event => setCaptchaAnswer(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              placeholder="Enter the six characters"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 font-mono tracking-[0.2em]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || captchaLoading || !captcha}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 text-xs disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back link & Security Notice */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3 text-center text-xs">
          <div className="text-neutral-400 text-[11px] flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span>Five failed attempts trigger a 15-minute sign-in cooldown.</span>
          </div>

          <button
            type="button"
            onClick={() => setView('home')}
            className="text-neutral-400 hover:text-white transition-colors text-[11px]"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
