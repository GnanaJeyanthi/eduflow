import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      navigate(`/${user.role}`);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 409) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(serverMsg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      {/* Main Register Card */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-7 sm:p-9 shadow-lg">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            EduFlow <span className="text-[#2563EB]">AI</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-center mt-5">
          Create account
        </h1>
        <p className="text-sm text-[#64748B] text-center mt-1 mb-6">
          Join EduFlow AI as a Student or Teacher.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-5 text-center">
            {error}
          </div>
        )}

        {/* Role Selector Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-lg border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
              role === 'student'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-full ${role === 'student' ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-[#64748B]'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">I am a Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`p-4 rounded-lg border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
              role === 'teacher'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-full ${role === 'teacher' ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-[#64748B]'}`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">I am a Teacher</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dharshini"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. student@nec.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-sm text-[#64748B] text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
