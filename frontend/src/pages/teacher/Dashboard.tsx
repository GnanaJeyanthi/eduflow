import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { Plus, Users, BookOpen, ChevronRight, Sparkles, FolderPlus, Lightbulb } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get('/classes');
      const list = Array.isArray(res.data) ? res.data : (res.data?.classes || []);
      setClasses(list);
    } catch (e) {
      console.error(e);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalStudents = (classes || []).reduce((acc, c) => acc + (c.students?.length || c.studentIds?.length || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-[#64748B] text-sm mt-1">Manage classrooms, create rubric assignments, and review AI submissions.</p>
        </div>
        <Link to="/teacher/classes">
          <Button variant="primary">
            <Plus size={16} className="mr-1.5" /> Create New Class
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardContent className="flex flex-col justify-center h-full p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">Total Classes</p>
            <p className="text-3xl font-bold text-slate-900">{(classes || []).length}</p>
            <p className="text-xs font-medium text-[#64748B] mt-1">Active learning cohorts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col justify-center h-full p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">Enrolled Students</p>
            <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
            <p className="text-xs font-medium text-[#64748B] mt-1">Students across all classes</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F8FAFC]">
          <CardContent className="flex flex-col justify-center h-full p-6 space-y-3">
            <Link to="/teacher/classes">
              <Button variant="primary" className="w-full justify-center">Create Assignment Rubric</Button>
            </Link>
            <Link to="/teacher/submissions">
              <Button variant="secondary" className="w-full justify-center">Review AI Submissions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* AI Class Insights (New Feature Placeholder) */}
      <Card className="border-[#2563EB]/20 bg-[#EFF5FF] overflow-hidden">
        <CardHeader className="pb-3 border-b-0">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb size={18} className="text-[#2563EB]" /> AI Class Insights & Review Strategy
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded-full">Beta</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white rounded-lg p-5 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-900">Generate Data-Driven Review Strategies</p>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                Use your students' recent submission data and identified root-cause misconceptions to instantly generate a targeted lesson plan for your next class.
              </p>
              <p className="text-xs text-amber-600 mt-2 font-medium bg-amber-50 inline-block px-2 py-1 rounded">
                Note: Backend aggregation for class-wide root causes is required for full functionality.
              </p>
            </div>
            <Button variant="primary" className="shrink-0" onClick={() => alert("Backend aggregation endpoint needed to generate real class-wide insights.")}>
              <Sparkles size={16} className="mr-1.5" /> Generate Review Strategy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Class List Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={18} className="text-[#64748B]" /> Active Classrooms ({(classes || []).length})
          </h2>
          <Link to="/teacher/classes" className="text-sm font-semibold text-[#2563EB] hover:underline">
            Manage All Classes &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
          </div>
        ) : (classes || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(classes || []).map((c) => {
              const studentCount = (c.students?.length || c.studentIds?.length || 0);
              return (
                <Card key={c._id || c.id} className="flex flex-col h-full hover:border-[#2563EB]/50 hover:shadow-md transition-all group">
                  <CardContent className="h-full flex flex-col p-5">
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1">{c.name}</h3>
                      <p className="text-sm text-[#64748B] mt-0.5">{c.subject || 'General Subject'}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                        <span className="bg-slate-100 text-slate-700 border border-[#E2E8F0] px-2.5 py-1 rounded-md font-mono font-medium">
                          Code: {c.joinCode}
                        </span>
                        <span className="text-[#64748B] flex items-center gap-1 font-medium">
                          <Users size={14} /> {studentCount} student{studentCount === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex justify-end">
                      <Link to={`/teacher/classes/${c._id || c.id}`} className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center group-hover:text-blue-700">
                        Manage Classroom <ChevronRight size={16} className="ml-0.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FolderPlus}
            title="No classes created yet"
            description="Create your first classroom to start inviting students and assigning work."
            action={
              <Link to="/teacher/classes">
                <Button variant="primary">Create Class</Button>
              </Link>
            }
          />
        )}
      </div>

    </div>
  );
}

