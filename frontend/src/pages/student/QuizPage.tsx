import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trophy, CheckCircle } from 'lucide-react';
import QuizPanel from '../../components/common/QuizPanel';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  // Extract query or location state parameters
  const state = location.state || {};
  const concept = searchParams.get('concept') || state.concept || 'Programming Logic';
  const title = searchParams.get('title') || state.title || concept;
  const difficulty = (searchParams.get('difficulty') || state.difficulty || 'medium') as 'easy' | 'medium' | 'hard' | 'expert';
  const misconception = searchParams.get('misconception') || state.misconception;
  const context = searchParams.get('context') || state.context;
  const nodeId = searchParams.get('nodeId') || state.nodeId;
  const returnUrl = searchParams.get('returnUrl') || state.returnUrl || '/student/progress';
  const nodeType = searchParams.get('type') || state.type || `Node • ${difficulty.toUpperCase()}`;

  const [completed, setCompleted] = React.useState(false);

  const handleQuizComplete = async () => {
    setCompleted(true);
    await refreshUser();
    if (nodeId) {
      try {
        await api.post('/submissions/journey/complete-node', { nodeId });
        await refreshUser();
      } catch (err) {
        console.error('Failed to complete node on backend:', err);
      }
    }
  };

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-blue-50 text-[#2563EB] border-blue-200',
    hard: 'bg-purple-50 text-purple-700 border-purple-200',
    expert: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
        <Button variant="secondary" onClick={() => navigate(returnUrl)}>
          <ArrowLeft size={16} className="mr-1.5" /> Back to Skill Tree
        </Button>

        <div className="flex items-center gap-3">
          <span className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${difficultyColors[difficulty] || difficultyColors.medium}`}>
            {nodeType}
          </span>
          <span className="hidden md:inline text-sm font-medium text-[#64748B]">
            Remediation Practice Mode
          </span>
        </div>
      </div>

      {/* Challenge Header Banner */}
      <Card className="bg-[#0F172A] border-[#0F172A] overflow-hidden">
        <CardContent className="p-6 sm:p-8 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2563EB]" />
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Targeted Practice Node</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Complete the interactive questions below to master <strong className="text-blue-300">{concept}</strong> and unlock the next node on your learning path.
              </p>
            </div>

            <div className="shrink-0 hidden sm:flex flex-col items-end">
              <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full font-mono font-bold flex items-center gap-1.5">
                <Trophy size={15} /> +50 XP
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Banner */}
      {completed && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-800">Node Mastered! +50 XP Awarded</h3>
                <p className="text-sm text-emerald-600 mt-0.5">
                  Awesome effort! You've unlocked the next node on your learning journey.
                </p>
              </div>
            </div>
            <Button variant="primary" onClick={() => navigate(returnUrl)} className="bg-emerald-600 hover:bg-emerald-700 border-emerald-700 shrink-0">
              Continue Learning Path →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quiz Panel Container */}
      <Card className="bg-[#0F172A] border-[#0F172A] text-white overflow-hidden shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <QuizPanel
            key={`${concept}-${difficulty}`}
            targetConcept={concept}
            misconception={misconception}
            context={context}
            difficulty={difficulty}
            onQuizComplete={handleQuizComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
