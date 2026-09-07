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
  // Personal Details
  date_of_birth: string | null;
  date_of_joining: string | null;
  guardian_name: string | null;
  guardian_relation: string | null;
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

export const MentorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<AssignedStudent | null>(null);
  const [studentProfileOpen, setStudentProfileOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'roll_number' | 'department' | 'year'>('name');

  useEffect(() => {
    loadAssignedStudents();
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
              <Button variant="ghost" size="sm" onClick={() => setStudentProfileOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
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
                        src={selectedStudent.photo} 
                        alt="Student Photo" 
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-lg">{selectedStudent.full_name || selectedStudent.username}</p>
                      <p className="text-sm text-gray-600">{selectedStudent.roll_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm">{selectedStudent.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    <p className="text-sm">{selectedStudent.department || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Section</label>
                    <p className="text-sm">{selectedStudent.section || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Year</label>
                    <p className="text-sm">{selectedStudent.year || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-sm">{selectedStudent.date_of_birth ? format(parseISO(selectedStudent.date_of_birth), 'PPP') : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                    <p className="text-sm">{selectedStudent.date_of_joining ? format(parseISO(selectedStudent.date_of_joining), 'PPP') : 'N/A'}</p>
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
                    <p className="text-sm">{selectedStudent.guardian_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Guardian Relation</label>
                    <p className="text-sm">{selectedStudent.guardian_relation || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Occupation</label>
                    <p className="text-sm">{selectedStudent.occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Annual Income</label>
                    <p className="text-sm">{selectedStudent.income ? `₹${selectedStudent.income.toLocaleString()}` : 'N/A'}</p>
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
                    <p className="text-sm whitespace-pre-wrap">{selectedStudent.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-sm">{selectedStudent.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-sm">{selectedStudent.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pincode</label>
                    <p className="text-sm">{selectedStudent.pincode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Residential Details</label>
                    <p className="text-sm">{selectedStudent.residential_details || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mode of Transport</label>
                    <p className="text-sm">{selectedStudent.mode_of_transport || 'N/A'}</p>
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
                    <p className="text-sm">{selectedStudent.admission_category || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">EAPCET Rank</label>
                    <p className="text-sm">{selectedStudent.eapcet_rank || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ECET Rank</label>
                    <p className="text-sm">{selectedStudent.ecet_rank || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reservation Category</label>
                    <p className="text-sm">{selectedStudent.reservation_category || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scholarship</label>
                    <p className="text-sm">{selectedStudent.scholarship || 'N/A'}</p>
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
                      <p className="text-sm">{selectedStudent.ssc_board || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">School Name</label>
                      <p className="text-sm">{selectedStudent.ssc_school || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Percentage/CGPA</label>
                      <p className="text-sm">{selectedStudent.ssc_percentage ? `${selectedStudent.ssc_percentage}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Class/Distinction</label>
                      <p className="text-sm">{selectedStudent.ssc_class || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Intermediate Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Intermediate/Diploma (12th Standard)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Board</label>
                      <p className="text-sm">{selectedStudent.intermediate_board || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">College Name</label>
                      <p className="text-sm">{selectedStudent.intermediate_college || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Percentage/CGPA</label>
                      <p className="text-sm">{selectedStudent.intermediate_percentage ? `${selectedStudent.intermediate_percentage}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Class/Distinction</label>
                      <p className="text-sm">{selectedStudent.intermediate_class || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Language Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Medium of Instruction</label>
                    <p className="text-sm">{selectedStudent.medium_of_instruction || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Local Language</label>
                    <p className="text-sm">{selectedStudent.local || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mother Tongue</label>
                    <p className="text-sm">{selectedStudent.mother_tongue || 'N/A'}</p>
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
                    <p className="text-sm whitespace-pre-wrap">{selectedStudent.achievements || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Hobbies
                    </label>
                    <p className="text-sm whitespace-pre-wrap">{selectedStudent.hobbies || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Areas of Interest
                    </label>
                    <p className="text-sm whitespace-pre-wrap">{selectedStudent.areas_of_interest || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Other Information</label>
                    <p className="text-sm whitespace-pre-wrap">{selectedStudent.other_information || 'N/A'}</p>
                  </div>
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
    </div>
  );
};