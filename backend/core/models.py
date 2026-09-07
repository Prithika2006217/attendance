
from django.db import models
from django.contrib.auth.models import AbstractUser


class Department(models.Model):
    """Branch/Department (e.g. CSE, EE)."""
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Section(models.Model):
    """Section name (e.g. A, 1, Alpha, Section-1). Accepts character, string, or number stored as string."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Subject(models.Model):
    """Subject that can belong to one or more departments, per year and semester."""
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50)
    departments = models.ManyToManyField(Department, related_name='subjects')
    year = models.CharField(max_length=20, default='1', help_text='Academic year: 1, 2, 3, 4, etc.')
    semester = models.CharField(max_length=20, default='1', help_text='Semester within year: 1 or 2')

    class Meta:
        unique_together = [['code', 'year', 'semester']]

    def __str__(self):
        return f"{self.code} - {self.name} (Year {self.year}, Sem {self.semester})"


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
        ('mentor', 'Mentor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    full_name = models.CharField(max_length=150, blank=True, null=True)
    roll_number = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    # Comma-separated section names (e.g. "A,B") for students in multiple sections
    section = models.CharField(
        max_length=400, blank=True, null=True,
        help_text='Comma-separated section names for students in multiple sections.',
    )
    year = models.CharField(max_length=50, blank=True, null=True)
    # Stored only for admin visibility after password change (insecure; use with caution)
    visible_password = models.CharField(max_length=128, blank=True, null=True)
    # Comma-separated subject IDs assigned to faculty (e.g. "1,3,5")
    assigned_subject_ids = models.CharField(max_length=500, blank=True, null=True)
    # Students marked detained are excluded from attendance marking (faculty/admin); admin can toggle.
    is_detained = models.BooleanField(default=False)
    
    # Student Details fields
    date_of_birth = models.DateField(blank=True, null=True)
    date_of_joining = models.DateField(blank=True, null=True)
    guardian_name = models.CharField(max_length=150, blank=True, null=True, help_text='Father/Mother/Guardian name')
    guardian_relation = models.CharField(max_length=50, blank=True, null=True, help_text='Relation to guardian (Father/Mother/Guardian)')
    guardian_mobile = models.CharField(max_length=20, blank=True, null=True, help_text='Guardian mobile number')
    occupation = models.CharField(max_length=100, blank=True, null=True)
    income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    address = models.TextField(blank=True, null=True, help_text='Permanent address')
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    admission_category = models.CharField(max_length=50, blank=True, null=True)
    eapcet_rank = models.IntegerField(blank=True, null=True)
    ecet_rank = models.IntegerField(blank=True, null=True)
    reservation_category = models.CharField(max_length=50, blank=True, null=True)
    scholarship = models.CharField(max_length=100, blank=True, null=True)
    residential_details = models.CharField(max_length=100, blank=True, null=True, help_text='Day scholar/Hosteller etc.')
    mode_of_transport = models.CharField(max_length=100, blank=True, null=True)
    photo = models.ImageField(upload_to='student_photos/', blank=True, null=True)
    
    # Educational Profile fields
    ssc_board = models.CharField(max_length=100, blank=True, null=True, help_text='SSC/CBSE/ICSE Board')
    ssc_school = models.CharField(max_length=200, blank=True, null=True, help_text='School Name')
    ssc_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text='Percentage/CGPA')
    ssc_class = models.CharField(max_length=50, blank=True, null=True, help_text='Class/Distinction')
    intermediate_board = models.CharField(max_length=100, blank=True, null=True, help_text='Intermediate/Diploma Board')
    intermediate_college = models.CharField(max_length=200, blank=True, null=True, help_text='College Name')
    intermediate_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text='Percentage/CGPA')
    intermediate_class = models.CharField(max_length=50, blank=True, null=True, help_text='Class/Distinction')
    medium_of_instruction = models.CharField(max_length=50, blank=True, null=True)
    local = models.CharField(max_length=100, blank=True, null=True, help_text='Local language')
    mother_tongue = models.CharField(max_length=100, blank=True, null=True)
    achievements = models.TextField(blank=True, null=True, help_text='Achievements and awards')
    hobbies = models.TextField(blank=True, null=True, help_text='Hobbies and interests')
    areas_of_interest = models.TextField(blank=True, null=True, help_text='Areas of interest')
    other_information = models.TextField(blank=True, null=True, help_text='Any other information')

class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    subject = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=10)
    # Hours attended (out of total) for this record; optional for backward compatibility
    hours = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text='Number of hours the student attended (attended_hours).'
    )
    total_hours = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,
        help_text='Total hours for this session/date.'
    )

    def __str__(self):
        return f"{self.student.username} - {self.subject} - {self.date}"


class AttendancePortalControl(models.Model):
    """Singleton-like control for attendance portal access by role."""
    freeze_faculty_portal = models.BooleanField(default=False)
    freeze_student_portal = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"AttendancePortalControl("
            f"faculty={self.freeze_faculty_portal}, "
            f"student={self.freeze_student_portal})"
        )


class FacultyDepartmentSection(models.Model):
    """Model to store faculty assignments to specific sections within departments."""
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='faculty_department_sections')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='faculty_assignments')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='faculty_assignments')

    class Meta:
        unique_together = [['faculty', 'department', 'section']]
        verbose_name = 'Faculty Department Section'
        verbose_name_plural = 'Faculty Department Sections'

    def __str__(self):
        return f"{self.faculty.username} - {self.department.code} - {self.section.name}"


class QRAttendanceSession(models.Model):
    """Model to store QR attendance session information."""
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='qr_attendance_sessions')
    subject = models.CharField(max_length=100)
    year = models.CharField(max_length=20)
    branch = models.CharField(max_length=100)
    branches = models.CharField(max_length=500, default='', blank=True, help_text='Comma-separated branch codes')
    sections = models.CharField(max_length=500, help_text='Comma-separated section names')
    duration_minutes = models.IntegerField()
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    current_qr_token = models.CharField(max_length=100, unique=True)
    token_expires_at = models.DateTimeField()
    token_refresh_interval = models.IntegerField(default=5, help_text='Token refresh interval in seconds')
    custom_session_id = models.CharField(max_length=5, default='', blank=True, help_text='Rotating 5-digit session ID for security')
    session_id_expires_at = models.DateTimeField(null=True, blank=True, help_text='When the custom session ID expires')

    class Meta:
        verbose_name = 'QR Attendance Session'
        verbose_name_plural = 'QR Attendance Sessions'

    def __str__(self):
        return f"{self.faculty.username} - {self.subject} - {self.start_time}"


class QRAttendanceRecord(models.Model):
    """Model to store individual QR attendance records."""
    session = models.ForeignKey(QRAttendanceSession, on_delete=models.CASCADE, related_name='attendance_records')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='qr_attendance_records')
    device_id = models.CharField(max_length=255, help_text='Unique identifier for the device used')
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['session', 'student'], ['session', 'device_id']]
        verbose_name = 'QR Attendance Record'
        verbose_name_plural = 'QR Attendance Records'

    def __str__(self):
        return f"{self.student.username} - {self.session.subject} - {self.scanned_at}"


class MentorStudentAssignment(models.Model):
    """Model to store mentor-to-student assignments."""
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentor_assignments')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_mentor_assignments')
    assigned_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True, help_text='Optional notes about the assignment')

    class Meta:
        unique_together = [['mentor', 'student']]
        verbose_name = 'Mentor Student Assignment'
        verbose_name_plural = 'Mentor Student Assignments'

    def __str__(self):
        return f"{self.mentor.full_name or self.mentor.username} mentoring {self.student.full_name or self.student.username}"


class StudentAcademicRecord(models.Model):
    """Model to store student academic records for mentor dashboard."""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='academic_records')
    course_name = models.CharField(max_length=200, help_text='Name of the course/subject')
    semester = models.CharField(max_length=50, help_text='Semester (e.g., 1-1, 1-2, 2-1, 2-2)')
    academic_year = models.CharField(max_length=20, help_text='Academic year (e.g., 2023-24)')
    mid1_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Mid-1 marks')
    mid2_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Mid-2 marks')
    cie_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='CIE/Internal marks')
    total_internal_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Total internal marks')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Marks obtained')
    credits_obtained = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Credits obtained')
    sgpa = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='SGPA for the semester')
    audit_course_cleared = models.BooleanField(default=False, help_text='Whether audit course is cleared')
    grade = models.CharField(max_length=10, blank=True, null=True, help_text='Grade obtained (O, A+, A, B+, B, C, etc.)')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about the academic performance')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_academic_records', help_text='Mentor who last updated this record')

    class Meta:
        verbose_name = 'Student Academic Record'
        verbose_name_plural = 'Student Academic Records'
        ordering = ['-academic_year', 'semester', 'course_name']

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.course_name} ({self.semester} - {self.academic_year})"


class MentorAttendanceRecord(models.Model):
    """Model to store mentor-entered attendance records for students."""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentor_attendance_records')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entered_attendance_records')
    month = models.CharField(max_length=20, help_text='Month (e.g., January, February)')
    semester = models.CharField(max_length=50, help_text='Semester (e.g., 1-1, 1-2, 2-1, 2-2)')
    academic_year = models.CharField(max_length=20, help_text='Academic year (e.g., 2023-24)')
    total_classes = models.IntegerField(default=0, help_text='Total number of classes conducted')
    classes_attended = models.IntegerField(default=0, help_text='Number of classes attended by student')
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text='Attendance percentage')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about attendance')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Mentor Attendance Record'
        verbose_name_plural = 'Mentor Attendance Records'
        ordering = ['-academic_year', 'semester', 'month']
        unique_together = [['student', 'month', 'semester', 'academic_year']]

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.month} {self.semester} ({self.academic_year})"


class StudentAchievement(models.Model):
    """Model to store student achievements for extra-curricular and co-curricular activities."""
    ACHIEVEMENT_TYPE_CHOICES = (
        ('extra_curricular', 'Extra-Curricular'),
        ('co_curricular', 'Co-Curricular'),
        ('representation', 'Representation'),
        ('participation', 'Participation'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievement_records')
    achievement_type = models.CharField(max_length=50, choices=ACHIEVEMENT_TYPE_CHOICES, help_text='Type of achievement')
    activity_name = models.CharField(max_length=200, help_text='Name of the activity/event')
    event_name = models.CharField(max_length=200, help_text='Specific event name')
    participation_level = models.CharField(max_length=100, help_text='Level of participation (e.g., College, District, State, National)')
    achievement_details = models.TextField(help_text='Details about the achievement')
    date_achieved = models.DateField(help_text='Date when the achievement was made')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Achievement'
        verbose_name_plural = 'Student Achievements'
        ordering = ['-date_achieved', '-created_at']

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.activity_name} ({self.achievement_type})"


class MentorRemark(models.Model):
    """Model to store mentor remarks for students."""
    MENTORING_AREA_CHOICES = (
        ('academic', 'Academic'),
        ('attendance', 'Attendance'),
        ('discipline', 'Discipline'),
        ('other', 'Other'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentor_remarks')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_remarks')
    remark_date = models.DateField(help_text='Date of the remark')
    mentoring_area = models.CharField(max_length=50, choices=MENTORING_AREA_CHOICES, help_text='Area of mentoring')
    remarks = models.TextField(help_text='Mentor remarks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Mentor Remark'
        verbose_name_plural = 'Mentor Remarks'
        ordering = ['-remark_date', '-created_at']

    def __str__(self):
        return f"{self.mentor.full_name or self.mentor.username} - {self.student.full_name or self.student.username} ({self.mentoring_area}) - {self.remark_date}"
