import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import JourneyTree, { JourneyNodeItem } from '../../components/common/JourneyTree';
import QuizModal from '../../components/common/QuizModal';
import { Sparkles, TrendingUp, BookOpen, Target } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export default function Progress() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [selectedNode, setSelectedNode] = useState<JourneyNodeItem | null>(null);
  const [completingNode, setCompletingNode] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const handleSelectNode = (node: JourneyNodeItem) => {
    const params = new URLSearchParams({
      concept: node.concept || node.title || '',
      title: node.title || '',
      difficulty: node.difficulty || 'medium',
      nodeId: node.id || '',
      type: node.type || '',
      returnUrl: '/student/progress'
    });
    navigate(`/student/quiz?${params.toString()}`);
  };

  useEffect(() => {
    if (user) api.get(`/analytics/student/${user.id}`).then((r) => setData(r.data));
  }, [user]);

  const genRoadmap = async () => {
    setLoadingRoadmap(true);
    try {
      const { data } = await api.post('/ai/generate-roadmap', {});
      setRoadmap(data.roadmap);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleCompleteNode = async (nodeId: string) => {
    if (!nodeId) return;
    setCompletingNode(true);
    try {
      await api.post('/submissions/journey/complete-node', { nodeId });
      await refreshUser();
      if (roadmap) {
        const items = roadmap.actionItems || roadmap.steps || [];
        const currentIdx = items.findIndex((n: any) => n.id === nodeId || `node-step-${n.step}` === nodeId);
        if (currentIdx !== -1 && currentIdx + 1 < items.length) {
          const nextItem = items[currentIdx + 1];
          const nextNodeId = nextItem.id || `node-step-${nextItem.step || currentIdx + 2}`;
          setSelectedNode({
            id: nextNodeId,
            type: 'Skill Node',
            title: nextItem.concept || nextItem.title,
            concept: nextItem.concept || nextItem.title,
            description: nextItem.description || `${nextItem.reason} - ${nextItem.activity}`,
            remediationFocus: nextItem.remediationFocus || nextItem.activity
          });
        } else if (selectedNode) {
          setSelectedNode({ ...selectedNode, completed: true });
        }
      }
    } catch (err) {
      console.error('Failed to complete node:', err);
    } finally {
      setCompletingNode(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Progress & Knowledge Profile</h1>
        <p className="text-sm text-[#64748B] mt-1">Track your performance and conceptual mastery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-[#E2E8F0] pb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#2563EB]" /> Score Trend
            </h2>
          </CardHeader>
          <CardContent className="pt-6">
            {data?.scoreTrend?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.scoreTrend}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: '#E2E8F0' }} contentStyle={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#ffffff', stroke: '#2563EB', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState 
                icon={TrendingUp}
                title="No score data yet"
                description="Complete graded assignments to see your performance trend over time."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-[#E2E8F0] pb-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Target size={16} className="text-[#4F46E5]" /> Concept Mastery
            </h2>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data?.concepts?.map((c: any) => (
                <div key={c.concept}>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-900">{c.concept}</span>
                    <span className="text-[#64748B]">{c.masteryScore}% · Level: {c.level}</span>
                  </div>
                  <div className="h-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${c.masteryScore}%` }} />
                  </div>
                </div>
              ))}
              {(!data?.concepts || data.concepts.length === 0) && (
                <EmptyState 
                  icon={BookOpen}
                  title="No concepts tracked"
                  description="Continue studying and completing assignments to build your knowledge profile."
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Skill Tree */}
      <Card className="bg-[#0F172A] border-[#0F172A] text-white overflow-hidden shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-900/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4F46E5] font-bold">Personalized Learning Roadmap</span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                <Sparkles className="w-5 h-5 text-[#4F46E5]" /> Interactive Skill Tree & Revision Nodes
              </h2>
            </div>
            <Button variant="primary" onClick={genRoadmap} disabled={loadingRoadmap} className="shrink-0 bg-[#4F46E5] hover:bg-[#4338CA] border-0">
              <Sparkles size={16} className="mr-2" /> {loadingRoadmap ? 'Generating...' : 'Generate Skill Tree'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {roadmap ? (
            <div className="max-w-xl mx-auto bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center">
              <JourneyTree
                revisionPlan={roadmap}
                activeNodeId={selectedNode?.id}
                completedNodeIds={user?.completedNodes || []}
                onSelectNode={handleSelectNode}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-[#4F46E5] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-2 text-slate-200">Ready to level up?</h3>
              <p className="text-slate-400 max-w-sm mx-auto text-sm">
                Generate a personalized skill tree based on your exact knowledge gaps and progress data.
              </p>
            </div>
          )}
        </CardContent>

        {/* Dedicated Quiz Modal Overlay */}
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          node={selectedNode}
          onQuizComplete={() => {
            if (selectedNode) handleCompleteNode(selectedNode.id);
          }}
        />
      </Card>
    </div>
  );
}
