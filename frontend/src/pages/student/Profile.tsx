import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Edit3, Settings, Shield, Award, 
  Book, Zap, Target, Flame, ArrowRight,
  LogOut, Star, CheckCircle, Clock, Sparkles
} from 'lucide-react';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLevelString = (level?: number) => {
    if (!level) return 'Beginner';
    if (level < 5) return 'Beginner';
    if (level < 15) return 'Intermediate';
    return 'Advanced';
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* 1. PROFILE HERO / HEADER */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-3xl shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Student Name'}</h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                <Sparkles size={12} />
                AI Learner
              </span>
            </div>
            <div className="text-slate-500 font-medium capitalize mb-1">{user?.role || 'Student'}</div>
            <div className="text-slate-400 text-sm">{user?.email || 'student@example.com'}</div>
          </div>
        </div>
        <button className="btn-secondary px-5 py-2.5 text-sm shrink-0">
          <Edit3 size={16} /> Edit Profile
        </button>
      </section>

      {/* 2. LEARNING IDENTITY */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 px-1">Your Learning Identity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Star size={20} />
            </div>
            <div className="text-sm text-slate-500 mb-1 font-medium">Learning Level</div>
            <div className="text-xl font-extrabold text-slate-900">{getLevelString(user?.level)}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
              <Flame size={20} />
            </div>
            <div className="text-sm text-slate-500 mb-1 font-medium">Current Streak</div>
            <div className="text-xl font-extrabold text-slate-900">{user?.streak || 5} Days</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <div className="text-sm text-slate-500 mb-1 font-medium">XP Earned</div>
            <div className="text-xl font-extrabold text-slate-900">{user?.xp || 420} XP</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle size={20} />
            </div>
            <div className="text-sm text-slate-500 mb-1 font-medium">Concepts Mastered</div>
            <div className="text-xl font-extrabold text-slate-900">24</div>
          </div>
        </div>
      </section>

      {/* 3. PROFILE INFORMATION */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 px-1">Personal Information</h2>
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative">
          <button className="absolute top-6 right-6 text-slate-400 hover:text-blue-600 transition-colors p-2 bg-slate-50 rounded-full hover:bg-blue-50">
            <Edit3 size={16} />
          </button>
          <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Full Name</div>
              <div className="text-slate-900 font-medium">{user?.name || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Email</div>
              <div className="text-slate-900 font-medium">{user?.email || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Role</div>
              <div className="text-slate-900 font-medium capitalize">{user?.role || 'Student'}</div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Account Created</div>
              <div className="text-slate-900 font-medium">September 2023</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Learning Goal</div>
              <div className="text-slate-900 font-medium">Mastering Full-Stack Web Development & Artificial Intelligence</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LEARNING PREFERENCES */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 px-1">Learning Preferences</h2>
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Book size={18} className="text-blue-600" /> Preferred Style
              </h3>
              {['Visual', 'Reading', 'Practice'].map((style, i) => (
                <div key={style} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${i === 2 ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                  <span className={`font-medium ${i === 2 ? 'text-blue-700' : 'text-slate-700'}`}>{style}</span>
                  {i === 2 && <CheckCircle size={16} className="text-blue-600" />}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Target size={18} className="text-blue-600" /> Study Goal
              </h3>
              {['Improve Programming', 'Prepare for Exams', 'Build Projects', 'Career Preparation'].map((goal, i) => (
                <div key={goal} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${i === 0 ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                  <span className={`text-sm font-medium ${i === 0 ? 'text-blue-700' : 'text-slate-700'}`}>{goal}</span>
                  {i === 0 && <CheckCircle size={16} className="text-blue-600" />}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Clock size={18} className="text-blue-600" /> Daily Target
              </h3>
              {['30 min', '1 hour', '2 hours'].map((time, i) => (
                <div key={time} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${i === 1 ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                  <span className={`font-medium ${i === 1 ? 'text-blue-700' : 'text-slate-700'}`}>{time}</span>
                  {i === 1 && <CheckCircle size={16} className="text-blue-600" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACHIEVEMENTS */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 px-1">Achievements</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-3">🔥</div>
              <h3 className="font-bold text-slate-900 mb-1">First Streak</h3>
              <p className="text-xs text-slate-500">Completed your first learning streak</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-slate-900 mb-1">XP Starter</h3>
              <p className="text-xs text-slate-500">Earned your first 100 XP</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-slate-900 mb-1">Concept Explorer</h3>
              <p className="text-xs text-slate-500">Completed your first concept</p>
            </div>
          </div>

          {/* Locked Achievement */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 border-dashed relative overflow-hidden">
            <div className="opacity-50">
              <div className="text-3xl mb-3 grayscale">🎯</div>
              <h3 className="font-bold text-slate-600 mb-1">Consistent Learner</h3>
              <p className="text-xs text-slate-500">Maintained a 10-day streak</p>
            </div>
            <div className="absolute top-4 right-4 px-2 py-0.5 bg-slate-200 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">Locked</div>
          </div>
        </div>
      </section>

      {/* 6. ACCOUNT & SECURITY */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 px-1">Account & Security</h2>
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 mb-0.5">Authentication</div>
                <div className="text-sm text-slate-500">Standard Email / Password</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 mb-0.5">Account Status</div>
                <div className="text-sm text-emerald-600 font-medium">Active</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 mb-0.5">Last Activity</div>
                <div className="text-sm text-slate-500">Today, just now</div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-medium text-sm"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* 7. AI LEARNING INSIGHT */}
      <section className="bg-blue-50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-extrabold text-blue-900 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" /> 
            Your AI Learning Insight
          </h2>
          <p className="text-blue-800/80 max-w-3xl leading-relaxed">
            "You're building a consistent learning habit. Keep your momentum going and focus on strengthening the concepts you're currently practicing. Your visual learning preference suggests watching more lecture snippets might boost your retention."
          </p>
        </div>
        <div className="shrink-0">
          <Link to="/student/progress" className="btn-primary py-2.5 px-5 bg-blue-600 hover:bg-blue-700 shadow-sm text-sm">
            View My Progress <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
