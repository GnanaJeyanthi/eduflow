import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { Assignment, Submission } from '../../types';
import { FileText, Clock, CheckCircle, ArrowRight, Upload, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          api.get('/assignments'),
          api.get('/submissions/mine')
        ]);
        setAssignments(aRes.data.assignments || []);
        setSubmissions(sRes.data.submissions || []);
      } catch (err) {
        console.error('Error loading assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  const subMap = new Map<string, Submission>();
  submissions.forEach((s) => {
    const aId = typeof s.assignment === 'string' ? s.assignment : s.assignment?._id;
    if (aId) subMap.set(aId, s);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignments</h1>
        <p className="text-sm text-[#64748B] mt-1">
          View assigned coursework, submit your solutions, and review AI feedback.
        </p>
      </div>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((assignment) => {
            const sub = subMap.get(assignment._id);

            return (
              <Card key={assignment._id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col h-full p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[#F8FAFC] text-slate-700 border border-[#E2E8F0] flex items-center gap-1.5">
                      <FileText size={12} className="text-[#2563EB]" /> Coursework
                    </span>
                    {sub ? (
                      <Badge status="submitted">
                        <CheckCircle size={12} className="mr-1" /> Submitted
                      </Badge>
                    ) : (
                      <Badge status="pending">
                        <Clock size={12} className="mr-1" /> Pending
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">{assignment.title}</h3>
                    <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                      {assignment.question}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#64748B]">
                      Max Score: <strong className="text-slate-900">{assignment.maxScore || 100}</strong>
                    </span>

                    {sub ? (
                      <Link to={`/student/submissions/${sub._id}`}>
                        <Button variant="secondary" size="sm">
                          View Feedback <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/student/assignments/${assignment._id}/submit`}>
                        <Button variant="primary" size="sm">
                          <Upload size={14} className="mr-1.5" /> Submit
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No Assignments Yet"
          description="You don't have any pending assignments. Check back later or ask your teacher for coursework."
        />
      )}
    </div>
  );
}
