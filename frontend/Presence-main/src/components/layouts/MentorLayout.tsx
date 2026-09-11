import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiUrl, authFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  UserCheck,
  Users,
  LogOut,
  BookOpen,
  Calendar as CalendarIcon,
  Search,
  Filter,
  GraduationCap,
  Phone,
  Mail,
  AlertCircle,
  X,
  User,
  MapPin,
  Calendar,
  Award,
  Heart,
  Target,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  Briefcase,
  Link as LinkIcon,
  TrendingUp,
  Star,
  Brain,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

type AssignedStudent = {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  roll_number: string | null;
  department: string | null;
  section: string | null;
  year: string | null;
  phone: string | null;
  is_detained: boolean;
  assignment_notes: string | null;
  assigned_at: string;
  attendance_percentage: number | null;
  // Personal Details
  date_of_birth: string | null;
  date_of_joining: string | null;
  guardian_name: string | null;
  guardian_relation: string | null;
  guardian_mobile: string | null;
  occupation: string | null;
  income: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  admission_category: string | null;
  eapcet_rank: number | null;
  ecet_rank: number | null;
  reservation_category: string | null;
  scholarship: string | null;
  residential_details: string | null;
  mode_of_transport: string | null;
  photo: string | null;
  // Educational Profile
  ssc_board: string | null;
  ssc_school: string | null;
  ssc_percentage: number | null;
  ssc_class: string | null;
  intermediate_board: string | null;
  intermediate_college: string | null;
  intermediate_percentage: number | null;
  intermediate_class: string | null;
  medium_of_instruction: string | null;
  local: string | null;
  mother_tongue: string | null;
  achievements: string | null;
  hobbies: string | null;
  areas_of_interest: string | null;
  other_information: string | null;
};

type MentorAttendanceRecord = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  month: string;
  semester: string;
  academic_year: string;
  total_classes: number;
  classes_attended: number;
  attendance_percentage: number;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};

type AcademicRecord = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  course_name: string;
  semester: string;
  academic_year: string;
  mid1_marks: number | null;
  mid2_marks: number | null;
  cie_marks: number | null;
  total_internal_marks: number | null;
  marks_obtained: number | null;
  credits_obtained: number | null;
  sgpa: number | null;
  audit_course_cleared: boolean;
  grade: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  updated_by: number | null;
  updated_by_name: string | null;
};

type StudentAchievement = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  achievement_type: string;
  activity_name: string;
  event_name: string;
  participation_level: string;
  achievement_details: string;
  date_achieved: string;
  created_at: string;
  updated_at: string;
};

type MentorRemark = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  mentor_email: string;
  remark_date: string;
  mentoring_area: string;
  remarks: string;
  created_at: string;
  updated_at: string;
};

type CounsellingNote = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  mentor_email: string;
  counselling_date: string;
  category: string;
  training: string;
  remarks_status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
};

type StudentBehaviour = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  behaviour_category: string;
  rating: number;
  assessment_date: string;
  positive_aspects: string | null;
  areas_for_improvement: string | null;
  action_plan: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};

type StudentCareer = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  career_status: string;
  company_name: string | null;
  job_role: string | null;
  placement_date: string | null;
  salary_package: string | null;
  skills_for_career: string | null;
  career_goals: string | null;
  guidance_provided: string | null;
  resume_status: string | null;
  interview_preparation: string | null;
  remarks: string | null;
  career_goal: string | null;
  expected_package: string | null;
  desired_role: string | null;
  dream_company: string | null;
  help_needed: string | null;
  faculty_suggestions: string | null;
  created_at: string;
  updated_at: string;
};

type StudentLink = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  link_title: string;
  link_url: string;
  link_category: string;
  description: string | null;
  importance: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};

type StudentTraining = {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string | null;
  mentor: number;
  mentor_name: string;
  training_name: string;
  training_type: string;
  organization: string | null;
  start_date: string;
  end_date: string;
  duration_hours: number | null;
  skills_learned: string | null;
  certification_obtained: boolean;
  certificate_name: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};

export const MentorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [allStudents, setAllStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [allStudentsLoading, setAllStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<AssignedStudent | null>(null);
  const [studentProfileOpen, setStudentProfileOpen] = useState(false);
  const [editingStudentProfile, setEditingStudentProfile] = useState(false);
  const [studentProfileForm, setStudentProfileForm] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<'name' | 'roll_number' | 'department' | 'year'>('name');
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [academicRecordsLoading, setAcademicRecordsLoading] = useState(false);
  const [academicRecordDialogOpen, setAcademicRecordDialogOpen] = useState(false);
  const [editingAcademicRecord, setEditingAcademicRecord] = useState<AcademicRecord | null>(null);
  const [academicRecordForm, setAcademicRecordForm] = useState({
    course_name: '',
    semester: '',
    academic_year: '',
    mid1_marks: '',
    mid2_marks: '',
    cie_marks: '',
    total_internal_marks: '',
    marks_obtained: '',
    credits_obtained: '',
    sgpa: '',
    audit_course_cleared: false,
    grade: '',
    remarks: '',
  });
  const [mentorAttendanceRecords, setMentorAttendanceRecords] = useState<MentorAttendanceRecord[]>([]);
  const [mentorAttendanceLoading, setMentorAttendanceLoading] = useState(false);
  const [mentorAttendanceDialogOpen, setMentorAttendanceDialogOpen] = useState(false);
  const [editingMentorAttendance, setEditingMentorAttendance] = useState<MentorAttendanceRecord | null>(null);
  const [mentorAttendanceForm, setMentorAttendanceForm] = useState({
    month: '',
    semester: '',
    academic_year: '',
    total_classes: '',
    classes_attended: '',
    remarks: '',
  });
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [studentAchievementsLoading, setStudentAchievementsLoading] = useState(false);
  const [studentAchievementsOpen, setStudentAchievementsOpen] = useState(false);
  const [mentorRemarks, setMentorRemarks] = useState<MentorRemark[]>([]);
  const [mentorRemarksLoading, setMentorRemarksLoading] = useState(false);
  const [mentorRemarksDialogOpen, setMentorRemarksDialogOpen] = useState(false);
  const [editingMentorRemark, setEditingMentorRemark] = useState<MentorRemark | null>(null);
  const [mentorRemarkForm, setMentorRemarkForm] = useState({
    remark_date: '',
    mentoring_area: '',
    remarks: ''
  });
  const [counsellingNotes, setCounsellingNotes] = useState<CounsellingNote[]>([]);
  const [counsellingNotesLoading, setCounsellingNotesLoading] = useState(false);
  const [counsellingNotesDialogOpen, setCounsellingNotesDialogOpen] = useState(false);
  const [editingCounsellingNote, setEditingCounsellingNote] = useState<CounsellingNote | null>(null);
  const [counsellingNoteForm, setCounsellingNoteForm] = useState({
    counselling_date: '',
    category: '',
    training: '',
    remarks_status: '',
    remarks: ''
  });
  const [studentBehaviourRecords, setStudentBehaviourRecords] = useState<StudentBehaviour[]>([]);
  const [studentBehaviourLoading, setStudentBehaviourLoading] = useState(false);
  const [studentBehaviourDialogOpen, setStudentBehaviourDialogOpen] = useState(false);
  const [editingStudentBehaviour, setEditingStudentBehaviour] = useState<StudentBehaviour | null>(null);
  const [studentBehaviourForm, setStudentBehaviourForm] = useState({
    behaviour_category: '',
    rating: '',
    assessment_date: '',
    positive_aspects: '',
    areas_for_improvement: '',
    action_plan: '',
    remarks: ''
  });
  const [studentCareerRecords, setStudentCareerRecords] = useState<StudentCareer[]>([]);
  const [studentCareerLoading, setStudentCareerLoading] = useState(false);
  const [studentCareerDialogOpen, setStudentCareerDialogOpen] = useState(false);
  const [editingStudentCareer, setEditingStudentCareer] = useState<StudentCareer | null>(null);
  const [studentCareerForm, setStudentCareerForm] = useState({
    career_status: '',
    company_name: '',
    job_role: '',
    placement_date: '',
    salary_package: '',
    skills_for_career: '',
    career_goals: '',
    guidance_provided: '',
    resume_status: '',
    interview_preparation: '',
    remarks: '',
    career_goal: '',
    expected_package: '',
    desired_role: '',
    dream_company: '',
    help_needed: '',
    faculty_suggestions: ''
  });
  const [studentLinkRecords, setStudentLinkRecords] = useState<StudentLink[]>([]);
  const [studentLinkLoading, setStudentLinkLoading] = useState(false);
  const [studentLinkDialogOpen, setStudentLinkDialogOpen] = useState(false);
  const [editingStudentLink, setEditingStudentLink] = useState<StudentLink | null>(null);
  const [studentLinkForm, setStudentLinkForm] = useState({
    link_title: '',
    link_url: '',
    link_category: '',
    description: '',
    importance: '',
    status: 'pending',
    remarks: ''
  });
  const [studentTrainingRecords, setStudentTrainingRecords] = useState<StudentTraining[]>([]);
  const [studentTrainingLoading, setStudentTrainingLoading] = useState(false);
  const [studentTrainingDialogOpen, setStudentTrainingDialogOpen] = useState(false);
  const [editingStudentTraining, setEditingStudentTraining] = useState<StudentTraining | null>(null);
  const [studentTrainingForm, setStudentTrainingForm] = useState({
    training_name: '',
    training_type: '',
    organization: '',
    start_date: '',
    end_date: '',
    duration_hours: '',
    skills_learned: '',
    certification_obtained: false,
    certificate_name: '',
    remarks: ''
  });

  useEffect(() => {
    loadAssignedStudents();
    loadAllStudents();
  }, []);

  const loadAssignedStudents = async () => {
    setLoading(true);
    try {
      const res = await authFetch(apiUrl('/api/mentor-students/'));
      if (res.ok) {
        const data = await res.json();
        setAssignedStudents(Array.isArray(data) ? data : []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load assigned students.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllStudents = async () => {
    setAllStudentsLoading(true);
    try {
      const res = await authFetch(apiUrl('/api/students/'));
      if (res.ok) {
        const data = await res.json();
        setAllStudents(Array.isArray(data) ? data : []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load all students.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    } finally {
      setAllStudentsLoading(false);
    }
  };

  const loadStudentAchievements = async (studentId: number) => {
    setStudentAchievementsLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/achievements/`));
      if (res.ok) {
        const data = await res.json();
        setStudentAchievements(Array.isArray(data) ? data : []);
      } else {
        setStudentAchievements([]);
      }
    } catch (error) {
      setStudentAchievements([]);
    } finally {
      setStudentAchievementsLoading(false);
    }
  };

  const loadMentorRemarks = async (studentId: number) => {
    setMentorRemarksLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/mentor-remarks/`));
      if (res.ok) {
        const data = await res.json();
        setMentorRemarks(Array.isArray(data) ? data : []);
      } else {
        setMentorRemarks([]);
      }
    } catch (error) {
      setMentorRemarks([]);
    } finally {
      setMentorRemarksLoading(false);
    }
  };

  const loadCounsellingNotes = async (studentId: number) => {
    setCounsellingNotesLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/counselling-notes/`));
      if (res.ok) {
        const data = await res.json();
        setCounsellingNotes(Array.isArray(data) ? data : []);
      } else {
        setCounsellingNotes([]);
      }
    } catch (error) {
      setCounsellingNotes([]);
    } finally {
      setCounsellingNotesLoading(false);
    }
  };

  const handleOpenMentorRemarkDialog = (remark = null) => {
    if (remark) {
      setEditingMentorRemark(remark);
      setMentorRemarkForm({
        remark_date: remark.remark_date,
        mentoring_area: remark.mentoring_area,
        remarks: remark.remarks
      });
    } else {
      setEditingMentorRemark(null);
      // Calculate default date based on 15-day intervals
      let defaultDate = new Date().toISOString().split('T')[0];
      
      if (mentorRemarks.length > 0) {
        // Find the most recent remark date and add 15 days
        const lastRemark = mentorRemarks[0]; // Already sorted by date descending
        const lastDate = new Date(lastRemark.remark_date);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 15);
        defaultDate = nextDate.toISOString().split('T')[0];
      } else {
        // For first remark, use current date as default
        defaultDate = new Date().toISOString().split('T')[0];
      }
      
      setMentorRemarkForm({
        remark_date: defaultDate,
        mentoring_area: '',
        remarks: ''
      });
    }
    setMentorRemarksDialogOpen(true);
  };

  const handleSaveMentorRemark = async () => {
    if (selectedStudent == null) return;
    try {
      const url = editingMentorRemark
        ? apiUrl(`/api/students/${selectedStudent.id}/mentor-remarks/${editingMentorRemark.id}/`)
        : apiUrl(`/api/students/${selectedStudent.id}/mentor-remarks/`);
      
      const method = editingMentorRemark ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(mentorRemarkForm)
      });

      if (res.ok) {
        setMentorRemarksDialogOpen(false);
        loadMentorRemarks(selectedStudent.id);
        toast({ 
          title: editingMentorRemark ? 'Remark updated' : 'Remark added',
          description: 'Your mentor remark has been saved successfully.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('Save remark error:', err);
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({ 
          title: 'Failed to save remark', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      console.error('Save remark error:', error);
      toast({ 
        title: 'Failed to save remark', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteMentorRemark = async (remarkId: number) => {
    if (selectedStudent == null) return;
    if (!confirm('Are you sure you want to delete this remark?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${selectedStudent.id}/mentor-remarks/${remarkId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadMentorRemarks(selectedStudent.id);
        toast({ 
          title: 'Remark deleted', 
          description: 'The remark has been removed.' 
        });
      } else {
        toast({ 
          title: 'Failed to delete remark', 
          description: 'Only admin can delete remarks.', 
          variant: 'destructive' 
        });
      }
    } catch {
      toast({ 
        title: 'Failed to delete remark', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleEditStudentProfile = () => {
    if (!selectedStudent) return;
    setStudentProfileForm({ ...selectedStudent });
    setEditingStudentProfile(true);
  };

  const handleOpenCounsellingNoteDialog = (note = null) => {
    if (note) {
      setEditingCounsellingNote(note);
      setCounsellingNoteForm({
        counselling_date: note.counselling_date,
        category: note.category || '',
        training: note.training || '',
        remarks_status: note.remarks_status || '',
        remarks: note.remarks
      });
    } else {
      setEditingCounsellingNote(null);
      // Default to current date for first note, or 15 days after last note
      let defaultDate = new Date().toISOString().split('T')[0];
      if (counsellingNotes.length > 0) {
        const lastDate = new Date(counsellingNotes[0].counselling_date);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 15);
        defaultDate = nextDate.toISOString().split('T')[0];
      }
      setCounsellingNoteForm({
        counselling_date: defaultDate,
        category: '',
        training: '',
        remarks_status: '',
        remarks: ''
      });
    }
    setCounsellingNotesDialogOpen(true);
  };

  const handleSaveCounsellingNote = async () => {
    if (selectedStudent == null) return;
    try {
      const url = editingCounsellingNote
        ? apiUrl(`/api/students/${selectedStudent.id}/counselling-notes/${editingCounsellingNote.id}/`)
        : apiUrl(`/api/students/${selectedStudent.id}/counselling-notes/`);
      
      const method = editingCounsellingNote ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(counsellingNoteForm)
      });

      if (res.ok) {
        setCounsellingNotesDialogOpen(false);
        loadCounsellingNotes(selectedStudent.id);
        toast({ 
          title: editingCounsellingNote ? 'Counselling note updated' : 'Counselling note added',
          description: 'Your counselling note has been saved successfully.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('Save counselling note error:', err);
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({ 
          title: 'Failed to save counselling note', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      console.error('Save counselling note error:', error);
      toast({ 
        title: 'Failed to save counselling note', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteCounsellingNote = async (noteId: number) => {
    if (selectedStudent == null) return;
    if (!confirm('Are you sure you want to delete this counselling note?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${selectedStudent.id}/counselling-notes/${noteId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadCounsellingNotes(selectedStudent.id);
        toast({ 
          title: 'Counselling note deleted', 
          description: 'The counselling note has been removed.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ 
          title: 'Failed to delete counselling note', 
          description: err.detail || 'You can only delete your own counselling notes.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete counselling note', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  // Student Behaviour Functions
  const loadStudentBehaviourRecords = async (studentId: number) => {
    setStudentBehaviourLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/behaviour-records/`));
      if (res.ok) {
        const data = await res.json();
        setStudentBehaviourRecords(Array.isArray(data) ? data : []);
      } else {
        setStudentBehaviourRecords([]);
      }
    } catch (error) {
      setStudentBehaviourRecords([]);
    } finally {
      setStudentBehaviourLoading(false);
    }
  };

  const handleOpenStudentBehaviourDialog = (record = null) => {
    if (record) {
      setEditingStudentBehaviour(record);
      setStudentBehaviourForm({
        behaviour_category: record.behaviour_category,
        rating: record.rating.toString(),
        assessment_date: record.assessment_date,
        positive_aspects: record.positive_aspects || '',
        areas_for_improvement: record.areas_for_improvement || '',
        action_plan: record.action_plan || '',
        remarks: record.remarks || ''
      });
    } else {
      setEditingStudentBehaviour(null);
      setStudentBehaviourForm({
        behaviour_category: '',
        rating: '',
        assessment_date: new Date().toISOString().split('T')[0],
        positive_aspects: '',
        areas_for_improvement: '',
        action_plan: '',
        remarks: ''
      });
    }
    setStudentBehaviourDialogOpen(true);
  };

  const handleSaveStudentBehaviour = async () => {
    if (selectedStudent == null) return;
    try {
      const url = editingStudentBehaviour
        ? apiUrl(`/api/students/${selectedStudent.id}/behaviour-records/${editingStudentBehaviour.id}/`)
        : apiUrl(`/api/students/${selectedStudent.id}/behaviour-records/`);
      
      const method = editingStudentBehaviour ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentBehaviourForm,
          rating: parseInt(studentBehaviourForm.rating)
        })
      });

      if (res.ok) {
        setStudentBehaviourDialogOpen(false);
        loadStudentBehaviourRecords(selectedStudent.id);
        toast({ 
          title: editingStudentBehaviour ? 'Behaviour record updated' : 'Behaviour record added',
          description: 'Your behaviour record has been saved successfully.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({ 
          title: 'Failed to save behaviour record', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to save behaviour record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteStudentBehaviour = async (recordId: number) => {
    if (selectedStudent == null) return;
    if (!confirm('Are you sure you want to delete this behaviour record?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${selectedStudent.id}/behaviour-records/${recordId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadStudentBehaviourRecords(selectedStudent.id);
        toast({ 
          title: 'Behaviour record deleted', 
          description: 'The behaviour record has been removed.' 
        });
      } else {
        toast({ 
          title: 'Failed to delete behaviour record', 
          description: 'You can only delete your own behaviour records.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete behaviour record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  // Student Career Functions
  const loadStudentCareerRecords = async (studentId: number) => {
    setStudentCareerLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/career-records/`));
      if (res.ok) {
        const data = await res.json();
        setStudentCareerRecords(Array.isArray(data) ? data : []);
      } else {
        setStudentCareerRecords([]);
      }
    } catch (error) {
      setStudentCareerRecords([]);
    } finally {
      setStudentCareerLoading(false);
    }
  };

  const loadStudentCareerInfo = async (studentId: number) => {
    setStudentCareerLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/career/`));
      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          setStudentCareerRecords([data]);
        } else {
          setStudentCareerRecords([]);
        }
      } else {
        setStudentCareerRecords([]);
      }
    } catch (error) {
      setStudentCareerRecords([]);
    } finally {
      setStudentCareerLoading(false);
    }
  };

  const handleOpenStudentCareerDialog = (record = null) => {
    if (record) {
      setEditingStudentCareer(record);
      setStudentCareerForm({
        career_status: record.career_status,
        company_name: record.company_name || '',
        job_role: record.job_role || '',
        placement_date: record.placement_date || '',
        salary_package: record.salary_package || '',
        skills_for_career: record.skills_for_career || '',
        career_goals: record.career_goals || '',
        guidance_provided: record.guidance_provided || '',
        resume_status: record.resume_status || '',
        interview_preparation: record.interview_preparation || '',
        remarks: record.remarks || '',
        career_goal: record.career_goal || '',
        expected_package: record.expected_package || '',
        desired_role: record.desired_role || '',
        dream_company: record.dream_company || '',
        help_needed: record.help_needed || '',
        faculty_suggestions: record.faculty_suggestions || ''
      });
    } else {
      setEditingStudentCareer(null);
      setStudentCareerForm({
        career_status: '',
        company_name: '',
        job_role: '',
        placement_date: '',
        salary_package: '',
        skills_for_career: '',
        career_goals: '',
        guidance_provided: '',
        resume_status: '',
        interview_preparation: '',
        remarks: '',
        career_goal: '',
        expected_package: '',
        desired_role: '',
        dream_company: '',
        help_needed: '',
        faculty_suggestions: ''
      });
    }
    setStudentCareerDialogOpen(true);
  };

  const handleSaveStudentCareer = async () => {
    if (selectedStudent == null) return;
    try {
      // Use the simplified career info endpoint for student career planning
      const url = apiUrl(`/api/students/${selectedStudent.id}/career/`);
      const method = 'PUT';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentCareerForm)
      });

      if (res.ok) {
        setStudentCareerDialogOpen(false);
        loadStudentCareerInfo(selectedStudent.id);
        toast({
          title: 'Career information updated',
          description: 'Career information has been saved successfully.'
        });
      } else {
        const err = await res.json().catch(() => ({}));
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({
          title: 'Failed to save career information',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to save career information',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteStudentCareer = async (recordId: number) => {
    if (selectedStudent == null) return;
    if (!confirm('Are you sure you want to delete this career record?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${selectedStudent.id}/career-records/${recordId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadStudentCareerRecords(selectedStudent.id);
        toast({ 
          title: 'Career record deleted', 
          description: 'The career record has been removed.' 
        });
      } else {
        toast({ 
          title: 'Failed to delete career record', 
          description: 'You can only delete your own career records.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete career record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  // Student Link Functions
  const loadStudentLinkRecords = async (studentId: number) => {
    setStudentLinkLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/link-records/`));
      if (res.ok) {
        const data = await res.json();
        setStudentLinkRecords(Array.isArray(data) ? data : []);
      } else {
        setStudentLinkRecords([]);
      }
    } catch (error) {
      setStudentLinkRecords([]);
    } finally {
      setStudentLinkLoading(false);
    }
  };

  const handleOpenStudentLinkDialog = (record = null) => {
    if (record) {
      setEditingStudentLink(record);
      setStudentLinkForm({
        link_title: record.link_title,
        link_url: record.link_url,
        link_category: record.link_category,
        description: record.description || '',
        importance: record.importance || '',
        status: record.status,
        remarks: record.remarks || ''
      });
    } else {
      setEditingStudentLink(null);
      setStudentLinkForm({
        link_title: '',
        link_url: '',
        link_category: '',
        description: '',
        importance: '',
        status: 'pending',
        remarks: ''
      });
    }
    setStudentLinkDialogOpen(true);
  };

  const handleSaveStudentLink = async () => {
    if (selectedStudent == null) return;
    try {
      const url = editingStudentLink
        ? apiUrl(`/api/students/${selectedStudent.id}/link-records/${editingStudentLink.id}/`)
        : apiUrl(`/api/students/${selectedStudent.id}/link-records/`);
      
      const method = editingStudentLink ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentLinkForm)
      });

      if (res.ok) {
        setStudentLinkDialogOpen(false);
        loadStudentLinkRecords(selectedStudent.id);
        toast({ 
          title: editingStudentLink ? 'Link record updated' : 'Link record added',
          description: 'Your link record has been saved successfully.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({ 
          title: 'Failed to save link record', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to save link record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteStudentLink = async (recordId: number) => {
    if (selectedStudent == null) return;
    if (!confirm('Are you sure you want to delete this link record?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${selectedStudent.id}/link-records/${recordId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadStudentLinkRecords(selectedStudent.id);
        toast({ 
          title: 'Link record deleted', 
          description: 'The link record has been removed.' 
        });
      } else {
        toast({ 
          title: 'Failed to delete link record', 
          description: 'You can only delete your own link records.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete link record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  // Student Training Functions
  const loadStudentTrainingRecords = async (studentId: number) => {
    setStudentTrainingLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/training-records/`));
      if (res.ok) {
        const data = await res.json();
        setStudentTrainingRecords(Array.isArray(data) ? data : []);
      } else {
        setStudentTrainingRecords([]);
      }
    } catch (error) {
      setStudentTrainingRecords([]);
    } finally {
      setStudentTrainingLoading(false);
    }
  };

  const handleOpenStudentTrainingDialog = (record = null) => {
    if (record) {
      setEditingStudentTraining(record);
      setStudentTrainingForm({
        training_name: record.training_name,
        training_type: record.training_type,
        organization: record.organization || '',
        start_date: record.start_date,
        end_date: record.end_date,
        duration_hours: record.duration_hours?.toString() || '',
        skills_learned: record.skills_learned || '',
        certification_obtained: record.certification_obtained,
        certificate_name: record.certificate_name || '',
        remarks: record.remarks || ''
      });
    } else {
      setEditingStudentTraining(null);
      setStudentTrainingForm({
        training_name: '',
        training_type: '',
        organization: '',
        start_date: '',
        end_date: '',
        duration_hours: '',
        skills_learned: '',
        certification_obtained: false,
        certificate_name: '',
        remarks: ''
      });
    }
    setStudentTrainingDialogOpen(true);
  };

  const handleSaveStudentTraining = async () => {
    if (selectedStudent == null) return;
    try {
      const url = editingStudentTraining
        ? apiUrl(`/api/students/${selectedStudent.id}/training-records/${editingStudentTraining.id}/`)
        : apiUrl(`/api/students/${selectedStudent.id}/training-records/`);
      
      const method = editingStudentTraining ? 'PUT' : 'POST';
      
      const payload = {
        ...studentTrainingForm,
        duration_hours: studentTrainingForm.duration_hours ? parseInt(studentTrainingForm.duration_hours) : null,
      };
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStudentTrainingDialogOpen(false);
        loadStudentTrainingRecords(selectedStudent.id);
        toast({ 
          title: editingStudentTraining ? 'Training record updated' : 'Training record added',
          description: 'Your training record has been saved successfully.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({ 
          title: 'Failed to save training record', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to save training record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteStudentTraining = async (recordId: number) => {
    if (selectedStudent == null) return;
    if (!confirm('Are you sure you want to delete this training record?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${selectedStudent.id}/training-records/${recordId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadStudentTrainingRecords(selectedStudent.id);
        toast({ 
          title: 'Training record deleted', 
          description: 'The training record has been removed.' 
        });
      } else {
        toast({ 
          title: 'Failed to delete training record', 
          description: 'You can only delete your own training records.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Failed to delete training record', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleSaveStudentProfile = async () => {
    if (!selectedStudent) return;
    try {
      const res = await authFetch(apiUrl(`/api/users/${selectedStudent.id}/`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentProfileForm)
      });

      if (res.ok) {
        const updatedStudent = await res.json();
        setSelectedStudent(updatedStudent);
        setEditingStudentProfile(false);
        toast({
          title: 'Profile updated',
          description: 'Student profile has been updated successfully.'
        });
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('Save profile error:', err);
        let errorMessage = 'Please try again.';
        if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'object') {
          errorMessage = Object.entries(err).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        }
        toast({
          title: 'Failed to save profile',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast({
        title: 'Failed to save profile',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredStudents = assignedStudents.filter(student => {
    const matchesSearch = 
      (student.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.roll_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !filterDepartment || student.department === filterDepartment;
    const matchesYear = !filterYear || student.year === filterYear;
    
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const departments = [...new Set(assignedStudents.map(s => s.department).filter(Boolean))];
  const years = [...new Set(assignedStudents.map(s => s.year).filter(Boolean))];

  // Sorting functionality
  const finalSortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.full_name || a.username).localeCompare(b.full_name || b.username);
      case 'roll_number':
        return (a.roll_number || '').localeCompare(b.roll_number || '');
      case 'department':
        return (a.department || '').localeCompare(b.department || '');
      case 'year':
        return (a.year || '').localeCompare(b.year || '');
      default:
        return 0;
    }
  });

  const handleViewStudentProfile = (student: AssignedStudent) => {
    setSelectedStudent(student);
    setStudentProfileOpen(true);
    loadStudentAchievements(student.id);
    loadMentorRemarks(student.id);
    loadCounsellingNotes(student.id);
  };

  const loadAcademicRecords = async (studentId: number) => {
    setAcademicRecordsLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/academic-records/`));
      if (res.ok) {
        const data = await res.json();
        setAcademicRecords(Array.isArray(data) ? data : []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load academic records.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    } finally {
      setAcademicRecordsLoading(false);
    }
  };

  const handleViewAcademicRecords = (student: AssignedStudent) => {
    setSelectedStudent(student);
    loadAcademicRecords(student.id);
    setActiveTab('academic-records');
  };

  const handleAddAcademicRecord = () => {
    setEditingAcademicRecord(null);
    setAcademicRecordForm({
      course_name: '',
      semester: '',
      academic_year: '',
      mid1_marks: '',
      mid2_marks: '',
      cie_marks: '',
      total_internal_marks: '',
      marks_obtained: '',
      credits_obtained: '',
      sgpa: '',
      audit_course_cleared: false,
      grade: '',
      remarks: '',
    });
    setAcademicRecordDialogOpen(true);
  };

  const handleEditAcademicRecord = (record: AcademicRecord) => {
    setEditingAcademicRecord(record);
    setAcademicRecordForm({
      course_name: record.course_name,
      semester: record.semester,
      academic_year: record.academic_year,
      mid1_marks: record.mid1_marks?.toString() || '',
      mid2_marks: record.mid2_marks?.toString() || '',
      cie_marks: record.cie_marks?.toString() || '',
      total_internal_marks: record.total_internal_marks?.toString() || '',
      marks_obtained: record.marks_obtained?.toString() || '',
      credits_obtained: record.credits_obtained?.toString() || '',
      sgpa: record.sgpa?.toString() || '',
      audit_course_cleared: record.audit_course_cleared,
      grade: record.grade || '',
      remarks: record.remarks || '',
    });
    setAcademicRecordDialogOpen(true);
  };

  const handleSaveAcademicRecord = async () => {
    if (!selectedStudent) return;

    const payload = {
      ...academicRecordForm,
      mid1_marks: academicRecordForm.mid1_marks ? parseFloat(academicRecordForm.mid1_marks) : null,
      mid2_marks: academicRecordForm.mid2_marks ? parseFloat(academicRecordForm.mid2_marks) : null,
      cie_marks: academicRecordForm.cie_marks ? parseFloat(academicRecordForm.cie_marks) : null,
      total_internal_marks: academicRecordForm.total_internal_marks ? parseFloat(academicRecordForm.total_internal_marks) : null,
      marks_obtained: academicRecordForm.marks_obtained ? parseFloat(academicRecordForm.marks_obtained) : null,
      credits_obtained: academicRecordForm.credits_obtained ? parseFloat(academicRecordForm.credits_obtained) : null,
      sgpa: academicRecordForm.sgpa ? parseFloat(academicRecordForm.sgpa) : null,
    };

    try {
      let res;
      if (editingAcademicRecord) {
        res = await authFetch(
          apiUrl(`/api/students/${selectedStudent.id}/academic-records/${editingAcademicRecord.id}/`),
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await authFetch(
          apiUrl(`/api/students/${selectedStudent.id}/academic-records/`),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      }

      if (res.ok) {
        toast({
          title: 'Success',
          description: editingAcademicRecord ? 'Academic record updated successfully.' : 'Academic record added successfully.',
        });
        setAcademicRecordDialogOpen(false);
        loadAcademicRecords(selectedStudent.id);
      } else {
        const errorData = await res.json();
        toast({
          title: 'Error',
          description: errorData.detail || 'Failed to save academic record.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAcademicRecord = async (recordId: number) => {
    if (!selectedStudent) return;
    if (!confirm('Are you sure you want to delete this academic record?')) return;

    try {
      const res = await authFetch(
        apiUrl(`/api/students/${selectedStudent.id}/academic-records/${recordId}/`),
        { method: 'DELETE' }
      );

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Academic record deleted successfully.',
        });
        loadAcademicRecords(selectedStudent.id);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete academic record.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    }
  };

  const loadMentorAttendance = async (studentId: number) => {
    setMentorAttendanceLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${studentId}/mentor-attendance/`));
      if (res.ok) {
        const data = await res.json();
        setMentorAttendanceRecords(Array.isArray(data) ? data : []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load mentor attendance records.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    } finally {
      setMentorAttendanceLoading(false);
    }
  };

  const handleViewMentorAttendance = (student: AssignedStudent) => {
    setSelectedStudent(student);
    loadMentorAttendance(student.id);
    setActiveTab('mentor-attendance');
  };

  const handleViewCounsellingNotes = (student: AssignedStudent) => {
    setSelectedStudent(student);
    loadCounsellingNotes(student.id);
    setActiveTab('counselling-notes');
  };

  const handleAddMentorAttendance = () => {
    setEditingMentorAttendance(null);
    setMentorAttendanceForm({
      month: '',
      semester: '',
      academic_year: '',
      total_classes: '',
      classes_attended: '',
      remarks: '',
    });
    setMentorAttendanceDialogOpen(true);
  };

  const handleEditMentorAttendance = (record: MentorAttendanceRecord) => {
    setEditingMentorAttendance(record);
    setMentorAttendanceForm({
      month: record.month,
      semester: record.semester,
      academic_year: record.academic_year,
      total_classes: record.total_classes.toString(),
      classes_attended: record.classes_attended.toString(),
      remarks: record.remarks || '',
    });
    setMentorAttendanceDialogOpen(true);
  };

  const handleSaveMentorAttendance = async () => {
    if (!selectedStudent) return;

    const payload = {
      ...mentorAttendanceForm,
      total_classes: parseInt(mentorAttendanceForm.total_classes) || 0,
      classes_attended: parseInt(mentorAttendanceForm.classes_attended) || 0,
    };

    try {
      let res;
      if (editingMentorAttendance) {
        res = await authFetch(
          apiUrl(`/api/students/${selectedStudent.id}/mentor-attendance/${editingMentorAttendance.id}/`),
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await authFetch(
          apiUrl(`/api/students/${selectedStudent.id}/mentor-attendance/`),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      }

      if (res.ok) {
        toast({
          title: 'Success',
          description: editingMentorAttendance ? 'Attendance record updated successfully.' : 'Attendance record added successfully.',
        });
        setMentorAttendanceDialogOpen(false);
        loadMentorAttendance(selectedStudent.id);
      } else {
        const errorData = await res.json();
        toast({
          title: 'Error',
          description: errorData.detail || 'Failed to save attendance record.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMentorAttendance = async (recordId: number) => {
    if (!selectedStudent) return;
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    try {
      const res = await authFetch(
        apiUrl(`/api/students/${selectedStudent.id}/mentor-attendance/${recordId}/`),
        { method: 'DELETE' }
      );

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Attendance record deleted successfully.',
        });
        loadMentorAttendance(selectedStudent.id);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete attendance record.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mentor Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.name || 'Mentor'}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="students">
              <Users className="w-4 h-4 mr-2" />
              My Students
            </TabsTrigger>
            <TabsTrigger value="all-students">
              <UserCheck className="w-4 h-4 mr-2" />
              View Complete Profile
            </TabsTrigger>
            <TabsTrigger value="academic-records">
              <FileText className="w-4 h-4 mr-2" />
              Academic Profile
            </TabsTrigger>
            <TabsTrigger value="mentor-attendance">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="counselling-notes">
              <Heart className="w-4 h-4 mr-2" />
              Counselling Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{assignedStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {assignedStudents.filter(s => !s.is_detained).length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Detained Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {assignedStudents.filter(s => s.is_detained).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter and Sort Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="search"
                          placeholder="Search by name, roll number, or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <select
                        id="department"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <select
                        id="year"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                      >
                        <option value="">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sort">Sort By</Label>
                      <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                      >
                        <option value="name">Name</option>
                        <option value="roll_number">Roll Number</option>
                        <option value="department">Department</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students List */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Students</CardTitle>
                  <CardDescription>
                    {finalSortedStudents.length} student{finalSortedStudents.length !== 1 ? 's' : ''} assigned to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading students...</div>
                  ) : finalSortedStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No students found</p>
                      <p className="text-sm text-gray-400">
                        {searchQuery || filterDepartment || filterYear 
                          ? 'Try adjusting your filters' 
                          : 'You haven\'t been assigned any students yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {finalSortedStudents.map((student) => (
                        <div
                          key={student.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full">
                                  <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">
                                      {student.full_name || student.username}
                                    </h3>
                                    {student.is_detained && (
                                      <Badge variant="destructive" className="text-xs">
                                        Detained
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Roll No:</span>
                                      <span>{student.roll_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4" />
                                      <span>{student.email}</span>
                                    </div>
                                    {student.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{student.phone}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="w-4 h-4" />
                                      <span>{student.department || 'N/A'} - {student.year || 'N/A'}</span>
                                    </div>
                                    {student.section && (
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Section:</span>
                                        <span>{student.section}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-sm">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStudentProfile(student)}
                                className="w-full md:w-auto bg-purple-50 hover:bg-purple-100 border-purple-200"
                              >
                                <User className="w-4 h-4 mr-2" />
                                View Complete Profile
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAcademicRecords(student)}
                                className="w-full md:w-auto bg-blue-50 hover:bg-blue-100 border-blue-200"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Academic Records
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewMentorAttendance(student)}
                                className="w-full md:w-auto bg-green-50 hover:bg-green-100 border-green-200"
                              >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Attendance
                                {student.attendance_percentage !== null && (
                                  <Badge 
                                    className={`ml-2 text-xs ${
                                      student.attendance_percentage >= 75
                                        ? 'bg-green-100 text-green-800'
                                        : student.attendance_percentage >= 60
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {student.attendance_percentage.toFixed(1)}%
                                  </Badge>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCounsellingNotes(student)}
                                className="w-full md:w-auto bg-pink-50 hover:bg-pink-100 border-pink-200"
                              >
                                <Heart className="w-4 h-4 mr-2" />
                                Counselling Notes
                              </Button>
                              <div className="text-gray-500">
                                Assigned: {new Date(student.assigned_at).toLocaleDateString()}
                              </div>
                              {student.assignment_notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-yellow-800 max-w-xs">
                                  <span className="font-medium">Note:</span> {student.assignment_notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Students Tab - View Complete Profile */}
          <TabsContent value="all-students">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">View Complete Profile</h2>
                  <p className="text-gray-600">View all students in the system</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Students</CardTitle>
                  <CardDescription>
                    Complete list of all students with their profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allStudentsLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading students...</div>
                  ) : allStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No students found</div>
                  ) : (
                    <div className="space-y-4">
                      {allStudents.map((student) => (
                        <div
                          key={student.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedStudent(student);
                            setStudentProfileOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {student.full_name || student.username}
                                </h3>
                                {student.is_detained && (
                                  <Badge variant="destructive">Detained</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Roll No:</span> {student.roll_number || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Year:</span> {student.year || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Dept:</span> {student.department || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Section:</span> {student.section || 'N/A'}
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {student.email}
                              </div>
                              {student.phone && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Phone:</span> {student.phone}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(student);
                                setStudentProfileOpen(true);
                              }}
                            >
                              <User className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Records Tab */}
          <TabsContent value="academic-records">
            {!selectedStudent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Academic Records</h2>
                    <p className="text-gray-600">Select a student to view their academic records</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>
                      Click on a student to view their academic records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allStudentsLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading students...</div>
                    ) : allStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No students found</div>
                    ) : (
                      <div className="space-y-3">
                        {allStudents.map((student) => (
                          <div
                            key={student.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedStudent(student);
                              loadAcademicRecords(student.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {student.full_name || student.username}
                                  </h3>
                                  {student.is_detained && (
                                    <Badge variant="destructive">Detained</Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Roll No:</span> {student.roll_number || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Year:</span> {student.year || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Dept:</span> {student.department || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Section:</span> {student.section || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                View Records
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)} className="mb-2">
                      ← Back to All Students
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900">Academic Records</h2>
                    <p className="text-gray-600">
                      {selectedStudent.full_name || selectedStudent.username} - {selectedStudent.roll_number || 'N/A'}
                    </p>
                  </div>
                  <Button onClick={handleAddAcademicRecord} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Academic Record
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>
                      Track and manage academic records for {selectedStudent.full_name || selectedStudent.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {academicRecordsLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading academic records...</div>
                    ) : academicRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No academic records found</p>
                        <p className="text-sm text-gray-400">Click "Add Academic Record" to start tracking academic performance</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {academicRecords.map((record) => (
                          <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">{record.course_name}</h3>
                                  <Badge variant="outline">{record.semester}</Badge>
                                  <Badge variant="outline">{record.academic_year}</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Mid-1:</span>
                                    <span className="ml-1 font-medium">{record.mid1_marks || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Mid-2:</span>
                                    <span className="ml-1 font-medium">{record.mid2_marks || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">CIE:</span>
                                    <span className="ml-1 font-medium">{record.cie_marks || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Total Internal:</span>
                                    <span className="ml-1 font-medium">{record.total_internal_marks || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Marks Obtained:</span>
                                    <span className="ml-1 font-medium">{record.marks_obtained || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Credits:</span>
                                    <span className="ml-1 font-medium">{record.credits_obtained || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">SGPA:</span>
                                    <span className="ml-1 font-medium">{record.sgpa || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Grade:</span>
                                    <span className="ml-1 font-medium">{record.grade || 'N/A'}</span>
                                  </div>
                                </div>
                                {record.audit_course_cleared && (
                                  <div className="mt-2">
                                    <Badge className="bg-green-100 text-green-800">Audit Course Cleared</Badge>
                                  </div>
                                )}
                                {record.remarks && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Remarks:</span> {record.remarks}
                                  </div>
                                )}
                                <div className="mt-2 text-xs text-gray-500">
                                  Last updated: {new Date(record.updated_at).toLocaleString()} by {record.updated_by_name || 'Unknown'}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAcademicRecord(record)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAcademicRecord(record.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
                )}
            </TabsContent>

          {/* Mentor Attendance Tab */}
          <TabsContent value="mentor-attendance">
            {!selectedStudent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
                    <p className="text-gray-600">Select a student to view their attendance records</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>
                      Click on a student to view their attendance records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allStudentsLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading students...</div>
                    ) : allStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No students found</div>
                    ) : (
                      <div className="space-y-3">
                        {allStudents.map((student) => (
                          <div
                            key={student.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedStudent(student);
                              loadMentorAttendance(student.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {student.full_name || student.username}
                                  </h3>
                                  {student.is_detained && (
                                    <Badge variant="destructive">Detained</Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Roll No:</span> {student.roll_number || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Year:</span> {student.year || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Dept:</span> {student.department || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Section:</span> {student.section || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                View Attendance
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)} className="mb-2">
                      ← Back to All Students
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
                    <p className="text-gray-600">
                      {selectedStudent.full_name || selectedStudent.username} - {selectedStudent.roll_number || 'N/A'}
                    </p>
                  </div>
                  <Button onClick={handleAddMentorAttendance} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attendance Record
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Attendance</CardTitle>
                    <CardDescription>
                      Track and manage attendance records for {selectedStudent.full_name || selectedStudent.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mentorAttendanceLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading attendance records...</div>
                    ) : mentorAttendanceRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No attendance records found</p>
                        <p className="text-sm text-gray-400">Click "Add Attendance Record" to start tracking attendance</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mentorAttendanceRecords.map((record) => (
                          <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">{record.month}</h3>
                                  <Badge variant="outline">{record.semester}</Badge>
                                  <Badge variant="outline">{record.academic_year}</Badge>
                                  <Badge 
                                    className={
                                      record.attendance_percentage >= 75 
                                        ? 'bg-green-100 text-green-800' 
                                        : record.attendance_percentage >= 60 
                                          ? 'bg-yellow-100 text-yellow-800' 
                                          : 'bg-red-100 text-red-800'
                                    }
                                  >
                                    {record.attendance_percentage.toFixed(2)}%
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Total Classes:</span>
                                    <span className="ml-1 font-medium">{record.total_classes}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Classes Attended:</span>
                                    <span className="ml-1 font-medium">{record.classes_attended}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Attendance %:</span>
                                    <span className="ml-1 font-medium">{record.attendance_percentage.toFixed(2)}%</span>
                                  </div>
                                </div>
                                {record.remarks && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Remarks:</span> {record.remarks}
                                  </div>
                                )}
                                <div className="mt-2 text-xs text-gray-500">
                                  Last updated: {new Date(record.updated_at).toLocaleString()} by {record.mentor_name || 'Unknown'}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditMentorAttendance(record)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteMentorAttendance(record.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
                )}
            </TabsContent>

          {/* Counselling Notes Tab */}
          <TabsContent value="counselling-notes">
            {!selectedStudent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Counselling Notes</h2>
                    <p className="text-gray-600">Select a student to view their counselling notes</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>
                      Click on a student to view their counselling notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allStudentsLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading students...</div>
                    ) : allStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No students found</div>
                    ) : (
                      <div className="space-y-3">
                        {allStudents.map((student) => (
                          <div
                            key={student.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedStudent(student);
                              loadCounsellingNotes(student.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {student.full_name || student.username}
                                  </h3>
                                  {student.is_detained && (
                                    <Badge variant="destructive">Detained</Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Roll No:</span> {student.roll_number || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Year:</span> {student.year || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Dept:</span> {student.department || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Section:</span> {student.section || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Heart className="w-4 h-4 mr-2" />
                                View Notes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)} className="mb-2">
                      ← Back to All Students
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900">Counselling Notes</h2>
                    <p className="text-gray-600">
                      {selectedStudent.full_name || selectedStudent.username} - {selectedStudent.roll_number || 'N/A'}
                    </p>
                  </div>
                    <Button onClick={() => handleOpenCounsellingNoteDialog()} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Counselling Note
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    {counsellingNotesLoading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : counsellingNotes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No counselling notes yet. Click "Add Counselling Note" to start tracking.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {counsellingNotes.map((note) => (
                          <div key={note.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <Badge variant="outline">{format(parseISO(note.counselling_date), 'PPP')}</Badge>
                                  <Badge variant="secondary" className="capitalize">{note.category || 'General'}</Badge>
                                  {note.training && (
                                    <Badge variant="outline" className="capitalize">{note.training.replace('_', ' ')}</Badge>
                                  )}
                                  {note.remarks_status && (
                                    <Badge 
                                      variant={
                                        note.remarks_status === 'comfortable' ? 'default' :
                                        note.remarks_status === 'need_help' ? 'destructive' :
                                        note.remarks_status === 'in_progress' ? 'secondary' :
                                        'outline'
                                      }
                                      className="capitalize"
                                    >
                                      {note.remarks_status.replace('_', ' ')}
                                    </Badge>
                                  )}
                                  <span className="text-sm text-gray-500">by {note.mentor_name}</span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{note.remarks}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenCounsellingNoteDialog(note)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCounsellingNote(note.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
                )}
            </TabsContent>

          {/* Counselling Notes Tab */}
          <TabsContent value="counselling-notes">
            {!selectedStudent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Career Records</h2>
                    <p className="text-gray-600">Select a student to view their career records</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>
                      Click on a student to view their career records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allStudentsLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading students...</div>
                    ) : allStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No students found</div>
                    ) : (
                      <div className="space-y-3">
                        {allStudents.map((student) => (
                          <div
                            key={student.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedStudent(student);
                              loadStudentCareerInfo(student.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {student.full_name || student.username}
                                  </h3>
                                  {student.is_detained && (
                                    <Badge variant="destructive">Detained</Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Roll No:</span> {student.roll_number || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Year:</span> {student.year || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Dept:</span> {student.department || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Section:</span> {student.section || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Briefcase className="w-4 h-4 mr-2" />
                                View Career
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)} className="mb-2">
                      ← Back to All Students
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900">Career Records</h2>
                    <p className="text-gray-600">
                      {selectedStudent.full_name || selectedStudent.username} - {selectedStudent.roll_number || 'N/A'}
                    </p>
                  </div>
                  <Button onClick={() => handleOpenStudentCareerDialog(studentCareerRecords.length > 0 ? studentCareerRecords[0] : null)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {studentCareerRecords.length > 0 ? 'Edit Career Information' : 'Add Career Information'}
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Career Information</CardTitle>
                    <CardDescription>
                      Track and manage career records for {selectedStudent.full_name || selectedStudent.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {studentCareerLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading career information...</div>
                    ) : studentCareerRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No career information found</p>
                        <p className="text-sm text-gray-400">Click "Edit Career Information" to add career details</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {studentCareerRecords.map((record) => (
                          <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                {/* Career Planning Section */}
                                <h4 className="font-semibold text-sm mb-3">Career Planning</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  {record.career_goal && (
                                    <div>
                                      <span className="text-gray-600">Career Goal:</span>
                                      <span className="ml-1 font-medium">{record.career_goal}</span>
                                    </div>
                                  )}
                                  {record.expected_package && (
                                    <div>
                                      <span className="text-gray-600">Expected Package:</span>
                                      <span className="ml-1 font-medium">{record.expected_package} LPA</span>
                                    </div>
                                  )}
                                  {record.desired_role && (
                                    <div>
                                      <span className="text-gray-600">Desired Role:</span>
                                      <span className="ml-1 font-medium">{record.desired_role}</span>
                                    </div>
                                  )}
                                  {record.dream_company && (
                                    <div>
                                      <span className="text-gray-600">Dream Company:</span>
                                      <span className="ml-1 font-medium">{record.dream_company}</span>
                                    </div>
                                  )}
                                </div>
                                {record.help_needed && (
                                  <div className="mt-3 text-sm text-gray-600">
                                    <span className="font-medium">Help Needed:</span> {record.help_needed}
                                  </div>
                                )}
                                {record.faculty_suggestions && (
                                  <div className="mt-3 text-sm bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3">
                                    <span className="font-medium text-blue-700 dark:text-blue-300">Faculty Suggestions:</span> {record.faculty_suggestions}
                                  </div>
                                )}
                                
                                {/* Traditional Career Information */}
                                {(record.career_status || record.company_name || record.job_role || record.placement_date || record.salary_package) && (
                                  <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-semibold text-sm mb-3">Placement Information</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                      {record.career_status && (
                                        <h3 className="font-semibold text-gray-900">{record.career_status.replace('_', ' ')}</h3>
                                      )}
                                      {record.company_name && (
                                        <Badge variant="outline">{record.company_name}</Badge>
                                      )}
                                      {record.job_role && (
                                        <Badge variant="secondary">{record.job_role}</Badge>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                      {record.placement_date && (
                                        <div>
                                          <span className="text-gray-600">Placement Date:</span>
                                          <span className="ml-1 font-medium">{format(parseISO(record.placement_date), 'PPP')}</span>
                                        </div>
                                      )}
                                      {record.salary_package && (
                                        <div>
                                          <span className="text-gray-600">Salary:</span>
                                          <span className="ml-1 font-medium">{record.salary_package}</span>
                                        </div>
                                      )}
                                      {record.resume_status && (
                                        <div>
                                          <span className="text-gray-600">Resume Status:</span>
                                          <span className="ml-1 font-medium">{record.resume_status}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenStudentCareerDialog(record)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
                )}
            </TabsContent>
        </Tabs>
      </main>

      {/* Student Profile Dialog */}
      <Dialog open={studentProfileOpen} onOpenChange={setStudentProfileOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Student Mentoring Record</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Complete profile and academic information</p>
              </div>
              <div className="flex items-center gap-2">
                {!editingStudentProfile && (
                  <Button variant="outline" size="sm" onClick={handleEditStudentProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => {
                  setStudentProfileOpen(false);
                  setEditingStudentProfile(false);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {editingStudentProfile && (
                <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" onClick={() => setEditingStudentProfile(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveStudentProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
              {/* Basic Information */}
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-900">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    {selectedStudent.photo ? (
                      <img
                        src={selectedStudent.photo.startsWith('http') ? selectedStudent.photo : apiUrl(selectedStudent.photo)}
                        alt="Student Photo"
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          console.error('Photo load error:', e);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.full_name || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, full_name: e.target.value })}
                          placeholder="Full Name"
                        />
                      ) : (
                        <>
                          <p className="font-semibold text-lg">{selectedStudent.full_name || selectedStudent.username}</p>
                          <p className="text-sm text-gray-600">{selectedStudent.roll_number || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.email || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, email: e.target.value })}
                        placeholder="Email"
                        disabled
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.phone || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, phone: e.target.value })}
                        placeholder="Phone"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.phone || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.department || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, department: e.target.value })}
                        placeholder="Department"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.department || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Section</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.section || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, section: e.target.value })}
                        placeholder="Section"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.section || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Year</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.year || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, year: e.target.value })}
                        placeholder="Year"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.year || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    {editingStudentProfile ? (
                      <Input
                        type="date"
                        value={studentProfileForm.date_of_birth || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, date_of_birth: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.date_of_birth ? format(parseISO(selectedStudent.date_of_birth), 'PPP') : 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                    {editingStudentProfile ? (
                      <Input
                        type="date"
                        value={studentProfileForm.date_of_joining || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, date_of_joining: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.date_of_joining ? format(parseISO(selectedStudent.date_of_joining), 'PPP') : 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-green-900">
                  <User className="w-5 h-5" />
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Guardian Name</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.guardian_name || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, guardian_name: e.target.value })}
                        placeholder="Guardian Name"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.guardian_name || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Guardian Relation</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.guardian_relation || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, guardian_relation: e.target.value })}
                        placeholder="Guardian Relation"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.guardian_relation || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Guardian Mobile</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.guardian_mobile || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, guardian_mobile: e.target.value })}
                        placeholder="Guardian Mobile"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.guardian_mobile || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Occupation</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.occupation || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, occupation: e.target.value })}
                        placeholder="Occupation"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.occupation || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Annual Income</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.income || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, income: e.target.value })}
                        placeholder="Annual Income"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.income ? `₹${selectedStudent.income.toLocaleString()}` : 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4 bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-orange-900">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.address || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, address: e.target.value })}
                        placeholder="Address"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{selectedStudent.address || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.city || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, city: e.target.value })}
                        placeholder="City"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.city || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.state || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, state: e.target.value })}
                        placeholder="State"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.state || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pincode</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.pincode || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, pincode: e.target.value })}
                        placeholder="Pincode"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.pincode || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Residential Details</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.residential_details || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, residential_details: e.target.value })}
                        placeholder="Residential Details"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.residential_details || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mode of Transport</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.mode_of_transport || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, mode_of_transport: e.target.value })}
                        placeholder="Mode of Transport"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.mode_of_transport || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4 bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                  <BookOpen className="w-5 h-5" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Admission Category</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.admission_category || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, admission_category: e.target.value })}
                        placeholder="Admission Category"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.admission_category || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">EAPCET Rank</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.eapcet_rank || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, eapcet_rank: e.target.value })}
                        placeholder="EAPCET Rank"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.eapcet_rank || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ECET Rank</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.ecet_rank || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, ecet_rank: e.target.value })}
                        placeholder="ECET Rank"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.ecet_rank || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reservation Category</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.reservation_category || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, reservation_category: e.target.value })}
                        placeholder="Reservation Category"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.reservation_category || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scholarship</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.scholarship || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, scholarship: e.target.value })}
                        placeholder="Scholarship"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.scholarship || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Educational Profile */}
              <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-indigo-900">
                  <GraduationCap className="w-5 h-5" />
                  Educational Profile
                </h3>
                
                {/* SSC Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">SSC/CBSE/ICSE (10th Standard)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Board</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.ssc_board || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, ssc_board: e.target.value })}
                          placeholder="Board"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.ssc_board || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">School Name</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.ssc_school || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, ssc_school: e.target.value })}
                          placeholder="School Name"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.ssc_school || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Percentage/CGPA</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.ssc_percentage || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, ssc_percentage: e.target.value })}
                          placeholder="Percentage"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.ssc_percentage ? `${selectedStudent.ssc_percentage}%` : 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Class/Distinction</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.ssc_class || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, ssc_class: e.target.value })}
                          placeholder="Class"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.ssc_class || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Intermediate Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Intermediate/Diploma (12th Standard)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Board</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.intermediate_board || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, intermediate_board: e.target.value })}
                          placeholder="Board"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.intermediate_board || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">College Name</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.intermediate_college || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, intermediate_college: e.target.value })}
                          placeholder="College Name"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.intermediate_college || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Percentage/CGPA</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.intermediate_percentage || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, intermediate_percentage: e.target.value })}
                          placeholder="Percentage"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.intermediate_percentage ? `${selectedStudent.intermediate_percentage}%` : 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Class/Distinction</label>
                      {editingStudentProfile ? (
                        <Input
                          value={studentProfileForm.intermediate_class || ''}
                          onChange={(e) => setStudentProfileForm({ ...studentProfileForm, intermediate_class: e.target.value })}
                          placeholder="Class"
                        />
                      ) : (
                        <p className="text-sm">{selectedStudent.intermediate_class || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Language Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Medium of Instruction</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.medium_of_instruction || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, medium_of_instruction: e.target.value })}
                        placeholder="Medium of Instruction"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.medium_of_instruction || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Local Language</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.local || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, local: e.target.value })}
                        placeholder="Local Language"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.local || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mother Tongue</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.mother_tongue || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, mother_tongue: e.target.value })}
                        placeholder="Mother Tongue"
                      />
                    ) : (
                      <p className="text-sm">{selectedStudent.mother_tongue || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4 bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-pink-900">
                  <FileText className="w-5 h-5" />
                  Additional Information
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Achievements
                    </label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.achievements || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, achievements: e.target.value })}
                        placeholder="Achievements"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{selectedStudent.achievements || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Hobbies
                    </label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.hobbies || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, hobbies: e.target.value })}
                        placeholder="Hobbies"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{selectedStudent.hobbies || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Areas of Interest
                    </label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.areas_of_interest || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, areas_of_interest: e.target.value })}
                        placeholder="Areas of Interest"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{selectedStudent.areas_of_interest || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Other Information</label>
                    {editingStudentProfile ? (
                      <Input
                        value={studentProfileForm.other_information || ''}
                        onChange={(e) => setStudentProfileForm({ ...studentProfileForm, other_information: e.target.value })}
                        placeholder="Other Information"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{selectedStudent.other_information || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Achievements Section */}
              <div className="space-y-4 bg-violet-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-violet-900">
                    <Award className="w-5 h-5" />
                    Student Achievements
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (selectedStudent) {
                        loadStudentAchievements(selectedStudent.id);
                        setStudentAchievementsOpen(true);
                      }
                    }}
                  >
                    View All Achievements
                  </Button>
                </div>
                <div className="grid gap-2">
                  {studentAchievements.length === 0 ? (
                    <p className="text-sm text-gray-600">No achievements recorded by student.</p>
                  ) : (
                    studentAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {achievement.achievement_type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize text-xs">
                            {achievement.participation_level}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm">{achievement.activity_name}</p>
                        <p className="text-xs text-gray-600">{achievement.event_name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(parseISO(achievement.date_achieved), 'PPP')}
                        </p>
                      </div>
                    ))
                  )}
                  {studentAchievements.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      And {studentAchievements.length - 3} more achievements...
                    </p>
                  )}
                </div>
              </div>

              {/* Mentor Remarks Section */}
              <div className="space-y-4 bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-amber-900">
                    <FileText className="w-5 h-5" />
                    Mentor Remarks
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (selectedStudent) {
                        loadMentorRemarks(selectedStudent.id);
                        setMentorRemarksDialogOpen(true);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Remark
                  </Button>
                </div>
                <div className="grid gap-2">
                  {mentorRemarks.length === 0 ? (
                    <p className="text-sm text-gray-600">No mentor remarks recorded yet.</p>
                  ) : (
                    mentorRemarks.slice(0, 3).map((remark) => (
                      <div key={remark.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {remark.mentoring_area}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(parseISO(remark.remark_date), 'PPP')}
                          </span>
                        </div>
                        <p className="text-sm mb-1">{remark.remarks}</p>
                        <p className="text-xs text-gray-500">
                          By: {remark.mentor_name}
                        </p>
                      </div>
                    ))
                  )}
                  {mentorRemarks.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      And {mentorRemarks.length - 3} more remarks...
                    </p>
                  )}
                </div>
                {mentorRemarks.length > 0 && (() => {
                  const lastDate = new Date(mentorRemarks[0].remark_date);
                  const nextDate = new Date(lastDate);
                  nextDate.setDate(nextDate.getDate() + 15);
                  return (
                    <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                      <p className="font-medium">Next remark due: {format(nextDate, 'PPP')}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Counselling Notes Section */}
              <div className="space-y-4 bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                    <FileText className="w-5 h-5" />
                    Counselling Notes
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (selectedStudent) {
                        loadCounsellingNotes(selectedStudent.id);
                        setCounsellingNotesDialogOpen(true);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Counselling Note
                  </Button>
                </div>
                <div className="grid gap-2">
                  {counsellingNotes.length === 0 ? (
                    <p className="text-sm text-gray-600">No counselling notes recorded yet.</p>
                  ) : (
                    counsellingNotes.slice(0, 3).map((note) => (
                      <div key={note.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {format(parseISO(note.counselling_date), 'PPP')}
                          </Badge>
                          <span className="text-xs text-gray-500">by {note.mentor_name}</span>
                        </div>
                        <p className="text-sm line-clamp-2">{note.remarks}</p>
                      </div>
                    ))
                  )}
                  {counsellingNotes.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      And {counsellingNotes.length - 3} more counselling notes...
                    </p>
                  )}
                </div>
                {counsellingNotes.length > 0 && (() => {
                  const lastDate = new Date(counsellingNotes[0].counselling_date);
                  const nextDate = new Date(lastDate);
                  nextDate.setDate(nextDate.getDate() + 15);
                  return (
                    <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                      <p className="font-medium">Next counselling due: {format(nextDate, 'PPP')}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Training Section */}
              <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-teal-900">
                    <TrendingUp className="w-5 h-5" />
                    Training Records
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (selectedStudent) {
                        loadStudentTrainingRecords(selectedStudent.id);
                        setStudentTrainingDialogOpen(true);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Training
                  </Button>
                </div>
                <div className="grid gap-2">
                  {studentTrainingRecords.length === 0 ? (
                    <p className="text-sm text-gray-600">No training records recorded yet.</p>
                  ) : (
                    studentTrainingRecords.slice(0, 3).map((training) => (
                      <div key={training.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {training.training_type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {format(parseISO(training.start_date), 'MMM yyyy')}
                          </Badge>
                          {training.certification_obtained && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Certified</Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm">{training.training_name}</p>
                        <p className="text-xs text-gray-600">{training.organization || 'N/A'}</p>
                      </div>
                    ))
                  )}
                  {studentTrainingRecords.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      And {studentTrainingRecords.length - 3} more training records...
                    </p>
                  )}
                </div>
              </div>

              {/* Career Section */}
              <div className="space-y-4 bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-emerald-900">
                    <Briefcase className="w-5 h-5" />
                    Career Information
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (selectedStudent) {
                        loadStudentCareerRecords(selectedStudent.id);
                        setStudentCareerDialogOpen(true);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Career Info
                  </Button>
                </div>
                <div className="grid gap-2">
                  {studentCareerRecords.length === 0 ? (
                    <p className="text-sm text-gray-600">No career records recorded yet.</p>
                  ) : (
                    studentCareerRecords.slice(0, 3).map((career) => (
                      <div key={career.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            className={`capitalize text-xs ${
                              career.career_status === 'placed' 
                                ? 'bg-green-100 text-green-800' 
                                : career.career_status === 'seeking' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {career.career_status.replace('_', ' ')}
                          </Badge>
                          {career.company_name && (
                            <Badge variant="outline" className="text-xs">{career.company_name}</Badge>
                          )}
                        </div>
                        <p className="text-sm">{career.job_role || 'N/A'}</p>
                        {career.placement_date && (
                          <p className="text-xs text-gray-600">
                            Placed: {format(parseISO(career.placement_date), 'PPP')}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                  {studentCareerRecords.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      And {studentCareerRecords.length - 3} more career records...
                    </p>
                  )}
                </div>
              </div>

              {/* Assignment Notes */}
              {selectedStudent.assignment_notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Assignment Notes</h3>
                  <p className="text-sm">{selectedStudent.assignment_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Academic Record Dialog */}
      <Dialog open={academicRecordDialogOpen} onOpenChange={setAcademicRecordDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingAcademicRecord ? 'Edit Academic Record' : 'Add Academic Record'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAcademicRecordDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course_name">Course Name *</Label>
                <Input
                  id="course_name"
                  value={academicRecordForm.course_name}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, course_name: e.target.value })}
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Input
                  id="semester"
                  value={academicRecordForm.semester}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, semester: e.target.value })}
                  placeholder="e.g., 1-1, 2-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year *</Label>
                <Input
                  id="academic_year"
                  value={academicRecordForm.academic_year}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, academic_year: e.target.value })}
                  placeholder="e.g., 2023-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={academicRecordForm.grade}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, grade: e.target.value })}
                  placeholder="e.g., O, A+, A, B+"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mid1_marks">Mid-1 Marks</Label>
                <Input
                  id="mid1_marks"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.mid1_marks}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, mid1_marks: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mid2_marks">Mid-2 Marks</Label>
                <Input
                  id="mid2_marks"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.mid2_marks}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, mid2_marks: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cie_marks">CIE/Internal Marks</Label>
                <Input
                  id="cie_marks"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.cie_marks}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, cie_marks: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_internal_marks">Total Internal Marks</Label>
                <Input
                  id="total_internal_marks"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.total_internal_marks}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, total_internal_marks: e.target.value })}
                  placeholder="0-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marks_obtained">Marks Obtained</Label>
                <Input
                  id="marks_obtained"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.marks_obtained}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, marks_obtained: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits_obtained">Credits Obtained</Label>
                <Input
                  id="credits_obtained"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.credits_obtained}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, credits_obtained: e.target.value })}
                  placeholder="e.g., 3, 4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sgpa">SGPA</Label>
                <Input
                  id="sgpa"
                  type="number"
                  step="0.01"
                  value={academicRecordForm.sgpa}
                  onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, sgpa: e.target.value })}
                  placeholder="0-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="audit_course_cleared"
                checked={academicRecordForm.audit_course_cleared}
                onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, audit_course_cleared: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="audit_course_cleared">Audit Course Cleared</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <textarea
                id="remarks"
                value={academicRecordForm.remarks}
                onChange={(e) => setAcademicRecordForm({ ...academicRecordForm, remarks: e.target.value })}
                placeholder="Additional remarks about academic performance..."
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setAcademicRecordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAcademicRecord} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {editingAcademicRecord ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mentor Attendance Dialog */}
      <Dialog open={mentorAttendanceDialogOpen} onOpenChange={setMentorAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingMentorAttendance ? 'Edit Attendance Record' : 'Add Attendance Record'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMentorAttendanceDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <select
                  id="month"
                  value={mentorAttendanceForm.month}
                  onChange={(e) => setMentorAttendanceForm({ ...mentorAttendanceForm, month: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Input
                  id="semester"
                  value={mentorAttendanceForm.semester}
                  onChange={(e) => setMentorAttendanceForm({ ...mentorAttendanceForm, semester: e.target.value })}
                  placeholder="e.g., 1-1, 2-2"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="academic_year">Academic Year *</Label>
                <Input
                  id="academic_year"
                  value={mentorAttendanceForm.academic_year}
                  onChange={(e) => setMentorAttendanceForm({ ...mentorAttendanceForm, academic_year: e.target.value })}
                  placeholder="e.g., 2023-24"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_classes">Total Classes *</Label>
                <Input
                  id="total_classes"
                  type="number"
                  min="0"
                  value={mentorAttendanceForm.total_classes}
                  onChange={(e) => setMentorAttendanceForm({ ...mentorAttendanceForm, total_classes: e.target.value })}
                  placeholder="e.g., 45"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classes_attended">Classes Attended *</Label>
                <Input
                  id="classes_attended"
                  type="number"
                  min="0"
                  value={mentorAttendanceForm.classes_attended}
                  onChange={(e) => setMentorAttendanceForm({ ...mentorAttendanceForm, classes_attended: e.target.value })}
                  placeholder="e.g., 42"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Calculated Attendance:</strong> {mentorAttendanceForm.total_classes && mentorAttendanceForm.classes_attended 
                  ? `${((parseInt(mentorAttendanceForm.classes_attended) / parseInt(mentorAttendanceForm.total_classes)) * 100).toFixed(2)}%`
                  : '—'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance_remarks">Remarks</Label>
              <textarea
                id="attendance_remarks"
                value={mentorAttendanceForm.remarks}
                onChange={(e) => setMentorAttendanceForm({ ...mentorAttendanceForm, remarks: e.target.value })}
                placeholder="Additional remarks about attendance..."
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setMentorAttendanceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMentorAttendance} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {editingMentorAttendance ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Achievements Dialog */}
      <Dialog open={studentAchievementsOpen} onOpenChange={setStudentAchievementsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Student Achievements</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStudentAchievementsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {studentAchievementsLoading ? (
              <p className="text-sm text-gray-600 text-center py-8">Loading achievements...</p>
            ) : studentAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">No achievements recorded by this student.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentAchievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {achievement.achievement_type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {achievement.participation_level}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-lg">{achievement.activity_name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.event_name}</p>
                        <p className="text-sm mb-2">{achievement.achievement_details}</p>
                        <p className="text-xs text-gray-500">
                          Date: {format(parseISO(achievement.date_achieved), 'PPP')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mentor Remarks Dialog */}
      <Dialog open={mentorRemarksDialogOpen} onOpenChange={setMentorRemarksDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingMentorRemark ? 'Edit Mentor Remark' : 'Add Mentor Remark'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMentorRemarksDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="remark_date">Remark Date *</Label>
                <Input
                  id="remark_date"
                  type="date"
                  value={mentorRemarkForm.remark_date}
                  onChange={(e) => setMentorRemarkForm({ ...mentorRemarkForm, remark_date: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Default: Every 15 days from last remark. You can override to a specific date.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentoring_area">Area of Mentoring *</Label>
                <Select
                  value={mentorRemarkForm.mentoring_area}
                  onValueChange={(value) => setMentorRemarkForm({ ...mentorRemarkForm, mentoring_area: value })}
                >
                  <SelectTrigger id="mentoring_area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="discipline">Discipline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks *</Label>
              <textarea
                id="remarks"
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your mentor remarks..."
                value={mentorRemarkForm.remarks}
                onChange={(e) => setMentorRemarkForm({ ...mentorRemarkForm, remarks: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setMentorRemarksDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMentorRemark}>
                {editingMentorRemark ? 'Update Remark' : 'Add Remark'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Counselling Notes Dialog */}
      <Dialog open={counsellingNotesDialogOpen} onOpenChange={setCounsellingNotesDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingCounsellingNote ? 'Edit Counselling Note' : 'Add Counselling Note'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCounsellingNotesDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counselling_date">Counselling Date *</Label>
              <Input
                id="counselling_date"
                type="date"
                value={counsellingNoteForm.counselling_date}
                onChange={(e) => setCounsellingNoteForm({ ...counsellingNoteForm, counselling_date: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Default: Every 15 days from last counselling note. You can override to a specific date.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counselling_category">Category *</Label>
              <Select
                value={counsellingNoteForm.category}
                onValueChange={(value) => setCounsellingNoteForm({ ...counsellingNoteForm, category: value })}
              >
                <SelectTrigger id="counselling_category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="behaviour">Behaviour</SelectItem>
                  <SelectItem value="student_links">Student Links</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {counsellingNoteForm.category === 'training' && (
              <div className="space-y-2">
                <Label htmlFor="counselling_training">Training *</Label>
                <Select
                  value={counsellingNoteForm.training}
                  onValueChange={(value) => setCounsellingNoteForm({ ...counsellingNoteForm, training: value })}
                >
                  <SelectTrigger id="counselling_training">
                    <SelectValue placeholder="Select training" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pps">PPS</SelectItem>
                    <SelectItem value="oop">OOP</SelectItem>
                    <SelectItem value="dbms">DBMS</SelectItem>
                    <SelectItem value="ds">DS</SelectItem>
                    <SelectItem value="daa">DAA</SelectItem>
                    <SelectItem value="console_apps">Console Apps</SelectItem>
                    <SelectItem value="backend_framework">Backend Framework/API</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="iot_hardware">IOT Hardware</SelectItem>
                    <SelectItem value="data_analytics">Data Analytics</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="counselling_remarks_status">Remarks Status *</Label>
              <Select
                value={counsellingNoteForm.remarks_status}
                onValueChange={(value) => setCounsellingNoteForm({ ...counsellingNoteForm, remarks_status: value })}
              >
                <SelectTrigger id="counselling_remarks_status">
                  <SelectValue placeholder="Select remarks status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="na">NA</SelectItem>
                  <SelectItem value="yet_to_start">Yet to Start</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="need_help">Need Help</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counselling_remarks">Remarks *</Label>
              <textarea
                id="counselling_remarks"
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your counselling remarks..."
                value={counsellingNoteForm.remarks}
                onChange={(e) => setCounsellingNoteForm({ ...counsellingNoteForm, remarks: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setCounsellingNotesDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCounsellingNote}>
                {editingCounsellingNote ? 'Update Note' : 'Add Note'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Behaviour Dialog */}
      <Dialog open={studentBehaviourDialogOpen} onOpenChange={setStudentBehaviourDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingStudentBehaviour ? 'Edit Behaviour Record' : 'Add Behaviour Record'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStudentBehaviourDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="behaviour_category">Behaviour Category *</Label>
                <Select
                  value={studentBehaviourForm.behaviour_category}
                  onValueChange={(value) => setStudentBehaviourForm({ ...studentBehaviourForm, behaviour_category: value })}
                >
                  <SelectTrigger id="behaviour_category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discipline">Discipline</SelectItem>
                    <SelectItem value="participation">Class Participation</SelectItem>
                    <SelectItem value="teamwork">Teamwork</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="time_management">Time Management</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5) *</Label>
                <Select
                  value={studentBehaviourForm.rating}
                  onValueChange={(value) => setStudentBehaviourForm({ ...studentBehaviourForm, rating: value })}
                >
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessment_date">Assessment Date *</Label>
              <Input
                id="assessment_date"
                type="date"
                value={studentBehaviourForm.assessment_date}
                onChange={(e) => setStudentBehaviourForm({ ...studentBehaviourForm, assessment_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positive_aspects">Positive Aspects</Label>
              <textarea
                id="positive_aspects"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Positive aspects observed..."
                value={studentBehaviourForm.positive_aspects}
                onChange={(e) => setStudentBehaviourForm({ ...studentBehaviourForm, positive_aspects: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areas_for_improvement">Areas for Improvement</Label>
              <textarea
                id="areas_for_improvement"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Areas needing improvement..."
                value={studentBehaviourForm.areas_for_improvement}
                onChange={(e) => setStudentBehaviourForm({ ...studentBehaviourForm, areas_for_improvement: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action_plan">Action Plan</Label>
              <textarea
                id="action_plan"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Action plan for improvement..."
                value={studentBehaviourForm.action_plan}
                onChange={(e) => setStudentBehaviourForm({ ...studentBehaviourForm, action_plan: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="behaviour_remarks">Remarks</Label>
              <textarea
                id="behaviour_remarks"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional remarks about behaviour..."
                value={studentBehaviourForm.remarks}
                onChange={(e) => setStudentBehaviourForm({ ...studentBehaviourForm, remarks: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStudentBehaviourDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStudentBehaviour}>
                {editingStudentBehaviour ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Career Dialog */}
      <Dialog open={studentCareerDialogOpen} onOpenChange={setStudentCareerDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingStudentCareer ? 'Edit Career Information' : 'Edit Career Information'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStudentCareerDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="career_status">Career Status *</Label>
                <Select
                  value={studentCareerForm.career_status}
                  onValueChange={(value) => setStudentCareerForm({ ...studentCareerForm, career_status: value })}
                >
                  <SelectTrigger id="career_status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placed">Placed</SelectItem>
                    <SelectItem value="seeking">Seeking Opportunities</SelectItem>
                    <SelectItem value="higher_studies">Pursuing Higher Studies</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="not_placed">Not Placed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={studentCareerForm.company_name}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, company_name: e.target.value })}
                  placeholder="Company name if placed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_role">Job Role</Label>
                <Input
                  id="job_role"
                  value={studentCareerForm.job_role}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, job_role: e.target.value })}
                  placeholder="Job role/designation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement_date">Placement Date</Label>
                <Input
                  id="placement_date"
                  type="date"
                  value={studentCareerForm.placement_date}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, placement_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_package">Salary Package</Label>
                <Input
                  id="salary_package"
                  value={studentCareerForm.salary_package}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, salary_package: e.target.value })}
                  placeholder="e.g., 6 LPA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume_status">Resume Status</Label>
                <Input
                  id="resume_status"
                  value={studentCareerForm.resume_status}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, resume_status: e.target.value })}
                  placeholder="Resume preparation status"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills_for_career">Skills for Career</Label>
              <textarea
                id="skills_for_career"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Skills relevant for career..."
                value={studentCareerForm.skills_for_career}
                onChange={(e) => setStudentCareerForm({ ...studentCareerForm, skills_for_career: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="career_goals">Career Goals</Label>
              <textarea
                id="career_goals"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Student career goals..."
                value={studentCareerForm.career_goals}
                onChange={(e) => setStudentCareerForm({ ...studentCareerForm, career_goals: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guidance_provided">Guidance Provided</Label>
              <textarea
                id="guidance_provided"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Career guidance provided by mentor..."
                value={studentCareerForm.guidance_provided}
                onChange={(e) => setStudentCareerForm({ ...studentCareerForm, guidance_provided: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interview_preparation">Interview Preparation</Label>
              <textarea
                id="interview_preparation"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Interview preparation notes..."
                value={studentCareerForm.interview_preparation}
                onChange={(e) => setStudentCareerForm({ ...studentCareerForm, interview_preparation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="career_remarks">Remarks</Label>
              <textarea
                id="career_remarks"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional remarks about career..."
                value={studentCareerForm.remarks}
                onChange={(e) => setStudentCareerForm({ ...studentCareerForm, remarks: e.target.value })}
              />
            </div>
            
            {/* New Career Planning Fields */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-sm mb-3">Career Planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="career_goal">What do you want to become?</Label>
                  <Input
                    id="career_goal"
                    value={studentCareerForm.career_goal}
                    onChange={(e) => setStudentCareerForm({ ...studentCareerForm, career_goal: e.target.value })}
                    placeholder="e.g., Software Engineer, Data Scientist"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_package">Expected Package</Label>
                  <Select
                    value={studentCareerForm.expected_package}
                    onValueChange={(value) => setStudentCareerForm({ ...studentCareerForm, expected_package: value })}
                  >
                    <SelectTrigger id="expected_package">
                      <SelectValue placeholder="Select expected package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-6">3-6 LPA</SelectItem>
                      <SelectItem value="6-10">6-10 LPA</SelectItem>
                      <SelectItem value="10-15">10-15 LPA</SelectItem>
                      <SelectItem value="15-20">15-20 LPA</SelectItem>
                      <SelectItem value="20-25">20-25 LPA</SelectItem>
                      <SelectItem value="25+">25+ LPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desired_role">Which role do you want to do?</Label>
                  <Input
                    id="desired_role"
                    value={studentCareerForm.desired_role}
                    onChange={(e) => setStudentCareerForm({ ...studentCareerForm, desired_role: e.target.value })}
                    placeholder="e.g., Frontend Developer, Backend Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dream_company">Dream company to work?</Label>
                  <Input
                    id="dream_company"
                    value={studentCareerForm.dream_company}
                    onChange={(e) => setStudentCareerForm({ ...studentCareerForm, dream_company: e.target.value })}
                    placeholder="e.g., Google, Microsoft, Amazon"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="help_needed">Need any help?</Label>
                <textarea
                  id="help_needed"
                  className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe any help or guidance needed..."
                  value={studentCareerForm.help_needed}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, help_needed: e.target.value })}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="faculty_suggestions">Suggestions from Faculty</Label>
                <textarea
                  id="faculty_suggestions"
                  className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add your suggestions and guidance..."
                  value={studentCareerForm.faculty_suggestions}
                  onChange={(e) => setStudentCareerForm({ ...studentCareerForm, faculty_suggestions: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStudentCareerDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStudentCareer}>
                Save Career Information
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Link Dialog */}
      <Dialog open={studentLinkDialogOpen} onOpenChange={setStudentLinkDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingStudentLink ? 'Edit Link Record' : 'Add Link Record'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStudentLinkDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_title">Link Title *</Label>
                <Input
                  id="link_title"
                  value={studentLinkForm.link_title}
                  onChange={(e) => setStudentLinkForm({ ...studentLinkForm, link_title: e.target.value })}
                  placeholder="Title of the link/resource"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_category">Link Category *</Label>
                <Select
                  value={studentLinkForm.link_category}
                  onValueChange={(value) => setStudentLinkForm({ ...studentLinkForm, link_category: value })}
                >
                  <SelectTrigger id="link_category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic Resources</SelectItem>
                    <SelectItem value="career">Career Resources</SelectItem>
                    <SelectItem value="skill_development">Skill Development</SelectItem>
                    <SelectItem value="certification">Certification Resources</SelectItem>
                    <SelectItem value="placement">Placement Resources</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_url">Link URL *</Label>
              <Input
                id="link_url"
                value={studentLinkForm.link_url}
                onChange={(e) => setStudentLinkForm({ ...studentLinkForm, link_url: e.target.value })}
                placeholder="https://example.com/resource"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importance">Importance</Label>
                <Input
                  id="importance"
                  value={studentLinkForm.importance}
                  onChange={(e) => setStudentLinkForm({ ...studentLinkForm, importance: e.target.value })}
                  placeholder="e.g., High, Medium, Low"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={studentLinkForm.status}
                  onValueChange={(value) => setStudentLinkForm({ ...studentLinkForm, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description of the resource..."
                value={studentLinkForm.description}
                onChange={(e) => setStudentLinkForm({ ...studentLinkForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_remarks">Remarks</Label>
              <textarea
                id="link_remarks"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional remarks about the link..."
                value={studentLinkForm.remarks}
                onChange={(e) => setStudentLinkForm({ ...studentLinkForm, remarks: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStudentLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStudentLink}>
                {editingStudentLink ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Training Dialog */}
      <Dialog open={studentTrainingDialogOpen} onOpenChange={setStudentTrainingDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingStudentTraining ? 'Edit Training Record' : 'Add Training Record'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.full_name || selectedStudent?.username} - {selectedStudent?.roll_number || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStudentTrainingDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="training_name">Training Name *</Label>
                <Input
                  id="training_name"
                  value={studentTrainingForm.training_name}
                  onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, training_name: e.target.value })}
                  placeholder="Name of the training program"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="training_type">Training Type *</Label>
                <Select
                  value={studentTrainingForm.training_type}
                  onValueChange={(value) => setStudentTrainingForm({ ...studentTrainingForm, training_type: value })}
                >
                  <SelectTrigger id="training_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Training</SelectItem>
                    <SelectItem value="soft_skills">Soft Skills Training</SelectItem>
                    <SelectItem value="industry">Industry Training</SelectItem>
                    <SelectItem value="certification">Certification Program</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={studentTrainingForm.organization}
                  onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, organization: e.target.value })}
                  placeholder="Organization providing training"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duration (Hours)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={studentTrainingForm.duration_hours}
                  onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, duration_hours: e.target.value })}
                  placeholder="Duration in hours"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={studentTrainingForm.start_date}
                  onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={studentTrainingForm.end_date}
                  onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills_learned">Skills Learned</Label>
              <textarea
                id="skills_learned"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Skills learned during training..."
                value={studentTrainingForm.skills_learned}
                onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, skills_learned: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="certification_obtained"
                checked={studentTrainingForm.certification_obtained}
                onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, certification_obtained: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="certification_obtained">Certification Obtained</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificate_name">Certificate Name</Label>
              <Input
                id="certificate_name"
                value={studentTrainingForm.certificate_name}
                onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, certificate_name: e.target.value })}
                placeholder="Name of certificate obtained"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="training_remarks">Remarks</Label>
              <textarea
                id="training_remarks"
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional remarks about the training..."
                value={studentTrainingForm.remarks}
                onChange={(e) => setStudentTrainingForm({ ...studentTrainingForm, remarks: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStudentTrainingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStudentTraining}>
                {editingStudentTraining ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};