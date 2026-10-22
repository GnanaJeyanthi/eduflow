import React, { useState, useMemo } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCw, FileText, Check, Sparkles, AlertCircle } from 'lucide-react';
import { QuizQuestion, parseQuizContent } from '../../utils/quizParser';
import MarkdownRenderer from './MarkdownRenderer';

import { useAuth } from '../../context/AuthContext';

interface InteractiveQuizViewerProps {
  rawContent?: string;
  questions?: QuizQuestion[];
  title?: string;
  onRetake?: () => void;
}

export default function InteractiveQuizViewer({
  rawContent = '',
  questions: passedQuestions,
  title = 'Interactive Practice Quiz',
  onRetake
}: InteractiveQuizViewerProps) {
  const { refreshUser } = useAuth();
  // Parse questions from rawContent if not directly passed
  const parsedQuestions = useMemo(() => {
    if (passedQuestions && passedQuestions.length > 0) return passedQuestions;
    return parseQuizContent(rawContent);
  }, [rawContent, passedQuestions]);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() =>
    new Array(parsedQuestions.length).fill(-1)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);

  // Re-initialize answers array if questions change
  React.useEffect(() => {
    setSelectedAnswers(new Array(parsedQuestions.length).fill(-1));
    setIsSubmitted(false);
  }, [parsedQuestions]);

  // Calculate score
  const scoreResult = useMemo(() => {
    if (!isSubmitted || parsedQuestions.length === 0) return null;
    let correctCount = 0;
    parsedQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });
    const percentage = Math.round((correctCount / parsedQuestions.length) * 100);
    return {
      correctCount,
      totalCount: parsedQuestions.length,
      percentage
    };
  }, [isSubmitted, selectedAnswers, parsedQuestions]);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (isSubmitted) return; // Locked after submission
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[questionIdx] = optionIdx;
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    await refreshUser();
  };

  const handleReset = () => {
    setSelectedAnswers(new Array(parsedQuestions.length).fill(-1));
    setIsSubmitted(false);
    if (onRetake) onRetake();
  };

  const isAllAnswered = selectedAnswers.every((a) => a !== -1);
  const answeredCount = selectedAnswers.filter((a) => a !== -1).length;

  // Fallback to MarkdownRenderer if parsing failed to yield questions
  if (parsedQuestions.length === 0 || showRawMarkdown) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-base-700 pb-2">
          <span className="text-xs font-semibold text-brand-violet flex items-center gap-1.5">
            <Sparkles size={14} /> Practice Quiz Content
          </span>
          {parsedQuestions.length > 0 && (
            <button
              onClick={() => setShowRawMarkdown(false)}
              className="text-xs bg-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/30 px-2.5 py-1 rounded font-medium border border-brand-indigo/30 transition-colors"
            >
              🎮 Switch to Interactive Quiz Mode
            </button>
          )}
        </div>
        <MarkdownRenderer content={rawContent} />
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 border border-blue-200">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              {title}
            </h3>
            <p className="text-xs font-medium text-slate-500">
              {parsedQuestions.length} Questions • Select an answer for each question below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowRawMarkdown(true)}
            className="text-xs bg-white hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
            title="View raw markdown text"
          >
            <FileText size={13} /> Text View
          </button>
          {isSubmitted && (
            <button
              onClick={handleReset}
              className="text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCw size={13} /> Retake Quiz
            </button>
          )}
        </div>
      </div>

      {/* Score Summary Header if Submitted */}
      {isSubmitted && scoreResult && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-full ${scoreResult.percentage >= 70
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
                }`}
            >
              <Award size={28} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quiz Result</p>
              <h4 className="text-xl font-extrabold text-slate-900">
                Score: {scoreResult.percentage}% ({scoreResult.correctCount} / {scoreResult.totalCount} Correct)
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {scoreResult.percentage >= 80
                  ? '🎉 Outstanding mastery of the concepts!'
                  : scoreResult.percentage >= 60
                    ? '👍 Good understanding! Review missed questions below.'
                    : '💡 Practice makes perfect! Review the explanations below and retake.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shrink-0"
          >
            <RotateCw size={14} /> Retake Quiz
          </button>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-6">
        {parsedQuestions.map((q, qIdx) => {
          const selectedOptIdx = selectedAnswers[qIdx];
          const isCorrect = selectedOptIdx === q.correctAnswerIndex;

          return (
            <div
              key={qIdx}
              className={`p-5 rounded-2xl border transition-all ${isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                    : 'bg-rose-50/50 border-rose-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-lg font-bold font-mono shrink-0 shadow-sm">
                    Q{qIdx + 1}
                  </span>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-snug pt-0.5">
                    {q.question}
                  </h4>
                </div>
                {q.targetConcept && (
                  <span className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-2.5 py-1 rounded-lg shrink-0 hidden sm:inline-block">
                    {q.targetConcept}
                  </span>
                )}
              </div>

              {/* Options list */}
              <div className="space-y-2.5 pl-0 sm:pl-10">
                {q.options.map((optText, optIdx) => {
                  const isSelected = selectedOptIdx === optIdx;
                  const isAnswerKey = optIdx === q.correctAnswerIndex;

                  let optionStyle = 'border-slate-200 bg-slate-50/70 text-slate-800 hover:bg-blue-50/60 hover:border-blue-300 hover:text-slate-900';
                  let badge = null;

                  if (isSubmitted) {
                    if (isSelected && isCorrect) {
                      // Student selected CORRECT answer -> GREEN BOX
                      optionStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-semibold shadow-sm';
                      badge = (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-lg font-bold border border-emerald-300 shrink-0">
                          <CheckCircle2 size={14} className="text-emerald-700" /> Your Answer (Correct)
                        </span>
                      );
                    } else if (isSelected && !isCorrect) {
                      // Student selected WRONG answer -> RED BOX
                      optionStyle = 'border-rose-500 bg-rose-100 text-rose-950 font-semibold shadow-sm';
                      badge = (
                        <span className="flex items-center gap-1 text-[11px] text-rose-800 bg-rose-200 px-2.5 py-1 rounded-lg font-bold border border-rose-300 shrink-0">
                          <XCircle size={14} className="text-rose-700" /> Your Answer (Incorrect)
                        </span>
                      );
                    } else if (!isSelected && isAnswerKey) {
                      // Missed Correct Answer -> GREEN OUTLINE BOX
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                      badge = (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg font-bold border border-emerald-300 shrink-0">
                          <CheckCircle2 size={14} className="text-emerald-600" /> Correct Answer
                        </span>
                      );
                    } else {
                      // Unselected non-correct option
                      optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    // Selected state before submit
                    optionStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-semibold ring-2 ring-blue-500/20 shadow-sm';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left flex items-center justify-between text-sm px-4 py-3 rounded-xl border transition-all ${isSubmitted ? 'cursor-default' : 'cursor-pointer'
                        } ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-2">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors ${isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                            }`}
                        >
                          {optionLetters[optIdx] || optIdx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{optText}</span>
                      </div>
                      {badge}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation Box after submission */}
              {isSubmitted && (
                <div className="mt-4 ml-0 sm:ml-10 p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs leading-relaxed space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <CheckCircle2 size={15} /> Correct Answer:{' '}
                    <span className="text-slate-900 font-semibold">
                      {optionLetters[q.correctAnswerIndex]}) {q.options[q.correctAnswerIndex]}
                    </span>
                  </div>
                  {q.explanation && (
                    <p className="text-slate-700 pl-4 text-xs leading-relaxed border-l-2 border-blue-500 my-1 font-medium">
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action Bar */}
      {!isSubmitted && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <p className="text-xs text-slate-600">
            {answeredCount === parsedQuestions.length ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check size={16} /> All {parsedQuestions.length} questions answered! Ready to submit.
              </span>
            ) : (
              <span>
                Answered <strong className="text-slate-900 font-bold">{answeredCount}</strong> of{' '}
                <strong className="text-slate-900 font-bold">{parsedQuestions.length}</strong> questions
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className={`btn-primary text-xs px-6 py-2.5 flex items-center gap-2 ${answeredCount === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-md shadow-blue-500/20'
              }`}
          >
            <Sparkles size={14} /> Submit Quiz & Grade Answers
          </button>
        </div>
      )}
    </div>
  );
}
