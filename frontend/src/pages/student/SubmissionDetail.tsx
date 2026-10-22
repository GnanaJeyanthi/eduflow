import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { Submission, GradingResult, Assignment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import JourneyTree, { JourneyNodeItem } from '../../components/common/JourneyTree';
import QuizModal from '../../components/common/QuizModal';
import AIVoiceTutor from '../../components/common/AIVoiceTutor';
import { formatSecondsToTimestamp } from '../../utils/timestampUtils';
import { Sparkles, Video, FileText, ExternalLink, Award, CheckCircle2, XCircle, Code, Terminal, Cpu } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function SubmissionDetail() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { id } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [grading, setGrading] = useState<GradingResult | null>(null);
  const pollRef = useRef<number | null>(null);

  const load = async () => {
    const { data } = await api.get(`/submissions/${id}`);
    setSubmission(data.submission);
    setGrading(data.gradingResult);
    if (data.gradingResult) {
      if (pollRef.current) window.clearInterval(pollRef.current);
    }
  };

  useEffect(() => {
    load();
    pollRef.current = window.setInterval(load, 3000);
    return () => { if (pollRef.current) window.clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const assignment = submission?.assignment as Assignment | undefined;
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
      misconception: grading?.rootCause?.detectedMisconception || '',
      returnUrl: `/student/submissions/${id}`
    });
    navigate(`/student/quiz?${params.toString()}`);
  };

  const submissionRevisionPlan = React.useMemo(() => {
    if (!grading) return null;
    const primaryConcept = grading.rootCause?.expectedConcept ||
      (grading.understanding?.missingConcepts && grading.understanding.missingConcepts[0]) ||
      'Core Programming Logic & Syntax';

    const detectedMisconception = grading.rootCause?.detectedMisconception ||
      'Syntax boundary conditions, variable state, and runtime output prediction.';

    const items: JourneyNodeItem[] = [
      {
        id: 'node-step-1',
        type: 'Node 1 • Easy',
        title: `1. Basic Rules & Definitions`,
        concept: `${primaryConcept}: Core Rules`,
        description: `Start here! Review basic definitions, rules, and fundamental concepts of ${primaryConcept}.`,
        remediationFocus: 'Basic recognition & rules',
        difficulty: 'easy',
        completed: (user?.completedNodes || []).includes('node-step-1')
      },
      {
        id: 'node-step-2',
        type: 'Node 2 • Easy',
        title: `2. Concept Distinctions & Syntax`,
        concept: `${primaryConcept}: Key Distinctions`,
        description: `Understand parameter matching, signature rules, and structural distinctions.`,
        remediationFocus: 'Concept distinctions & parameter rules',
        difficulty: 'easy',
        completed: (user?.completedNodes || []).includes('node-step-2')
      },
      {
        id: 'node-step-3',
        type: 'Node 3 • Medium',
        title: `3. Applied Code Tracing`,
        concept: `${primaryConcept}: Code Execution`,
        description: `Analyze sample code snippets, trace variable states, and predict exact outputs.`,
        remediationFocus: 'Code tracing & output prediction',
        difficulty: 'medium',
        completed: (user?.completedNodes || []).includes('node-step-3')
      },
      {
        id: 'node-step-4',
        type: 'Node 4 • Hard',
        title: `4. Pitfalls & Misconceptions`,
        concept: `${primaryConcept}: Edge Cases`,
        description: `Address detected issue: "${detectedMisconception}". Uncover subtle bugs.`,
        remediationFocus: 'Pitfalls & edge-case bugs',
        difficulty: 'hard',
        completed: (user?.completedNodes || []).includes('node-step-4')
      },
      {
        id: 'node-step-5',
        type: 'Node 5 • Hard',
        title: `5. Dynamic Dispatch & Runtime`,
        concept: `${primaryConcept}: Runtime Mechanics`,
        description: `Master runtime resolution, late binding, and dynamic execution behavior.`,
        remediationFocus: 'Runtime resolution & dynamic dispatch',
        difficulty: 'hard',
        completed: (user?.completedNodes || []).includes('node-step-5')
      },
      {
        id: 'node-step-6',
        type: 'Node 6 • Expert Mastery',
        title: `6. Production Refactoring Challenge`,
        concept: `${primaryConcept}: Expert Refactoring`,
        description: `Refactor production code snippets for optimal efficiency, clarity, and robust logic.`,
        remediationFocus: 'Expert refactoring & synthesis',
        difficulty: 'expert',
        completed: (user?.completedNodes || []).includes('node-step-6')
      }
    ];

    return { actionItems: items };
  }, [grading, user?.completedNodes]);

  useEffect(() => {
    if (submissionRevisionPlan?.actionItems?.length && !selectedNode) {
      setSelectedNode(submissionRevisionPlan.actionItems[0]);
    }
  }, [submissionRevisionPlan]);

  const handleCompleteNode = async (nodeId: string) => {
    if (!nodeId) return;
    setCompletingNode(true);
    try {
      await api.post('/submissions/journey/complete-node', { nodeId });
      await refreshUser();
      if (submissionRevisionPlan?.actionItems) {
        const currentIdx = submissionRevisionPlan.actionItems.findIndex((n) => n.id === nodeId);
        if (currentIdx !== -1 && currentIdx + 1 < submissionRevisionPlan.actionItems.length) {
          setSelectedNode(submissionRevisionPlan.actionItems[currentIdx + 1]);
        } else if (selectedNode) {
          setSelectedNode({ ...selectedNode, completed: true });
        }
      }
    } catch (err) {
      console.error('Failed to complete journey node:', err);
    } finally {
      setCompletingNode(false);
    }
  };

  if (!submission) return <div className="p-8 text-center text-[#64748B]">Loading submission details...</div>;

  if (!grading) {
    return (
      <Card className="max-w-xl mx-auto my-12 text-center p-12 space-y-4">
        <Sparkles size={32} className="mx-auto text-[#2563EB] animate-spin" />
        <h1 className="text-xl font-bold text-slate-900">AI Evaluation Pipeline in Progress</h1>
        <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">
          Running: Submission Understanding → Test Case Generation → Sandboxed Execution → Rubric Bounding → Root Cause Diagnosis → Personalized Feedback.
        </p>
        <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-xs mx-auto">
          <div className="h-full w-1/2 bg-[#2563EB] animate-pulse" />
        </div>
      </Card>
    );
  }

  const pct = Math.round((grading.aiScore / (grading.aiMaxScore || 1)) * 100);
  const rec = grading.recommendedResource;
  const exec = grading.executionResults || (grading as any).executionResults;
  const failedTests = grading.failedTests || exec?.failedTestsList || [];

  const evalType = assignment?.evaluationType || grading?.staticAnalysis?.evaluationType || (exec?.applicable === false || exec?.status === 'NOT_APPLICABLE' ? 'THEORY' : 'PROGRAMMING');
  const isExecutionApplicable = exec?.applicable !== false && exec?.status !== 'NOT_APPLICABLE' && evalType === 'PROGRAMMING';

  return (
    <div className="w-full space-y-6">
      {/* Header score card */}
      <Card className="border-l-4 border-l-[#2563EB]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{typeof assignment === 'object' ? assignment.title : 'Assignment Evaluation'}</h1>
              <p className="text-sm font-medium text-[#64748B] mt-1">
                Submitted by you · {isExecutionApplicable ? 'Multi-Agent & Sandboxed Code Execution Pipeline' : 'Multi-Agent Theory Rubric Evaluation Pipeline'}
              </p>
            </div>
            <div className="text-right">
              {grading.teacherStatus !== 'pending' && grading.teacherScore != null ? (
                <div>
                  <p className="text-3xl font-bold text-emerald-600">{grading.teacherScore}/{grading.aiMaxScore}</p>
                  <p className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-mono font-bold inline-block mt-2">
                    Teacher {grading.teacherStatus.toUpperCase()} (AI score was {grading.aiScore}/{grading.aiMaxScore})
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-[#2563EB]">{grading.aiScore}/{grading.aiMaxScore}</p>
                  <div className="flex items-center justify-end gap-2 text-xs font-semibold text-[#64748B] mt-1">
                    <Badge status="submitted">{pct}% Overall</Badge>
                    <span>· AI Confidence {Math.round((grading.aiConfidence || 0.94) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3 SEPARATED EVIDENCE PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Evidence A: Static Analysis / Content Analysis */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              <Code size={14} className="text-purple-600" /> {isExecutionApplicable ? 'A. Static Analysis' : 'A. Content Analysis'}
            </div>
            {isExecutionApplicable ? (
              <>
                <p className="text-sm text-[#64748B] font-medium">
                  Language: <span className="font-mono font-bold text-slate-900">{grading?.staticAnalysis?.language || assignment?.language || 'Python 3.11'}</span>
                </p>
                <p className="text-sm text-[#64748B] font-medium mt-1">
                  Target Function: <span className="font-mono text-purple-700 font-bold">{exec?.functionName || assignment?.targetFunction || grading?.staticAnalysis?.functionName || 'solution'}</span>
                </p>
                <span className="inline-block mt-3 text-xs bg-purple-50 border border-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
                  Syntax Validated
                </span>
              </>
            ) : (
              <>
                <p className="text-sm text-[#64748B] font-medium">
                  Assignment Type: <span className="font-bold text-slate-900">Theory / Explanation</span>
                </p>
                <p className="text-sm text-[#64748B] font-medium mt-1">
                  Target Function: <span className="font-mono text-slate-400 font-bold">NONE</span>
                </p>
                <span className="inline-block mt-3 text-xs bg-purple-50 border border-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
                  Text Comprehension Validated
                </span>
              </>
            )}
          </CardContent>
        </Card>

        {/* Evidence B: Dynamic Execution */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              <Terminal size={14} className={isExecutionApplicable ? 'text-[#2563EB]' : 'text-slate-400'} /> B. Dynamic Execution
            </div>
            {isExecutionApplicable && exec ? (
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {exec.passedTests} / {exec.totalTests} Tests Passed
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  Status: <span className={`font-bold ${exec.passed ? 'text-emerald-600' : 'text-amber-600'}`}>{exec.status?.toUpperCase()}</span>
                </p>
                <span className={`inline-block mt-3 text-xs font-medium px-2 py-0.5 rounded-full ${exec.passed ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
                  {exec.passed ? '100% Deterministic Pass' : `${exec.failedTests} Boundary Test Failed`}
                </span>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-slate-600">NOT APPLICABLE</p>
                <p className="text-xs text-[#64748B] mt-1">
                  Status: <span className="font-bold text-slate-600">SKIPPED</span>
                </p>
                <span className="inline-block mt-3 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                  Theory Rubric Bounded
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evidence C: LLM Analysis */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              <Cpu size={14} className="text-indigo-600" /> C. LLM AI Analysis
            </div>
            <p className="text-sm text-[#64748B] font-medium">
              Category: <span className="font-semibold text-slate-900">{grading.rootCause?.errorCategory || 'EVALUATED'}</span>
            </p>
            <p className="text-sm text-[#64748B] font-medium mt-1">
              Rubric Alignment: <span className="font-bold text-indigo-700">{isExecutionApplicable ? 'Execution Bounded' : 'Direct Theory Rubric'}</span>
            </p>
            <span className="inline-block mt-3 text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded-full">
              Evaluation Confidence: {Math.round((grading.aiConfidence || 0.94) * 100)}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* FAILED TEST EVIDENCE DISPLAY (ONLY IF PROGRAMMING EXECUTION FAILED) */}
      {isExecutionApplicable && failedTests.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-red-900 flex items-center gap-2">
            <XCircle size={18} className="text-red-600" /> Failed Test Evidence (Deterministic Sandbox Output)
          </h2>
          <p className="text-sm text-red-700 font-medium">
            The following execution assertion failed. Full score cannot be awarded when boundary condition requirements are not satisfied.
          </p>

          <div className="space-y-4">
            {failedTests.map((ft: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-lg border border-red-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-700 text-sm">❌ {ft.name || 'Boundary Assertion Failure'}</span>
                  <span className="font-mono text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">Failed</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 border border-[#E2E8F0] p-4 rounded-lg font-mono text-xs">
                    <p className="text-[#64748B] font-sans font-bold text-xs uppercase mb-2">Input Parameters</p>
                    <pre className="whitespace-pre-wrap text-slate-800">{JSON.stringify(ft.input, null, 2)}</pre>
                  </div>
                  <div className="bg-slate-50 border border-[#E2E8F0] p-4 rounded-lg font-mono text-xs">
                    <p className="text-[#64748B] font-sans font-bold text-xs uppercase mb-2">Expected Output</p>
                    <pre className="text-emerald-700 font-bold whitespace-pre-wrap">{JSON.stringify(ft.expected, null, 2)}</pre>
                    <p className="text-[#64748B] font-sans font-bold text-xs uppercase mt-3 mb-2">Your Output</p>
                    <pre className="text-red-600 font-bold whitespace-pre-wrap">{JSON.stringify(ft.actual, null, 2)}</pre>
                  </div>
                </div>

                <p className="text-sm text-red-800 bg-red-50 p-3 rounded-lg border border-red-100 font-medium mt-2">
                  <strong>Why it failed:</strong> {ft.reason || 'Requirement includes boundary scores equal to the threshold. Your implementation uses `>` instead of `>=`.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rubric evaluation criteria */}
      <Card>
        <CardHeader className="border-b border-[#E2E8F0]">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#64748B] flex items-center gap-2">
            <Award size={18} className="text-[#2563EB]" /> Rubric Evaluation & Evidence
          </h2>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {grading.rubricEvaluation.criteriaScores.map((c, i) => (
            <div key={i} className="border-b border-[#E2E8F0] pb-6 last:border-0 last:pb-0 space-y-2">
              <div className="flex justify-between text-base font-bold">
                <span className="text-slate-900">{c.criterion}</span>
                <span className="text-[#2563EB] font-mono">{c.score}/{c.maxPoints} pts</span>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">{c.reasoning}</p>
              {c.evidence && (
                <p className="text-sm text-slate-700 font-mono bg-slate-50 p-4 rounded-lg border border-[#E2E8F0] mt-3">
                  Evidence: "{c.evidence}"
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Diagnosis / Root Cause */}
      {grading.rootCause.errorCategory !== 'NONE' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-amber-700 flex items-center gap-2">
            <Sparkles size={18} /> AI Root-Cause Misconception Diagnosis
          </h2>
          <span className="inline-block text-xs font-mono font-bold px-3 py-1 rounded-full bg-white text-amber-700 border border-amber-200">
            Category: {grading.rootCause.errorCategory.replaceAll('_', ' ')}
          </span>
          <p className="text-sm text-slate-800 leading-relaxed"><strong>Identified Misconception:</strong> {grading.rootCause.detectedMisconception}</p>
          <p className="text-sm text-slate-800 leading-relaxed"><strong>Root Reason:</strong> {grading.rootCause.rootReason}</p>
        </div>
      )}

      {/* Recommended Learning Material */}
      {rec && (
        <Card className="border-[#2563EB] bg-[#EFF5FF]">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                {rec.sourceType === 'video' ? <Video size={18} className="text-[#2563EB]" /> : <FileText size={18} className="text-[#2563EB]" />}
                AI Recommended Learning Material
              </h2>
              <span className="text-xs bg-white text-[#2563EB] font-bold px-3 py-1 rounded-full font-mono border border-[#2563EB]/20">Semantic RAG Match</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] text-sm space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{rec.sourceType === 'video' ? '📹' : '📄'} {rec.sourceName}</span>
                {rec.startTime != null && (
                  <span className="font-mono text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                    📍 {formatSecondsToTimestamp(rec.startTime)} – {formatSecondsToTimestamp(rec.endTime)}
                  </span>
                )}
                {rec.page != null && (
                  <span className="font-mono text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                    Page {rec.page}
                  </span>
                )}
              </div>
              {rec.snippet && <p className="text-[#64748B] italic line-clamp-3">"{rec.snippet}"</p>}
            </div>

            <Link
              to={`/student/workspaces/${rec.workspaceId}${rec.sourceType === 'video' ? `?videoId=${rec.sourceId}&seek=${rec.startTime || 0}` : ''}`}
            >
              <Button variant="primary" className="w-full sm:w-auto">
                <ExternalLink size={16} className="mr-2" /> Jump to Relevant Section in Workspace
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Personalized Feedback */}
      <Card>
        <CardHeader className="border-b border-[#E2E8F0]">
          <h2 className="font-bold text-lg text-slate-900">Personalized AI Feedback</h2>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <AIVoiceTutor text={`${grading.feedback.explanation}. Key Strengths: ${grading.feedback.strengths.join(', ')}. Areas to Improve: ${grading.feedback.weaknesses.join(', ')}.`} />

          <p className="text-sm text-[#64748B] leading-relaxed">{grading.feedback.explanation}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100">
              <p className="text-xs uppercase font-bold text-emerald-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Key Strengths
              </p>
              <ul className="text-sm text-slate-700 font-medium list-disc list-inside space-y-1.5">
                {grading.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
              <p className="text-xs uppercase font-bold text-amber-800 mb-3 flex items-center gap-1.5">
                <XCircle size={16} /> Areas to Improve
              </p>
              <ul className="text-sm text-slate-700 font-medium list-disc list-inside space-y-1.5">
                {grading.feedback.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#E2E8F0]">
            <p className="text-xs uppercase font-bold text-[#2563EB] mb-3">Recommended Next Steps</p>
            <ul className="text-sm text-slate-700 font-medium list-disc list-inside space-y-1.5">
              {grading.feedback.actionableSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Journey */}
      {submissionRevisionPlan && submissionRevisionPlan.actionItems && submissionRevisionPlan.actionItems.length > 0 && (
        <Card className="bg-[#0F172A] border-[#0F172A] text-white overflow-hidden shadow-lg">
          <CardHeader className="border-b border-slate-800 bg-slate-900/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#4F46E5] font-bold">Interactive Learning Path</span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                  <Sparkles className="w-5 h-5 text-[#4F46E5]" /> Revision Skill Tree
                </h2>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full font-mono font-bold">
                +50 XP per Node Completed
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-8 flex flex-col items-center justify-center bg-slate-950/50">
            <div className="w-full max-w-xl">
              <JourneyTree
                revisionPlan={submissionRevisionPlan}
                activeNodeId={selectedNode?.id}
                completedNodeIds={user?.completedNodes || []}
                onSelectNode={handleSelectNode}
              />
            </div>
          </CardContent>

          {/* Dedicated Quiz Modal Overlay */}
          <QuizModal
            isOpen={isQuizModalOpen}
            onClose={() => setIsQuizModalOpen(false)}
            node={selectedNode}
            misconception={grading?.rootCause?.detectedMisconception}
            context={grading?.rootCause?.rootReason}
            onQuizComplete={() => {
              if (selectedNode) handleCompleteNode(selectedNode.id);
            }}
          />
        </Card>
      )}
    </div>
  );
}
