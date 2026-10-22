import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, BookOpen, FolderKanban, BarChart3, Users, ShieldCheck, Sparkles, Home, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV: Record<string, { to: string; label: string; icon: any }[]> = {
  student: [
    { to: '/', label: 'Home', icon: Home },
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'Profile', icon: User },
    { to: '/student/assignments', label: 'Assignments', icon: BookOpen },
    { to: '/student/workspaces', label: 'Study Workspace', icon: FolderKanban },
    { to: '/student/progress', label: 'Progress', icon: BarChart3 }
  ],
  teacher: [
    { to: '/', label: 'Home', icon: Home },
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/profile', label: 'Profile', icon: User },
    { to: '/teacher/classes', label: 'Classes', icon: Users },
    { to: '/teacher/submissions', label: 'Submissions', icon: BookOpen }
  ],
  admin: [
    { to: '/', label: 'Home', icon: Home },
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/profile', label: 'Profile', icon: User },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/ai-usage', label: 'AI Usage', icon: ShieldCheck }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = user ? NAV[user.role] : [];

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex text-slate-700 font-sans relative overflow-hidden">
      {/* Global Ambient Glows (Behind everything) */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-sky-300/35 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-indigo-300/25 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      {/* Flowing background accent lines (SVG) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,200 Q400,100 800,300 T1600,200" fill="none" stroke="currentColor" className="text-blue-200" strokeWidth="1" strokeDasharray="5,5" />
          <path d="M0,600 Q600,400 1000,700 T2000,500" fill="none" stroke="currentColor" className="text-indigo-200" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white/90 backdrop-blur-xl flex flex-col justify-between hidden md:flex shadow-slate-200/60 shadow-lg z-20">
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              EduFlow AI
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 py-6 space-y-1.5 flex-1 overflow-y-auto">
            {items.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || (to !== '/' && to !== `/${user?.role}` && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl overflow-hidden group ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-r-md"></div>
                  )}
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} />
                  {label}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl overflow-hidden group text-slate-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-5 border-t border-slate-200/80 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden w-full">
             <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 font-bold shrink-0">
               {user?.name?.charAt(0).toUpperCase()}
             </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-900 truncate">{user?.name}</span>
              <span className="text-xs text-slate-500 truncate capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Navbar Header */}
        <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-3">
             <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
             </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {user?.role} Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user && user.role === 'student' && (
              <div className="flex items-center gap-4 text-sm font-bold text-slate-700 bg-slate-800 text-white px-4 py-1.5 rounded-full shadow-md">
                <div className="flex items-center gap-1.5" title="Daily Streak">
                  <span className="text-amber-400 text-lg leading-none">🔥</span>
                  <span>{user.streak || 5}</span>
                </div>
                <div className="w-[1px] h-4 bg-slate-600" />
                <div className="flex items-center gap-1.5" title="Total Experience Points">
                  <span className="text-cyan-400 text-lg leading-none">⚡</span>
                  <span>{user.xp || 420} XP</span>
                </div>
                <div className="w-[1px] h-4 bg-slate-600" />
                <div className="flex items-center gap-1.5 text-emerald-400" title="Current Level">
                  <span className="text-[10px] uppercase tracking-wider opacity-80">Lvl</span>
                  <span>{user.level || 3}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}



