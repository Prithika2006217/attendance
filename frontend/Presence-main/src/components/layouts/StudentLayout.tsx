import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import QRCode from 'react-qr-code';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  BookOpen,
  Calendar as CalendarIcon,
  AlertTriangle,
  TrendingUp,
  Users,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Save,
  Lock,
  Scan,
  Camera,
  Award,
  Plus,
  Trash2,
  FileText,
  Briefcase
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { db } from '@/lib/mockDb';
import { toast } from '@/hooks/use-toast';
import { apiUrl, authFetch } from '@/lib/api';
import { formatStudentSectionsDisplay, parseStudentSections } from '@/lib/studentSections';
import { format, parseISO } from 'date-fns';

export const StudentLayout: React.FC = () => {
  const { user, logout, updateSessionUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiProfile, setApiProfile] = useState<{
    full_name: string | null;
    roll_number: string | null;
    phone: string | null;
    department: string | null;
    section: string | null;
    sections?: string[];
    year: string | null;
    email: string;
    is_detained?: boolean;
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
  } | null>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    full_name: '',
    roll_number: '',
    email: '',
    phone: '',
    department: '',
    sections: [] as string[],
    year: '',
    date_of_birth: '',
    date_of_joining: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_mobile: '',
    occupation: '',
    income: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    admission_category: '',
    eapcet_rank: '',
    ecet_rank: '',
    reservation_category: '',
    scholarship: '',
    residential_details: '',
    mode_of_transport: '',
    photo: null as File | null,
    ssc_board: '',
    ssc_school: '',
    ssc_percentage: '',
    ssc_class: '',
    intermediate_board: '',
    intermediate_college: '',
    intermediate_percentage: '',
    intermediate_class: '',
    medium_of_instruction: '',
    local: '',
    mother_tongue: '',
    achievements: '',
    hobbies: '',
    areas_of_interest: '',
    other_information: ''
  });
  const [mentorAttendanceRecords, setMentorAttendanceRecords] = useState<{
    id: number;
    month: string;
    semester: string;
    academic_year: string;
    total_classes: number;
    classes_attended: number;
    attendance_percentage: number;
    remarks: string | null;
    mentor_name: string;
    updated_at: string;
  }[]>([]);
  const [mentorAttendanceLoading, setMentorAttendanceLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [apiDepartments, setApiDepartments] = useState<Array<{ id: number; name: string; code: string }>>([]);
  const [apiSections, setApiSections] = useState<Array<{ id: number; name: string }>>([]);
  
  // Achievements state
  const [achievements, setAchievements] = useState<{
    id: number;
    achievement_type: string;
    activity_name: string;
    event_name: string;
    participation_level: string;
    achievement_details: string;
    date_achieved: string;
    created_at: string;
    updated_at: string;
  }[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<typeof achievements[0] | null>(null);
  const [achievementForm, setAchievementForm] = useState({
    achievement_type: '',
    activity_name: '',
    event_name: '',
    participation_level: '',
    achievement_details: '',
    date_achieved: ''
  });
  
  // Mentor Remarks state
  const [mentorRemarks, setMentorRemarks] = useState<{
    id: number;
    mentor_name: string;
    mentor_email: string;
    remark_date: string;
    mentoring_area: string;
    remarks: string;
    created_at: string;
    updated_at: string;
  }[]>([]);
  const [mentorRemarksLoading, setMentorRemarksLoading] = useState(false);

  // Counselling Notes state
  const [counsellingNotes, setCounsellingNotes] = useState<{
    id: number;
    mentor_name: string;
    mentor_email: string;
    counselling_date: string;
    category: string;
    training: string;
    remarks_status: string;
    remarks: string;
    created_at: string;
    updated_at: string;
  }[]>([]);
  const [counsellingNotesLoading, setCounsellingNotesLoading] = useState(false);

  // Career state
  const [careerInfo, setCareerInfo] = useState<{
    id: number | null;
    career_goal: string;
    expected_package: string;
    desired_role: string;
    dream_company: string;
    help_needed: string;
    faculty_suggestions: string;
  }>({
    id: null,
    career_goal: '',
    expected_package: '',
    desired_role: '',
    dream_company: '',
    help_needed: '',
    faculty_suggestions: ''
  });
  const [careerLoading, setCareerLoading] = useState(false);
  const [careerEditOpen, setCareerEditOpen] = useState(false);
  const [careerForm, setCareerForm] = useState({
    career_goal: '',
    expected_package: '',
    desired_role: '',
    dream_company: '',
    help_needed: ''
  });

  /** QR Attendance state for students */
  const [qrScanningOpen, setQrScanningOpen] = useState(false);
  const [qrSessionId, setQrSessionId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-scanner';

  const numericId = user?.id && /^\d+$/.test(String(user.id)) ? Number(user.id) : null;
  useEffect(() => {
    if (numericId == null || (activeTab !== 'profile' && activeTab !== 'dashboard' && activeTab !== 'student-details' && activeTab !== 'educational-profile')) return;
    const fetchProfile = async () => {
      try {
        const res = await authFetch(apiUrl(`/api/users/${numericId}/`));
        if (res.ok) setApiProfile(await res.json());
      } catch {
        setApiProfile(null);
      }
    };
    fetchProfile();
  }, [numericId, activeTab]);

  const fetchDepartments = () => {
    authFetch(apiUrl('/api/departments/'))
      .then(res => res.ok ? res.json() : [])
      .then((data: unknown) => setApiDepartments(Array.isArray(data) ? data : []))
      .catch(() => setApiDepartments([]));
  };
  const fetchSections = () => {
    authFetch(apiUrl('/api/sections/'))
      .then(res => res.ok ? res.json() : [])
      .then((data: unknown) => setApiSections(Array.isArray(data) ? data : []))
      .catch(() => setApiSections([]));
  };
  useEffect(() => {
    if (activeTab !== 'profile') return;
    fetchDepartments();
    fetchSections();
  }, [activeTab]);

  const handleOpenEditProfile = async () => {
    if (apiDepartments.length === 0) fetchDepartments();
    if (apiSections.length === 0) fetchSections();
    let profile = apiProfile;
    if (numericId != null && !profile) {
      try {
        const res = await authFetch(apiUrl(`/api/users/${numericId}/`));
        if (res.ok) {
          profile = await res.json();
          setApiProfile(profile);
        }
      } catch {
        toast({ title: 'Could not load profile', variant: 'destructive' });
        return;
      }
    }
    if (profile) {
      setProfileEditForm({
        full_name: profile.full_name || '',
        roll_number: profile.roll_number || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        department: profile.department || '',
        sections: parseStudentSections(profile),
        year: profile.year || '',
        date_of_birth: profile.date_of_birth || '',
        date_of_joining: profile.date_of_joining || '',
        guardian_name: profile.guardian_name || '',
        guardian_relation: profile.guardian_relation || '',
        guardian_mobile: profile.guardian_mobile || '',
        occupation: profile.occupation || '',
        income: profile.income ? String(profile.income) : '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        admission_category: profile.admission_category || '',
        eapcet_rank: profile.eapcet_rank ? String(profile.eapcet_rank) : '',
        ecet_rank: profile.ecet_rank ? String(profile.ecet_rank) : '',
        reservation_category: profile.reservation_category || '',
        scholarship: profile.scholarship || '',
        residential_details: profile.residential_details || '',
        mode_of_transport: profile.mode_of_transport || '',
        photo: null,
        ssc_board: profile.ssc_board || '',
        ssc_school: profile.ssc_school || '',
        ssc_percentage: profile.ssc_percentage ? String(profile.ssc_percentage) : '',
        ssc_class: profile.ssc_class || '',
        intermediate_board: profile.intermediate_board || '',
        intermediate_college: profile.intermediate_college || '',
        intermediate_percentage: profile.intermediate_percentage ? String(profile.intermediate_percentage) : '',
        intermediate_class: profile.intermediate_class || '',
        medium_of_instruction: profile.medium_of_instruction || '',
        local: profile.local || '',
        mother_tongue: profile.mother_tongue || '',
        achievements: profile.achievements || '',
        hobbies: profile.hobbies || '',
        areas_of_interest: profile.areas_of_interest || '',
        other_information: profile.other_information || ''
      });
      setProfileEditOpen(true);
    }
  };

  const handleSaveEditProfile = async () => {
    if (numericId == null) return;
    try {
      const formData = new FormData();
      formData.append('full_name', profileEditForm.full_name);
      formData.append('roll_number', profileEditForm.roll_number);
      formData.append('email', profileEditForm.email.trim() || '');
      formData.append('phone', profileEditForm.phone);
      formData.append('department', profileEditForm.department);
      formData.append('year', profileEditForm.year);
      formData.append('sections', JSON.stringify(profileEditForm.sections));
      
      // Add student details fields
      if (profileEditForm.date_of_birth) formData.append('date_of_birth', profileEditForm.date_of_birth);
      if (profileEditForm.date_of_joining) formData.append('date_of_joining', profileEditForm.date_of_joining);
      if (profileEditForm.guardian_name) formData.append('guardian_name', profileEditForm.guardian_name);
      if (profileEditForm.guardian_relation) formData.append('guardian_relation', profileEditForm.guardian_relation);
      if (profileEditForm.guardian_mobile) formData.append('guardian_mobile', profileEditForm.guardian_mobile);
      if (profileEditForm.occupation) formData.append('occupation', profileEditForm.occupation);
      if (profileEditForm.income) formData.append('income', profileEditForm.income);
      if (profileEditForm.address) formData.append('address', profileEditForm.address);
      if (profileEditForm.city) formData.append('city', profileEditForm.city);
      if (profileEditForm.state) formData.append('state', profileEditForm.state);
      if (profileEditForm.pincode) formData.append('pincode', profileEditForm.pincode);
      if (profileEditForm.admission_category) formData.append('admission_category', profileEditForm.admission_category);
      if (profileEditForm.eapcet_rank) formData.append('eapcet_rank', profileEditForm.eapcet_rank);
      if (profileEditForm.ecet_rank) formData.append('ecet_rank', profileEditForm.ecet_rank);
      if (profileEditForm.reservation_category) formData.append('reservation_category', profileEditForm.reservation_category);
      if (profileEditForm.scholarship) formData.append('scholarship', profileEditForm.scholarship);
      if (profileEditForm.residential_details) formData.append('residential_details', profileEditForm.residential_details);
      if (profileEditForm.mode_of_transport) formData.append('mode_of_transport', profileEditForm.mode_of_transport);
      if (profileEditForm.photo) formData.append('photo', profileEditForm.photo);
      
      // Add educational profile fields
      if (profileEditForm.ssc_board) formData.append('ssc_board', profileEditForm.ssc_board);
      if (profileEditForm.ssc_school) formData.append('ssc_school', profileEditForm.ssc_school);
      if (profileEditForm.ssc_percentage) formData.append('ssc_percentage', profileEditForm.ssc_percentage);
      if (profileEditForm.ssc_class) formData.append('ssc_class', profileEditForm.ssc_class);
      if (profileEditForm.intermediate_board) formData.append('intermediate_board', profileEditForm.intermediate_board);
      if (profileEditForm.intermediate_college) formData.append('intermediate_college', profileEditForm.intermediate_college);
      if (profileEditForm.intermediate_percentage) formData.append('intermediate_percentage', profileEditForm.intermediate_percentage);
      if (profileEditForm.intermediate_class) formData.append('intermediate_class', profileEditForm.intermediate_class);
      if (profileEditForm.medium_of_instruction) formData.append('medium_of_instruction', profileEditForm.medium_of_instruction);
      if (profileEditForm.local) formData.append('local', profileEditForm.local);
      if (profileEditForm.mother_tongue) formData.append('mother_tongue', profileEditForm.mother_tongue);
      if (profileEditForm.achievements) formData.append('achievements', profileEditForm.achievements);
      if (profileEditForm.hobbies) formData.append('hobbies', profileEditForm.hobbies);
      if (profileEditForm.areas_of_interest) formData.append('areas_of_interest', profileEditForm.areas_of_interest);
      if (profileEditForm.other_information) formData.append('other_information', profileEditForm.other_information);

      const res = await authFetch(apiUrl(`/api/users/${numericId}/`), {
        method: 'PATCH',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });
      
      if (res.ok) {
        const updated = await res.json();
        setApiProfile(prev => prev ? { ...prev, ...updated } : null);
        updateSessionUser({
          email: typeof updated.email === 'string' ? updated.email : profileEditForm.email.trim(),
          name: typeof updated.full_name === 'string' ? updated.full_name : profileEditForm.full_name,
        });
        setProfileEditOpen(false);
        toast({ title: 'Profile updated', description: 'Your details have been saved.' });
      } else {
        toast({ title: 'Update failed', description: 'Please try again.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Update failed', description: 'Network error.', variant: 'destructive' });
    }
  };

  const handleChangePassword = async () => {
    if (numericId == null) return;
    if (changePasswordForm.new_password !== changePasswordForm.confirm_password) {
      toast({ title: 'Passwords do not match', description: 'New password and confirm must match.', variant: 'destructive' });
      return;
    }
    if (changePasswordForm.new_password.length < 1) {
      toast({ title: 'Invalid password', description: 'Enter a new password.', variant: 'destructive' });
      return;
    }
    try {
      const res = await authFetch(apiUrl(`/api/users/${numericId}/`), {
        method: 'PATCH',
        body: JSON.stringify({
          current_password: changePasswordForm.current_password,
          new_password: changePasswordForm.new_password
        })
      });
      if (res.ok) {
        setChangePasswordOpen(false);
        setChangePasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        toast({ title: 'Password changed', description: 'Your password has been updated.' });
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.current_password?.[0] || err.detail || 'Failed to change password.';
        toast({ title: 'Password change failed', description: String(msg), variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Password change failed', description: 'Network error.', variant: 'destructive' });
    }
  };

  const departments = apiDepartments;
  const student = db.getStudents().find(s => s.id === user?.id);
  const department = departments.find(d => d.code === apiProfile?.department);
  const mockAttendance = db.getStudentAttendance(user?.id || '');

  const [apiAttendance, setApiAttendance] = useState<{
    records: Array<{ subject: string; date: string; status: string; hours?: number | null; total_hours?: number | null }>;
    total_classes: number;
    present_count: number;
    attendance_percentage: number;
    total_attended_hours?: number;
    total_hours?: number;
  } | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showAllAttendanceOnDashboard, setShowAllAttendanceOnDashboard] = useState(false);
  const [dashboardSubjectFilters, setDashboardSubjectFilters] = useState<string[]>([]);
  const [isStudentAttendanceFrozen, setIsStudentAttendanceFrozen] = useState(false);
  useEffect(() => {
    authFetch(apiUrl('/api/attendance-portal-freeze/'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setIsStudentAttendanceFrozen(Boolean(data?.freeze_student_portal)))
      .catch(() => setIsStudentAttendanceFrozen(false));
  }, []);

  useEffect(() => {
    if (isStudentAttendanceFrozen && (activeTab === 'dashboard' || activeTab === 'attendance')) {
      setActiveTab('subjects');
    }
  }, [isStudentAttendanceFrozen, activeTab]);

  const loadMentorAttendance = async () => {
    if (numericId == null) return;
    setMentorAttendanceLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${numericId}/mentor-attendance/`));
      if (res.ok) {
        const data = await res.json();
        setMentorAttendanceRecords(Array.isArray(data) ? data : []);
      } else {
        setMentorAttendanceRecords([]);
      }
    } catch (error) {
      setMentorAttendanceRecords([]);
    } finally {
      setMentorAttendanceLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'attendance') {
      loadMentorAttendance();
    }
  }, [activeTab, numericId]);

  const loadAchievements = async () => {
    if (numericId == null) return;
    setAchievementsLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${numericId}/achievements/`));
      if (res.ok) {
        const data = await res.json();
        setAchievements(Array.isArray(data) ? data : []);
      } else {
        setAchievements([]);
      }
    } catch (error) {
      setAchievements([]);
    } finally {
      setAchievementsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'achievements') {
      loadAchievements();
    }
  }, [activeTab, numericId]);

  const loadMentorRemarks = async () => {
    if (numericId == null) return;
    setMentorRemarksLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${numericId}/mentor-remarks/`));
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

  const loadCounsellingNotes = async () => {
    if (numericId == null) return;
    setCounsellingNotesLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${numericId}/counselling-notes/`));
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

  useEffect(() => {
    if (activeTab === 'achievements') {
      loadMentorRemarks();
      loadCounsellingNotes();
      loadCareerInfo();
    }
  }, [activeTab, numericId]);

  const loadCareerInfo = async () => {
    if (numericId == null) return;
    setCareerLoading(true);
    try {
      const res = await authFetch(apiUrl(`/api/students/${numericId}/career/`));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const careerRecord = data[0];
          setCareerInfo({
            id: careerRecord.id,
            career_goal: careerRecord.career_goal || '',
            expected_package: careerRecord.expected_package || '',
            desired_role: careerRecord.desired_role || '',
            dream_company: careerRecord.dream_company || '',
            help_needed: careerRecord.help_needed || '',
            faculty_suggestions: careerRecord.faculty_suggestions || ''
          });
        } else {
          setCareerInfo({
            id: null,
            career_goal: '',
            expected_package: '',
            desired_role: '',
            dream_company: '',
            help_needed: '',
            faculty_suggestions: ''
          });
        }
      } else {
        setCareerInfo({
          id: null,
          career_goal: '',
          expected_package: '',
          desired_role: '',
          dream_company: '',
          help_needed: '',
          faculty_suggestions: ''
        });
      }
    } catch (error) {
      setCareerInfo({
        id: null,
        career_goal: '',
        expected_package: '',
        desired_role: '',
        dream_company: '',
        help_needed: '',
        faculty_suggestions: ''
      });
    } finally {
      setCareerLoading(false);
    }
  };

  const handleOpenCareerDialog = () => {
    setCareerForm({
      career_goal: careerInfo.career_goal,
      expected_package: careerInfo.expected_package,
      desired_role: careerInfo.desired_role,
      dream_company: careerInfo.dream_company,
      help_needed: careerInfo.help_needed
    });
    setCareerEditOpen(true);
  };

  const handleSaveCareer = async () => {
    if (numericId == null) return;
    try {
      const url = careerInfo.id
        ? apiUrl(`/api/students/${numericId}/career/${careerInfo.id}/`)
        : apiUrl(`/api/students/${numericId}/career/`);
      
      const method = careerInfo.id ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerForm)
      });

      if (res.ok) {
        setCareerEditOpen(false);
        loadCareerInfo();
        toast({
          title: 'Career information saved',
          description: 'Your career information has been saved successfully.'
        });
      } else {
        const errorData = await res.json();
        toast({
          title: 'Error saving career information',
          description: errorData.detail || 'Failed to save career information.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error saving career information',
        description: 'An error occurred while saving career information.',
        variant: 'destructive'
      });
    }
  };

  const handleOpenAchievementDialog = (achievement = null) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setAchievementForm({
        achievement_type: achievement.achievement_type,
        activity_name: achievement.activity_name,
        event_name: achievement.event_name,
        participation_level: achievement.participation_level,
        achievement_details: achievement.achievement_details,
        date_achieved: achievement.date_achieved
      });
    } else {
      setEditingAchievement(null);
      setAchievementForm({
        achievement_type: '',
        activity_name: '',
        event_name: '',
        participation_level: '',
        achievement_details: '',
        date_achieved: ''
      });
    }
    setAchievementDialogOpen(true);
  };

  const handleSaveAchievement = async () => {
    if (numericId == null) return;
    try {
      const url = editingAchievement
        ? apiUrl(`/api/students/${numericId}/achievements/${editingAchievement.id}/`)
        : apiUrl(`/api/students/${numericId}/achievements/`);
      
      const method = editingAchievement ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(achievementForm)
      });

      if (res.ok) {
        setAchievementDialogOpen(false);
        loadAchievements();
        toast({ 
          title: editingAchievement ? 'Achievement updated' : 'Achievement added',
          description: 'Your achievement has been saved successfully.' 
        });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ 
          title: 'Failed to save achievement', 
          description: err.detail || 'Please try again.', 
          variant: 'destructive' 
        });
      }
    } catch {
      toast({ 
        title: 'Failed to save achievement', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteAchievement = async (achievementId: number) => {
    if (numericId == null) return;
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    
    try {
      const res = await authFetch(apiUrl(`/api/students/${numericId}/achievements/${achievementId}/`), {
        method: 'DELETE'
      });

      if (res.ok) {
        loadAchievements();
        toast({ 
          title: 'Achievement deleted', 
          description: 'Your achievement has been removed.' 
        });
      } else {
        toast({ 
          title: 'Failed to delete achievement', 
          description: 'Please try again.', 
          variant: 'destructive' 
        });
      }
    } catch {
      toast({ 
        title: 'Failed to delete achievement', 
        description: 'Network error. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  useEffect(() => {
    if (numericId == null) return;
    if (isStudentAttendanceFrozen) {
      setApiAttendance(null);
      return;
    }
    const params = new URLSearchParams();
    if (fromDate) params.set('from_date', format(fromDate, 'yyyy-MM-dd'));
    if (toDate) params.set('to_date', format(toDate, 'yyyy-MM-dd'));
    const url = params.toString() ? apiUrl(`/api/attendance/?${params.toString()}`) : apiUrl('/api/attendance/');
    authFetch(url)
      .then(res => res.ok ? res.json() : null)
      .then(data => setApiAttendance(data))
      .catch(() => setApiAttendance(null));
  }, [numericId, fromDate, toDate, isStudentAttendanceFrozen]);

  const bySubject: Record<string, { present: number; total: number; attendedHours: number; totalHours: number }> = {};
  if (apiAttendance?.records) {
    apiAttendance.records.forEach((r: { subject?: string; status?: string; hours?: number | null; total_hours?: number | null }) => {
      const sub = r.subject || 'Other';
      if (!bySubject[sub]) bySubject[sub] = { present: 0, total: 0, attendedHours: 0, totalHours: 0 };
      const th = r.total_hours != null && r.total_hours > 0 ? Number(r.total_hours) : 1;
      const ah = r.hours != null ? Number(r.hours) : (r.status?.toLowerCase() === 'present' ? 1 : 0);
      bySubject[sub].total++;
      if (r.status?.toLowerCase() === 'present') bySubject[sub].present++;
      bySubject[sub].attendedHours += ah;
      bySubject[sub].totalHours += th;
    });
  }
  const studentAttendance = apiAttendance?.records?.length
    ? Object.entries(bySubject).map(([sub, s]) => ({
        subject: { id: sub, code: sub, name: sub, credits: 0 },
        present: s.present,
        total: s.total,
        attendedHours: s.attendedHours,
        totalHours: s.totalHours,
        percentage: s.totalHours > 0 ? Math.round((s.attendedHours / s.totalHours) * 100 * 100) / 100 : 0
      }))
    : mockAttendance;

  const displayName = apiProfile?.full_name || user?.name || student?.name;
  const displayRoll = apiProfile?.roll_number || student?.rollNumber || user?.rollNumber;
  const displayPhone = apiProfile?.phone || student?.phone;
  const displaySectionRaw = apiProfile ? formatStudentSectionsDisplay(apiProfile).replace(/^–$/, '') : (student?.section ?? '');
  const displayYear = apiProfile?.year || (student?.year != null ? String(student.year) : undefined);

  const overallStats = studentAttendance.reduce(
    (acc, subject) => {
      acc.totalClasses += subject.total;
      acc.presentClasses += subject.present;
      acc.attendedHours += (subject as { attendedHours?: number }).attendedHours ?? 0;
      acc.totalHours += (subject as { totalHours?: number }).totalHours ?? subject.total;
      return acc;
    },
    { totalClasses: 0, presentClasses: 0, attendedHours: 0, totalHours: 0 }
  );

  const overallPercentage = apiAttendance?.attendance_percentage != null
    ? Number(apiAttendance.attendance_percentage)
    : (overallStats.totalHours > 0
      ? Math.round((overallStats.attendedHours / overallStats.totalHours) * 100 * 100) / 100
      : (overallStats.totalClasses > 0 ? Math.round((overallStats.presentClasses / overallStats.totalClasses) * 100 * 100) / 100 : 0));

  const subjectChartData = studentAttendance.map(item => ({
    name: item.subject?.code || 'Unknown',
    percentage: item.percentage,
    present: item.present,
    absent: item.total - item.present
  }));

  const pieData = [
    {
      name: 'Present (classes)',
      value: Math.round(overallStats.attendedHours * 100) / 100,
      color: '#10B981',
    },
    {
      name: 'Absent (classes)',
      value: Math.max(
        0,
        Math.round((overallStats.totalHours - overallStats.attendedHours) * 100) / 100,
      ),
      color: '#EF4444',
    },
  ];

  const overallDateMetrics = (() => {
    if (!apiAttendance?.records?.length) {
      return { attendedDays: 0, totalDays: 0 };
    }
    const byDate: Record<string, { attended: number; total: number }> = {};
    apiAttendance.records.forEach(
      (r: { date?: string; status?: string; hours?: number | null; total_hours?: number | null }) => {
        const dateKey = String(r.date || '').slice(0, 10);
        if (!dateKey) return;
        const th = r.total_hours != null && Number(r.total_hours) > 0 ? Number(r.total_hours) : 1;
        const ah =
          r.hours != null ? Number(r.hours) : r.status?.toLowerCase() === 'present' ? th : 0;
        const clampedAh = Math.max(0, Math.min(th, ah));
        if (!byDate[dateKey]) byDate[dateKey] = { attended: 0, total: 0 };
        byDate[dateKey].total += th;
        byDate[dateKey].attended += clampedAh;
      },
    );
    const totalDays = Object.keys(byDate).length;
    const attendedDays = Object.values(byDate).filter(
      (d) => d.attended > 0 && d.total > 0,
    ).length;
    return { attendedDays, totalDays };
  })();

  const getAttendanceStatus = () => {
    if (overallPercentage >= 90) return { status: 'excellent', color: 'success', message: 'Excellent attendance!' };
    if (overallPercentage >= 85) return { status: 'good', color: 'primary', message: 'Good attendance' };
    if (overallPercentage >= 75) return { status: 'warning', color: 'warning', message: 'Attendance below recommended level' };
    return { status: 'critical', color: 'destructive', message: 'Critical: Attendance too low!' };
  };

  const attendanceStatus = getAttendanceStatus();

  const completeAttendance = apiAttendance?.records?.length
    ? [...apiAttendance.records]
        .sort((a, b) => (b.date > a.date ? 1 : -1))
        .map((r) => {
          const total = r.total_hours != null && Number(r.total_hours) > 0 ? Number(r.total_hours) : 1;
          const attended =
            r.hours != null ? Number(r.hours) : (r.status?.toLowerCase() === 'present' ? total : 0);
          return {
            subject: r.subject,
            date: r.date,
            status: r.status?.toLowerCase() || 'absent',
            attended: Math.max(0, Math.min(total, attended)),
            total,
          };
        })
    : db.getRecentAttendance(user?.id || '');
  const dashboardSubjectOptions = Array.from(
    new Set(completeAttendance.map((r) => String(r.subject || '').trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
  const completeAttendanceFilteredBySubject =
    dashboardSubjectFilters.length > 0
      ? completeAttendance.filter((r) => dashboardSubjectFilters.includes(String(r.subject || '').trim()))
      : completeAttendance;
  const hasDateFilter = !!fromDate || !!toDate;
  const attendanceToShowOnDashboard = hasDateFilter || showAllAttendanceOnDashboard
    ? completeAttendanceFilteredBySubject
    : completeAttendanceFilteredBySubject.slice(0, 10);

  // QR Attendance Handlers
  const handleQrMarkAttendance = async (qrData?: string) => {
    console.log('=== QR Attendance Mark Attendance Started ===');
    console.log('Input qrData:', qrData);
    console.log('Current qrSessionId:', qrSessionId);
    console.log('Current deviceId:', deviceId);
    console.log('Current user:', user);
    
    // If QR data is provided (from scan), use it; otherwise use manual entry
    const sessionInfo = qrData || qrSessionId;
    
    console.log('Session info to use:', sessionInfo);
    
    if (!sessionInfo) {
      console.error('No session info available');
      toast({ title: 'Validation Error', description: 'Please scan a valid QR code or enter session ID.', variant: 'destructive' });
      return;
    }

    // Validate session ID format - must be exactly 5 digits
    let sessionId: string;
    try {
      // Handle different input formats
      if (typeof sessionInfo === 'string') {
        // Remove any colons or tokens if present (from QR scan)
        const cleanSessionId = sessionInfo.split(':')[0];
        
        // For manual entry, require exactly 5 digits
        if (!cleanSessionId.match(/^\d{5}$/)) {
          console.error('Invalid session ID format:', cleanSessionId);
          toast({ title: 'Validation Error', description: 'Session ID must be exactly 5 digits (e.g., 12345).', variant: 'destructive' });
          return;
        }
        sessionId = cleanSessionId;
      } else {
        console.error('Invalid session ID type:', typeof sessionInfo);
        toast({ title: 'Validation Error', description: 'Invalid session ID format.', variant: 'destructive' });
        return;
      }
    } catch (e) {
      console.error('Error parsing session ID:', e);
      toast({ title: 'Validation Error', description: 'Invalid session ID format.', variant: 'destructive' });
      return;
    }
    
    console.log('Validated session ID:', sessionId);

    // Generate device ID if not provided
    const finalDeviceId = deviceId || `${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Final device ID:', finalDeviceId);
    setDeviceId(finalDeviceId);

    setIsScanning(true);
    setScanResult(null);

    try {
      const apiEndpoint = apiUrl('/api/qr-attendance/mark/');
      console.log('API Endpoint:', apiEndpoint);
      
      const payload = {
        session_id: sessionId,
        device_id: finalDeviceId
      };
      console.log('Request payload:', payload);

      const res = await authFetch(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      let data;
      try {
        const text = await res.text();
        console.log('Response text:', text);
        
        // Check if response is HTML (error page) instead of JSON
        if (text.trim().startsWith('<')) {
          console.error('Received HTML instead of JSON, likely server error');
          data = { detail: 'Server error. Please contact administrator.' };
        } else {
          data = JSON.parse(text);
          console.log('Parsed response data:', data);
        }
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        data = { detail: 'Invalid response from server' };
      }

      if (res.ok) {
        console.log('Attendance marked successfully');
        setScanResult({
          success: true,
          message: data.detail || 'Attendance marked successfully!'
        });
        toast({ title: 'Success', description: 'Your attendance has been marked.' });
        setQrScanningOpen(false);
        setQrSessionId('');
        setCameraError(null);
        setShowManualEntry(false);
      } else {
        console.error('Attendance marking failed:', data);
        setScanResult({
          success: false,
          message: data.detail || 'Failed to mark attendance.'
        });
        toast({ title: 'Error', description: data.detail || 'Failed to mark attendance', variant: 'destructive' });
      }
    } catch (error) {
      console.error('QR attendance network error:', error);
      setScanResult({
        success: false,
        message: 'Network error. Please try again.'
      });
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' });
    } finally {
      setIsScanning(false);
      console.log('=== QR Attendance Mark Attendance Ended ===');
    }
  };

  const handleQrScan = (decodedText: string) => {
    console.log('QR Scan result:', decodedText);
    
    if (!decodedText) {
      console.error('No QR data extracted from result');
      toast({ title: 'Scan Error', description: 'Could not read QR code data. Please try again.', variant: 'destructive' });
      return;
    }
    
    // Parse the QR data to extract session ID
    // Expected format: "session_id:token" where session_id is 5 digits
    const parts = decodedText.split(':');
    const sessionId = parts[0]; // Extract session ID
    
    console.log('Extracted session ID from QR:', sessionId);
    
    // Validate session ID format - must be exactly 5 digits
    if (!sessionId || !sessionId.match(/^\d{5}$/)) {
      console.error('Invalid session ID from QR:', sessionId);
      toast({ title: 'Invalid QR Code', description: 'QR code must contain exactly 5 digits for session ID.', variant: 'destructive' });
      return;
    }
    
    console.log('Validated session ID from QR:', sessionId);
    
    // Stop scanning after successful detection
    if (qrScannerRef.current) {
      qrScannerRef.current.stop().catch(console.error);
      qrScannerRef.current = null;
    }
    
    handleQrMarkAttendance(sessionId);
  };

  const handleQrError = (error: any) => {
    console.error('QR Scanner error:', error);
    let errorMessage = 'Camera access not available. Please use manual entry.';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera permission denied. Please allow camera access or use manual entry.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device. Please use manual entry.';
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is already in use. Please close other camera apps or use manual entry.';
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera does not support required features. Please use manual entry.';
    } else if (error.name === 'StreamApiNotSupportedError') {
      errorMessage = 'Your browser does not support camera access. Please use manual entry.';
    }
    
    setCameraError(errorMessage);
    setShowManualEntry(true);
  };

  // QR Scanner initialization and cleanup
  useEffect(() => {
    if (qrScanningOpen && !showManualEntry) {
      const startScanner = async () => {
        try {
          console.log('Starting QR scanner...');
          const html5QrCode = new Html5Qrcode(scannerElementId);
          qrScannerRef.current = html5QrCode;
          
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              console.log('QR Code detected:', decodedText);
              handleQrScan(decodedText);
            },
            (errorMessage) => {
              // Don't log frame errors to avoid console spam
              // console.log('QR Scanner error:', errorMessage);
            }
          );
          
          console.log('QR scanner started successfully');
          setCameraError(null);
        } catch (error) {
          console.error('Failed to start QR scanner:', error);
          setCameraError('Failed to start camera. Please use manual entry.');
          setShowManualEntry(true);
        }
      };
      
      startScanner();
      
      return () => {
        if (qrScannerRef.current) {
          console.log('Stopping QR scanner...');
          qrScannerRef.current.stop().catch(console.error);
          qrScannerRef.current = null;
        }
      };
    } else if (qrScannerRef.current) {
      // Stop scanner when dialog closes
      qrScannerRef.current.stop().catch(console.error);
      qrScannerRef.current = null;
    }
  }, [qrScanningOpen, showManualEntry]);

  // Generate device ID on mount
  useEffect(() => {
    const storedDeviceId = localStorage.getItem('qr_device_id');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = `${user?.id || 'unknown'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setDeviceId(newDeviceId);
      localStorage.setItem('qr_device_id', newDeviceId);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-md shadow-soft">
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground">{user?.name || 'Student'}</h1>
              <p className="text-sm text-muted-foreground">Welcome back</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Button variant="outline" onClick={logout} className="rounded-xl w-full sm:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap gap-1.5 h-auto p-1.5 rounded-xl bg-muted/80">
            <TabsTrigger value="dashboard" disabled={isStudentAttendanceFrozen}>Dashboard</TabsTrigger>
            <TabsTrigger value="attendance" disabled={isStudentAttendanceFrozen}>My Attendance</TabsTrigger>
            <TabsTrigger value="mentor-attendance">Mentor Attendance</TabsTrigger>
            <TabsTrigger value="qr-attendance" disabled={isStudentAttendanceFrozen}>QR Attendance</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="student-details">Student Details</TabsTrigger>
            <TabsTrigger value="educational-profile">Educational Profile</TabsTrigger>
            <TabsTrigger value="achievements">Records</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          {isStudentAttendanceFrozen && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attendance portal frozen</AlertTitle>
              <AlertDescription>
                Admin has temporarily frozen student attendance access. You can still use Subjects and Profile.
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {apiProfile?.is_detained && (
              <Alert variant="destructive" className="border-destructive/80">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Account marked as detained</AlertTitle>
                <AlertDescription>
                  Your record is listed as <strong>detained</strong>. You can still sign in to view your profile and past attendance, but you will not appear in class attendance lists until administration releases your account.
                </AlertDescription>
              </Alert>
            )}
            {/* Student Info Card */}
            <Card className="border-violet-200/50">
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{displayRoll || '–'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{department?.name || apiProfile?.department || '–'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Section(s)</p>
                    <p className="font-medium">{displaySectionRaw ? displaySectionRaw.split(',').map(s => s.trim()).filter(Boolean).join(', ') : '–'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{displayYear ? `${displayYear} Year` : '–'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Attendance</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-2xl">{overallPercentage}%</p>
                      <Badge variant={attendanceStatus.color as any}>
                        {attendanceStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                    {apiAttendance?.total_hours != null && apiAttendance.total_hours > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(apiAttendance.total_attended_hours ?? 0).toFixed(1)} / {apiAttendance.total_hours.toFixed(1)} hours
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(overallStats.totalHours * 100) / 100}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All subjects combined (1 hour = 1 class)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {Math.round(overallStats.attendedHours * 100) / 100}
                  </div>
                  <p className="text-xs text-muted-foreground">Present in class (hours)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes Missed</CardTitle>
                  <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {Math.max(
                      0,
                      Math.round((overallStats.totalHours - overallStats.attendedHours) * 100) /
                        100,
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Absent from class</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallPercentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {attendanceStatus.message}
                    {apiAttendance?.total_hours != null && apiAttendance.total_hours > 0 && (
                      <>
                        {' '}
                        · {(apiAttendance.total_attended_hours ?? 0).toFixed(1)} /{' '}
                        {apiAttendance.total_hours.toFixed(1)} hours · {overallDateMetrics.attendedDays}{' '}
                        / {overallDateMetrics.totalDays} days
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Warning */}
            {overallPercentage < 85 && (
              <Card className="border-warning bg-warning/5">
                <CardHeader>
                  <CardTitle className="flex items-center text-warning">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Attendance Warning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Your attendance is below the required 85%. You need to attend more classes to meet the minimum requirement.
                    {overallPercentage < 75 && (
                      <span className="block mt-2 font-medium text-destructive">
                        Warning: You may not be eligible to appear for exams if attendance doesn't improve.
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Attendance</CardTitle>
                  <CardDescription>Your attendance percentage by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Overall Attendance Breakdown</CardTitle>
                  <CardDescription>Present vs Absent classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </div>
                        <span className="font-medium">{item.value} classes</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Complete Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Attendance</CardTitle>
                <CardDescription>
                  Full attendance list. Use date filters to view attendance between specific dates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end mb-4">
                  <div className="space-y-1">
                    <Label>Subjects</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-56 justify-start text-left font-normal">
                          {dashboardSubjectFilters.length > 0
                            ? `${dashboardSubjectFilters.length} selected`
                            : 'All subjects'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-3 max-h-72 overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Quick actions</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setDashboardSubjectFilters(dashboardSubjectOptions)}>Select all</Button>
                            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setDashboardSubjectFilters([])}>Clear</Button>
                          </div>
                        </div>
                        {dashboardSubjectOptions.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No subjects in current attendance.</p>
                        ) : (
                          <div className="space-y-2">
                            {dashboardSubjectOptions.map((subject, idx) => (
                              <div key={subject} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`stu-dash-sub-${idx}`}
                                  checked={dashboardSubjectFilters.includes(subject)}
                                  onCheckedChange={(checked) =>
                                    setDashboardSubjectFilters(
                                      checked
                                        ? [...dashboardSubjectFilters, subject]
                                        : dashboardSubjectFilters.filter((v) => v !== subject),
                                    )
                                  }
                                />
                                <label htmlFor={`stu-dash-sub-${idx}`} className="text-sm cursor-pointer">{subject}</label>
                              </div>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <Label>From date</Label>
                    <Input
                      type="date"
                      value={fromDate ? format(fromDate, 'yyyy-MM-dd') : ''}
                      onChange={e => {
                        const v = e.target.value;
                        setFromDate(v ? new Date(v) : null);
                      }}
                      className="w-40"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>To date</Label>
                    <Input
                      type="date"
                      value={toDate ? format(toDate, 'yyyy-MM-dd') : ''}
                      onChange={e => {
                        const v = e.target.value;
                        setToDate(v ? new Date(v) : null);
                      }}
                      className="w-40"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFromDate(null);
                      setToDate(null);
                    }}
                  >
                    Clear dates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllAttendanceOnDashboard(prev => !prev)}
                    disabled={hasDateFilter}
                  >
                    {showAllAttendanceOnDashboard ? 'Show less' : 'Show all'}
                  </Button>
                </div>
                <div className="space-y-3">
                  {attendanceToShowOnDashboard.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No attendance records match the selected subject/date filters.</p>
                  ) : (
                    attendanceToShowOnDashboard.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <p className="font-medium">{record.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(record.date), 'PPP')}
                            </p>
                            {'attended' in record && 'total' in record && (
                              <p className="text-xs text-muted-foreground">
                                Attended: {Number(record.attended).toFixed(2).replace(/\.00$/, '')} / {Number(record.total).toFixed(2).replace(/\.00$/, '')} classes (hours)
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                          {record.status === 'present' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {record.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Attendance</CardTitle>
                <CardDescription>Subject-wise attendance breakdown. Filter by date range to see attendance between specific days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end mb-6">
                  <div className="space-y-1">
                    <Label>From date</Label>
                    <Input
                      type="date"
                      value={fromDate ? format(fromDate, 'yyyy-MM-dd') : ''}
                      onChange={e => {
                        const v = e.target.value;
                        setFromDate(v ? new Date(v) : null);
                      }}
                      className="w-40"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>To date</Label>
                    <Input
                      type="date"
                      value={toDate ? format(toDate, 'yyyy-MM-dd') : ''}
                      onChange={e => {
                        const v = e.target.value;
                        setToDate(v ? new Date(v) : null);
                      }}
                      className="w-40"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFromDate(null);
                      setToDate(null);
                    }}
                  >
                    Clear dates
                  </Button>
                </div>
                <div className="space-y-6">
                  {studentAttendance.map((item) => (
                    <div key={item.subject?.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.subject?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Code: {item.subject?.code} • Credits: {item.subject?.credits}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{item.percentage}%</div>
                          <div className="text-sm text-muted-foreground">
                            {item.present} / {item.total} classes
                            {(item as { totalHours?: number }).totalHours != null && (item as { totalHours?: number }).totalHours > 0 && (
                              <> · {(item as { attendedHours?: number }).attendedHours?.toFixed(1) ?? '0'} / {(item as { totalHours?: number }).totalHours?.toFixed(1)} hours</>
                            )}
                          </div>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Present: {item.present}</span>
                        <span>Absent: {item.total - item.present}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Attendance Tab */}
          <TabsContent value="qr-attendance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Attendance</CardTitle>
                <CardDescription>Scan QR codes to mark your attendance quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    When your faculty displays a QR code, scan it to mark your attendance automatically
                  </p>
                  <Button onClick={() => setQrScanningOpen(true)} size="lg">
                    <Scan className="w-4 h-4 mr-2" />
                    Scan QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentor Attendance Tab */}
          <TabsContent value="mentor-attendance">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Attendance Records</CardTitle>
                <CardDescription>Latest attendance information entered by your mentor</CardDescription>
              </CardHeader>
              <CardContent>
                {mentorAttendanceLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading mentor attendance records...</div>
                ) : mentorAttendanceRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No mentor attendance records found</p>
                    <p className="text-sm text-gray-400">Your mentor will enter attendance records here</p>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>My Subjects</CardTitle>
                <CardDescription>All subjects you are enrolled in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {studentAttendance.map((item) => (
                    <div key={item.subject?.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <BookOpen className="w-8 h-8 text-primary" />
                        <div>
                          <div className="font-medium">{item.subject?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Code: {item.subject?.code} • Credits: {item.subject?.credits}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={item.percentage >= 85 ? 'default' : 'destructive'}>
                          {item.percentage}%
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.present}/{item.total} classes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="achievements" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Records</CardTitle>
                  <CardDescription>Extra-curricular and co-curricular activities, representations, achievements, and career information</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleOpenAchievementDialog(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </CardHeader>
              <CardContent>
                {achievementsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading achievements...</p>
                ) : achievements.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No achievements recorded yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Click "Add Achievement" to record your accomplishments.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
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
                            <p className="text-sm text-muted-foreground mb-2">{achievement.event_name}</p>
                            <p className="text-sm mb-2">{achievement.achievement_details}</p>
                            <p className="text-xs text-muted-foreground">
                              Date: {format(parseISO(achievement.date_achieved), 'PPP')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenAchievementDialog(achievement)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAchievement(achievement.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor Remarks Section - Read Only for Students */}
            <Card>
              <CardHeader>
                <CardTitle>Mentor Remarks</CardTitle>
                <CardDescription>Feedback and guidance from your assigned mentor</CardDescription>
              </CardHeader>
              <CardContent>
                {mentorRemarksLoading ? (
                  <p className="text-sm text-muted-foreground">Loading mentor remarks...</p>
                ) : mentorRemarks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No mentor remarks recorded yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Your mentor will add remarks here to provide guidance and feedback.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mentorRemarks.map((remark) => (
                      <div key={remark.id} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {remark.mentoring_area}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(remark.remark_date), 'PPP')}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(remark.created_at), 'PPP')}
                          </p>
                        </div>
                        <p className="text-sm mb-2">{remark.remarks}</p>
                        <p className="text-xs text-muted-foreground">
                          By: {remark.mentor_name} ({remark.mentor_email})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Counselling Notes Section - Read Only for Students */}
            <Card>
              <CardHeader>
                <CardTitle>Counselling Notes</CardTitle>
                <CardDescription>Counselling and guidance notes from your assigned mentor</CardDescription>
              </CardHeader>
              <CardContent>
                {counsellingNotesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading counselling notes...</p>
                ) : counsellingNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto text-muted-foreground mb-4 flex items-center justify-center">
                      <FileText className="w-12 h-12" />
                    </div>
                    <p className="text-sm text-muted-foreground">No counselling notes recorded yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Your mentor will add counselling notes here to provide guidance and support.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {counsellingNotes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">
                              {format(parseISO(note.counselling_date), 'PPP')}
                            </Badge>
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
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(note.created_at), 'PPP')}
                          </p>
                        </div>
                        <p className="text-sm mb-2">{note.remarks}</p>
                        <p className="text-xs text-muted-foreground">
                          By: {note.mentor_name} ({note.mentor_email})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Career Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Career Information</CardTitle>
                  <CardDescription>Your career goals and aspirations</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenCareerDialog}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Career
                </Button>
              </CardHeader>
              <CardContent>
                {careerLoading ? (
                  <p className="text-sm text-muted-foreground">Loading career information...</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">What do you want to become?</label>
                        <p className="text-lg font-medium">{careerInfo.career_goal || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expected Package</label>
                        <p className="text-lg font-medium">{careerInfo.expected_package ? `${careerInfo.expected_package} LPA` : '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Desired Role</label>
                        <p className="text-lg font-medium">{careerInfo.desired_role || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dream Company</label>
                        <p className="text-lg font-medium">{careerInfo.dream_company || '–'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Need any help?</label>
                      <p className="text-base whitespace-pre-wrap">{careerInfo.help_needed || '–'}</p>
                    </div>
                    {careerInfo.faculty_suggestions && (
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Suggestions from Faculty</label>
                        <p className="text-base whitespace-pre-wrap mt-1">{careerInfo.faculty_suggestions}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Career Edit Dialog */}
            <Dialog open={careerEditOpen} onOpenChange={setCareerEditOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Career Information</DialogTitle>
                  <DialogDescription>Update your career goals and aspirations</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="career_goal">What do you want to become? *</Label>
                    <Input
                      id="career_goal"
                      value={careerForm.career_goal}
                      onChange={(e) => setCareerForm({ ...careerForm, career_goal: e.target.value })}
                      placeholder="e.g., Software Engineer, Data Scientist, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_package">Expected Package *</Label>
                    <Select
                      value={careerForm.expected_package}
                      onValueChange={(value) => setCareerForm({ ...careerForm, expected_package: value })}
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
                    <Label htmlFor="desired_role">Which role do you want to do? *</Label>
                    <Input
                      id="desired_role"
                      value={careerForm.desired_role}
                      onChange={(e) => setCareerForm({ ...careerForm, desired_role: e.target.value })}
                      placeholder="e.g., Frontend Developer, Backend Developer, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dream_company">Dream company to work?</Label>
                    <Input
                      id="dream_company"
                      value={careerForm.dream_company}
                      onChange={(e) => setCareerForm({ ...careerForm, dream_company: e.target.value })}
                      placeholder="e.g., Google, Microsoft, Amazon, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="help_needed">Need any help?</Label>
                    <textarea
                      id="help_needed"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={careerForm.help_needed}
                      onChange={(e) => setCareerForm({ ...careerForm, help_needed: e.target.value })}
                      placeholder="Describe any help or guidance you need..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCareerEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCareer}>
                    Save Career Information
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Achievement Dialog */}
            <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="achievement_type">Achievement Type *</Label>
                      <Select
                        value={achievementForm.achievement_type}
                        onValueChange={(value) => setAchievementForm({ ...achievementForm, achievement_type: value })}
                      >
                        <SelectTrigger id="achievement_type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="extra_curricular">Extra-Curricular</SelectItem>
                          <SelectItem value="co_curricular">Co-Curricular</SelectItem>
                          <SelectItem value="representation">Representation</SelectItem>
                          <SelectItem value="participation">Participation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_achieved">Date Achieved *</Label>
                      <Input
                        id="date_achieved"
                        type="date"
                        value={achievementForm.date_achieved}
                        onChange={(e) => setAchievementForm({ ...achievementForm, date_achieved: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity_name">Activity Name *</Label>
                    <Input
                      id="activity_name"
                      placeholder="e.g., Sports, Cultural Event, Technical Symposium"
                      value={achievementForm.activity_name}
                      onChange={(e) => setAchievementForm({ ...achievementForm, activity_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_name">Event Name *</Label>
                    <Input
                      id="event_name"
                      placeholder="e.g., Annual Sports Meet, Inter-College Cultural Fest"
                      value={achievementForm.event_name}
                      onChange={(e) => setAchievementForm({ ...achievementForm, event_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participation_level">Participation Level *</Label>
                    <Select
                      value={achievementForm.participation_level}
                      onValueChange={(value) => setAchievementForm({ ...achievementForm, participation_level: value })}
                    >
                      <SelectTrigger id="participation_level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="District">District</SelectItem>
                        <SelectItem value="State">State</SelectItem>
                        <SelectItem value="National">National</SelectItem>
                        <SelectItem value="International">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement_details">Achievement Details *</Label>
                    <textarea
                      id="achievement_details"
                      className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your achievement, awards received, positions won, etc."
                      value={achievementForm.achievement_details}
                      onChange={(e) => setAchievementForm({ ...achievementForm, achievement_details: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAchievementDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAchievement}>
                    {editingAchievement ? 'Update Achievement' : 'Add Achievement'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your academic and personal information</CardDescription>
                </div>
                {numericId != null && (
                  <Button variant="outline" size="sm" onClick={handleOpenEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit my details
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg font-medium">{displayName || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                      <p className="text-lg font-medium">{displayRoll || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg font-medium">{apiProfile?.email ?? student?.email ?? user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-lg font-medium">{displayPhone || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p className="text-lg font-medium">{department?.name ?? apiProfile?.department ?? '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Section(s)</label>
                      <p className="text-lg font-medium">{displaySectionRaw ? displaySectionRaw.split(',').map(s => s.trim()).filter(Boolean).join(', ') : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                      <p className="text-lg font-medium">{displayYear ? `${displayYear} Year` : '–'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Details Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
                <CardDescription>Additional personal and academic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-lg font-medium">{apiProfile?.date_of_birth ? format(parseISO(apiProfile.date_of_birth), 'PPP') : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Joining</label>
                      <p className="text-lg font-medium">{apiProfile?.date_of_joining ? format(parseISO(apiProfile.date_of_joining), 'PPP') : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Guardian Name</label>
                      <p className="text-lg font-medium">{apiProfile?.guardian_name || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Guardian Relation</label>
                      <p className="text-lg font-medium">{apiProfile?.guardian_relation || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Guardian Mobile</label>
                      <p className="text-lg font-medium">{apiProfile?.guardian_mobile || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                      <p className="text-lg font-medium">{apiProfile?.occupation || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Income</label>
                      <p className="text-lg font-medium">{apiProfile?.income ? `₹${apiProfile.income.toLocaleString()}` : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-lg font-medium">{apiProfile?.address || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <p className="text-lg font-medium">{apiProfile?.city || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">State</label>
                      <p className="text-lg font-medium">{apiProfile?.state || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pincode</label>
                      <p className="text-lg font-medium">{apiProfile?.pincode || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Admission Category</label>
                      <p className="text-lg font-medium">{apiProfile?.admission_category || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">EAPCET Rank</label>
                      <p className="text-lg font-medium">{apiProfile?.eapcet_rank || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ECET Rank</label>
                      <p className="text-lg font-medium">{apiProfile?.ecet_rank || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reservation Category</label>
                      <p className="text-lg font-medium">{apiProfile?.reservation_category || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Scholarship</label>
                      <p className="text-lg font-medium">{apiProfile?.scholarship || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Residential Details</label>
                      <p className="text-lg font-medium">{apiProfile?.residential_details || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mode of Transport</label>
                      <p className="text-lg font-medium">{apiProfile?.mode_of_transport || '–'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Photo</label>
                      {apiProfile?.photo ? (
                        <div className="mt-2">
                          <img 
                            src={apiProfile.photo.startsWith('http') ? apiProfile.photo : apiUrl(apiProfile.photo)}
                            alt="Student Photo" 
                            className="w-32 h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              console.error('Photo load error:', e);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-lg font-medium">No photo uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Dialog open={profileEditOpen} onOpenChange={setProfileEditOpen}>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit your details</DialogTitle>
                  <DialogDescription>Update your personal, academic, and educational information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Full name</Label>
                        <Input value={profileEditForm.full_name} onChange={e => setProfileEditForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Full name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Roll number</Label>
                        <Input value={profileEditForm.roll_number} onChange={e => setProfileEditForm(f => ({ ...f, roll_number: e.target.value }))} placeholder="Roll number" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input type="email" value={profileEditForm.email} onChange={e => setProfileEditForm(f => ({ ...f, email: e.target.value.trim() }))} placeholder="Email" autoComplete="email" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Phone</Label>
                        <Input value={profileEditForm.phone} onChange={e => setProfileEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Date of Birth</Label>
                        <Input type="date" value={profileEditForm.date_of_birth} onChange={e => setProfileEditForm(f => ({ ...f, date_of_birth: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Date of Joining</Label>
                        <Input type="date" value={profileEditForm.date_of_joining} onChange={e => setProfileEditForm(f => ({ ...f, date_of_joining: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Department</Label>
                        <Select value={profileEditForm.department} onValueChange={v => setProfileEditForm(f => ({ ...f, department: v }))}>
                          <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                          <SelectContent>
                            {departments.map(d => (
                              <SelectItem key={d.id} value={d.code}>{d.code} – {d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Section(s)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal rounded-xl">
                              {profileEditForm.sections.length > 0 ? `${profileEditForm.sections.length} selected` : 'Select section(s)'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-3 max-h-64 overflow-y-auto" align="start">
                            {apiSections.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No sections yet. Ask admin to add sections.</p>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex justify-end gap-2 mb-2">
                                  <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => setProfileEditForm(f => ({ ...f, sections: apiSections.map(s => s.name) }))}>Select all</Button>
                                  <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => setProfileEditForm(f => ({ ...f, sections: [] }))}>Clear all</Button>
                                </div>
                                {apiSections.map((s) => (
                                  <div key={s.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`stu-sec-${s.id}`}
                                      checked={profileEditForm.sections.includes(s.name)}
                                      onCheckedChange={(checked) => {
                                        setProfileEditForm(f => ({
                                          ...f,
                                          sections: checked
                                            ? [...f.sections, s.name]
                                            : f.sections.filter((x) => x !== s.name),
                                        }));
                                      }}
                                    />
                                    <label htmlFor={`stu-sec-${s.id}`} className="text-sm cursor-pointer">{s.name}</label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid gap-2">
                        <Label>Year</Label>
                        <Input value={profileEditForm.year} onChange={e => setProfileEditForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g. 2" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Admission Category</Label>
                        <Input value={profileEditForm.admission_category} onChange={e => setProfileEditForm(f => ({ ...f, admission_category: e.target.value }))} placeholder="e.g. Convener, Management" />
                      </div>
                      <div className="grid gap-2">
                        <Label>EAPCET Rank</Label>
                        <Input type="number" value={profileEditForm.eapcet_rank} onChange={e => setProfileEditForm(f => ({ ...f, eapcet_rank: e.target.value }))} placeholder="EAPCET Rank" />
                      </div>
                      <div className="grid gap-2">
                        <Label>ECET Rank</Label>
                        <Input type="number" value={profileEditForm.ecet_rank} onChange={e => setProfileEditForm(f => ({ ...f, ecet_rank: e.target.value }))} placeholder="ECET Rank" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Reservation Category</Label>
                        <Input value={profileEditForm.reservation_category} onChange={e => setProfileEditForm(f => ({ ...f, reservation_category: e.target.value }))} placeholder="e.g. OC, BC-A, SC, ST" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Scholarship</Label>
                        <Input value={profileEditForm.scholarship} onChange={e => setProfileEditForm(f => ({ ...f, scholarship: e.target.value }))} placeholder="Scholarship details" />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Guardian Name</Label>
                        <Input value={profileEditForm.guardian_name} onChange={e => setProfileEditForm(f => ({ ...f, guardian_name: e.target.value }))} placeholder="Father/Mother/Guardian name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Guardian Relation</Label>
                        <Select value={profileEditForm.guardian_relation} onValueChange={v => setProfileEditForm(f => ({ ...f, guardian_relation: v }))}>
                          <SelectTrigger><SelectValue placeholder="Relation" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Guardian">Guardian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Guardian Mobile</Label>
                        <Input value={profileEditForm.guardian_mobile} onChange={e => setProfileEditForm(f => ({ ...f, guardian_mobile: e.target.value }))} placeholder="Guardian mobile number" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Occupation</Label>
                        <Input value={profileEditForm.occupation} onChange={e => setProfileEditForm(f => ({ ...f, occupation: e.target.value }))} placeholder="Occupation" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Annual Income</Label>
                        <Input type="number" value={profileEditForm.income} onChange={e => setProfileEditForm(f => ({ ...f, income: e.target.value }))} placeholder="Annual Income" />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Address</Label>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={profileEditForm.address} 
                          onChange={e => setProfileEditForm(f => ({ ...f, address: e.target.value }))} 
                          placeholder="Permanent address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>City</Label>
                        <Input value={profileEditForm.city} onChange={e => setProfileEditForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                      </div>
                      <div className="grid gap-2">
                        <Label>State</Label>
                        <Input value={profileEditForm.state} onChange={e => setProfileEditForm(f => ({ ...f, state: e.target.value }))} placeholder="State" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Pincode</Label>
                        <Input value={profileEditForm.pincode} onChange={e => setProfileEditForm(f => ({ ...f, pincode: e.target.value }))} placeholder="Pincode" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Residential Details</Label>
                        <Select value={profileEditForm.residential_details} onValueChange={v => setProfileEditForm(f => ({ ...f, residential_details: v }))}>
                          <SelectTrigger><SelectValue placeholder="Residential Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                            <SelectItem value="Hosteller">Hosteller</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Mode of Transport</Label>
                        <Input value={profileEditForm.mode_of_transport} onChange={e => setProfileEditForm(f => ({ ...f, mode_of_transport: e.target.value }))} placeholder="e.g. Bus, College Vehicle, Private" />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Photo</h3>
                    <div className="grid gap-2">
                      <Label>Upload Photo</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfileEditForm(f => ({ ...f, photo: file }));
                          }
                        }}
                      />
                      {profileEditForm.photo && (
                        <div className="mt-2">
                          <img 
                            src={URL.createObjectURL(profileEditForm.photo)} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Educational Profile */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Educational Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>SSC/CBSE/ICSE Board</Label>
                        <Input value={profileEditForm.ssc_board} onChange={e => setProfileEditForm(f => ({ ...f, ssc_board: e.target.value }))} placeholder="e.g. CBSE, ICSE, State Board" />
                      </div>
                      <div className="grid gap-2">
                        <Label>SSC School Name</Label>
                        <Input value={profileEditForm.ssc_school} onChange={e => setProfileEditForm(f => ({ ...f, ssc_school: e.target.value }))} placeholder="School Name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>SSC Percentage/CGPA</Label>
                        <Input type="number" step="0.01" value={profileEditForm.ssc_percentage} onChange={e => setProfileEditForm(f => ({ ...f, ssc_percentage: e.target.value }))} placeholder="Percentage or CGPA" />
                      </div>
                      <div className="grid gap-2">
                        <Label>SSC Class/Distinction</Label>
                        <Input value={profileEditForm.ssc_class} onChange={e => setProfileEditForm(f => ({ ...f, ssc_class: e.target.value }))} placeholder="e.g. First Class, Distinction" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Intermediate/Diploma Board</Label>
                        <Input value={profileEditForm.intermediate_board} onChange={e => setProfileEditForm(f => ({ ...f, intermediate_board: e.target.value }))} placeholder="Board Name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Intermediate/Diploma College</Label>
                        <Input value={profileEditForm.intermediate_college} onChange={e => setProfileEditForm(f => ({ ...f, intermediate_college: e.target.value }))} placeholder="College Name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Intermediate Percentage/CGPA</Label>
                        <Input type="number" step="0.01" value={profileEditForm.intermediate_percentage} onChange={e => setProfileEditForm(f => ({ ...f, intermediate_percentage: e.target.value }))} placeholder="Percentage or CGPA" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Intermediate Class/Distinction</Label>
                        <Input value={profileEditForm.intermediate_class} onChange={e => setProfileEditForm(f => ({ ...f, intermediate_class: e.target.value }))} placeholder="e.g. First Class, Distinction" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Medium of Instruction</Label>
                        <Input value={profileEditForm.medium_of_instruction} onChange={e => setProfileEditForm(f => ({ ...f, medium_of_instruction: e.target.value }))} placeholder="e.g. English, Telugu, Hindi" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Local Language</Label>
                        <Input value={profileEditForm.local} onChange={e => setProfileEditForm(f => ({ ...f, local: e.target.value }))} placeholder="Local language" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Mother Tongue</Label>
                        <Input value={profileEditForm.mother_tongue} onChange={e => setProfileEditForm(f => ({ ...f, mother_tongue: e.target.value }))} placeholder="Mother tongue" />
                      </div>
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label>Achievements</Label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profileEditForm.achievements} 
                        onChange={e => setProfileEditForm(f => ({ ...f, achievements: e.target.value }))} 
                        placeholder="Achievements and awards"
                      />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label>Hobbies</Label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profileEditForm.hobbies} 
                        onChange={e => setProfileEditForm(f => ({ ...f, hobbies: e.target.value }))} 
                        placeholder="Hobbies and interests"
                      />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label>Areas of Interest</Label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profileEditForm.areas_of_interest} 
                        onChange={e => setProfileEditForm(f => ({ ...f, areas_of_interest: e.target.value }))} 
                        placeholder="Areas of interest"
                      />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label>Other Information</Label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profileEditForm.other_information} 
                        onChange={e => setProfileEditForm(f => ({ ...f, other_information: e.target.value }))} 
                        placeholder="Any other information"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setProfileEditOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveEditProfile}><Save className="w-4 h-4 mr-2" /> Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="mt-4">
              <Button variant="outline" onClick={() => setChangePasswordOpen(true)}>
                <Lock className="w-4 h-4 mr-2" /> Change password
              </Button>
            </div>
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change password</DialogTitle>
                  <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Current password</Label>
                    <Input
                      type="password"
                      value={changePasswordForm.current_password}
                      onChange={e => setChangePasswordForm(f => ({ ...f, current_password: e.target.value }))}
                      placeholder="Current password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>New password</Label>
                    <Input
                      type="password"
                      value={changePasswordForm.new_password}
                      onChange={e => setChangePasswordForm(f => ({ ...f, new_password: e.target.value }))}
                      placeholder="New password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Confirm new password</Label>
                    <Input
                      type="password"
                      value={changePasswordForm.confirm_password}
                      onChange={e => setChangePasswordForm(f => ({ ...f, confirm_password: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
                  <Button onClick={handleChangePassword}>Change password</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Educational Profile Tab */}
          <TabsContent value="educational-profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Educational Profile</CardTitle>
                  <CardDescription>Your educational history and additional information</CardDescription>
                </div>
                {numericId != null && (
                  <Button variant="outline" size="sm" onClick={handleOpenEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* SSC/10th Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">SSC/CBSE/ICSE (10th Standard)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Board</label>
                        <p className="text-lg font-medium">{apiProfile?.ssc_board || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">School Name</label>
                        <p className="text-lg font-medium">{apiProfile?.ssc_school || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Percentage/CGPA</label>
                        <p className="text-lg font-medium">{apiProfile?.ssc_percentage ? `${apiProfile.ssc_percentage}%` : '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Class/Distinction</label>
                        <p className="text-lg font-medium">{apiProfile?.ssc_class || '–'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Intermediate/Diploma Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Intermediate/Diploma (12th Standard)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Board</label>
                        <p className="text-lg font-medium">{apiProfile?.intermediate_board || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">College Name</label>
                        <p className="text-lg font-medium">{apiProfile?.intermediate_college || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Percentage/CGPA</label>
                        <p className="text-lg font-medium">{apiProfile?.intermediate_percentage ? `${apiProfile.intermediate_percentage}%` : '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Class/Distinction</label>
                        <p className="text-lg font-medium">{apiProfile?.intermediate_class || '–'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Language Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Language Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Medium of Instruction</label>
                        <p className="text-lg font-medium">{apiProfile?.medium_of_instruction || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Local Language</label>
                        <p className="text-lg font-medium">{apiProfile?.local || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mother Tongue</label>
                        <p className="text-lg font-medium">{apiProfile?.mother_tongue || '–'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Additional Information</h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Achievements</label>
                        <p className="text-lg font-medium whitespace-pre-wrap">{apiProfile?.achievements || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Hobbies</label>
                        <p className="text-lg font-medium whitespace-pre-wrap">{apiProfile?.hobbies || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Areas of Interest</label>
                        <p className="text-lg font-medium whitespace-pre-wrap">{apiProfile?.areas_of_interest || '–'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Other Information</label>
                        <p className="text-lg font-medium whitespace-pre-wrap">{apiProfile?.other_information || '–'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Details Tab */}
          <TabsContent value="student-details">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Student Details</CardTitle>
                  <CardDescription>Fill and update your complete student information</CardDescription>
                </div>
                {numericId != null && (
                  <Button variant="outline" size="sm" onClick={handleOpenEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg font-medium">{displayName || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                      <p className="text-lg font-medium">{displayRoll || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg font-medium">{apiProfile?.email ?? student?.email ?? user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-lg font-medium">{displayPhone || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p className="text-lg font-medium">{department?.name ?? apiProfile?.department ?? '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Section(s)</label>
                      <p className="text-lg font-medium">{displaySectionRaw ? displaySectionRaw.split(',').map(s => s.trim()).filter(Boolean).join(', ') : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                      <p className="text-lg font-medium">{displayYear ? `${displayYear} Year` : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-lg font-medium">{apiProfile?.date_of_birth ? format(parseISO(apiProfile.date_of_birth), 'PPP') : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Joining</label>
                      <p className="text-lg font-medium">{apiProfile?.date_of_joining ? format(parseISO(apiProfile.date_of_joining), 'PPP') : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Guardian Name</label>
                      <p className="text-lg font-medium">{apiProfile?.guardian_name || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Guardian Relation</label>
                      <p className="text-lg font-medium">{apiProfile?.guardian_relation || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Guardian Mobile</label>
                      <p className="text-lg font-medium">{apiProfile?.guardian_mobile || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                      <p className="text-lg font-medium">{apiProfile?.occupation || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Income</label>
                      <p className="text-lg font-medium">{apiProfile?.income ? `₹${apiProfile.income.toLocaleString()}` : '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-lg font-medium">{apiProfile?.address || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <p className="text-lg font-medium">{apiProfile?.city || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">State</label>
                      <p className="text-lg font-medium">{apiProfile?.state || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pincode</label>
                      <p className="text-lg font-medium">{apiProfile?.pincode || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Admission Category</label>
                      <p className="text-lg font-medium">{apiProfile?.admission_category || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">EAPCET Rank</label>
                      <p className="text-lg font-medium">{apiProfile?.eapcet_rank || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ECET Rank</label>
                      <p className="text-lg font-medium">{apiProfile?.ecet_rank || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reservation Category</label>
                      <p className="text-lg font-medium">{apiProfile?.reservation_category || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Scholarship</label>
                      <p className="text-lg font-medium">{apiProfile?.scholarship || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Residential Details</label>
                      <p className="text-lg font-medium">{apiProfile?.residential_details || '–'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mode of Transport</label>
                      <p className="text-lg font-medium">{apiProfile?.mode_of_transport || '–'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Photo</label>
                      {apiProfile?.photo ? (
                        <div className="mt-2">
                          <img 
                            src={apiProfile.photo.startsWith('http') ? apiProfile.photo : apiUrl(apiProfile.photo)}
                            alt="Student Photo" 
                            className="w-32 h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              console.error('Photo load error:', e);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-lg font-medium">No photo uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Scanning Dialog */}
          <Dialog open={qrScanningOpen} onOpenChange={setQrScanningOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogDescription>
                  {showManualEntry 
                    ? 'Enter session details manually' 
                    : 'Position the QR code within the camera frame to mark attendance'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {!showManualEntry ? (
                  <>
                    <div className="bg-black rounded-lg aspect-square flex items-center justify-center overflow-hidden relative">
                      {!cameraError ? (
                        <div id={scannerElementId} className="w-full h-full"></div>
                      ) : (
                        <div className="text-center text-white p-4">
                          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-50">Camera unavailable</p>
                        </div>
                      )}
                    </div>
                    {cameraError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Camera Error</AlertTitle>
                        <AlertDescription>{cameraError}</AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        console.log('Use Manual Entry clicked');
                        if (qrScannerRef.current) {
                          qrScannerRef.current.stop().catch(console.error);
                          qrScannerRef.current = null;
                        }
                        setShowManualEntry(true);
                      }}
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Use Manual Entry Instead
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="manual-session-id">Session ID</Label>
                      <Input
                        id="manual-session-id"
                        type="text"
                        value={qrSessionId}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '');
                          // Limit to 5 digits
                          if (value.length <= 5) {
                            setQrSessionId(value);
                          }
                        }}
                        placeholder="Enter 5-digit session ID (e.g., 12345)"
                        maxLength={5}
                      />
                      <p className="text-xs text-muted-foreground">Session ID must be exactly 5 digits</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device-id">Device ID</Label>
                      <Input
                        id="device-id"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        placeholder="Auto-generated for your device"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        This identifies your device for this session only
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        console.log('Back to camera clicked');
                        setShowManualEntry(false);
                        setCameraError(null);
                        setScanResult(null);
                        setQrSessionId('');
                      }}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Back to Camera Scan
                    </Button>
                  </>
                )}
                
                {scanResult && (
                  <Alert variant={scanResult.success ? 'default' : 'destructive'}>
                    {scanResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{scanResult.success ? 'Success' : 'Error'}</AlertTitle>
                    <AlertDescription>{scanResult.message}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={() => {
                    console.log('Mark Attendance clicked');
                    handleQrMarkAttendance();
                  }} 
                  disabled={isScanning || !qrSessionId}
                  className="w-full"
                >
                  {isScanning ? 'Processing...' : 'Mark Attendance'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Tabs>
      </div>
    </div>
  );
};