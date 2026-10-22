import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password, selectedRole);
      navigate(`/${user.role}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleTitle = selectedRole === 'student' ? 'Student' : selectedRole === 'teacher' ? 'Teacher' : 'Administrator';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-7 sm:p-9 shadow-lg">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            EduFlow <span className="text-[#2563EB]">AI</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center mt-5">
          Welcome back
        </h1>
        <p className="text-sm text-[#64748B] text-center mt-1 mb-6">
          Sign in to your EduFlow AI account to continue.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-5 text-center">
            {error}
          </div>
        )}

        {/* Role Selector Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setSelectedRole('teacher')}
            className={`p-4 rounded-lg border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'teacher'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`p-2.5 rounded-full ${selectedRole === 'teacher' ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-[#64748B]'}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Sign in as Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`p-4 rounded-lg border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'student'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`p-2.5 rounded-full ${selectedRole === 'student' ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-[#64748B]'}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Sign in as Student</span>
          </button>
        </div>

        {/* Admin Link option */}
        <div className="text-center mb-6">
          <span className="text-xs text-[#64748B]">Are you an Administrator? </span>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`text-xs font-semibold transition hover:underline cursor-pointer ${
              selectedRole === 'admin' ? 'text-[#2563EB] font-bold underline' : 'text-[#2563EB]'
            }`}
          >
            Sign in as Admin
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Email or Roll Number
            </label>
            <input
              type="text"
              placeholder="e.g. 2312012@nec.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact your administrator to reset your password.'); }} className="text-xs font-semibold text-[#2563EB] hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Signing In...' : `Sign In as ${roleTitle}`}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-sm text-[#64748B] text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2563EB] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
