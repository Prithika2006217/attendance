from django.db import models
from django.core.exceptions import ValidationError
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
        ('hod', 'HOD'),
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
    guardian_mobile = models.CharField(max_length=20, blank=True, null=True, help_text='Guardian mobile number (legacy field)')
    guardian_mobiles = models.JSONField(default=list, blank=True, null=True, help_text='List of guardian mobile numbers')
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
    month = models.CharField(max_length=20, help_text='Month (e.g., January, February)', blank=True, null=True)
    semester = models.CharField(max_length=50, help_text='Semester (e.g., 1-1, 1-2, 2-1, 2-2)')
    academic_year = models.CharField(max_length=20, help_text='Academic year (e.g., 2023-24)', blank=True, null=True)
    from_date = models.DateField(help_text='From date for attendance calculation', blank=True, null=True)
    to_date = models.DateField(help_text='To date for attendance calculation', blank=True, null=True)
    total_classes = models.IntegerField(default=0, help_text='Total number of classes conducted')
    classes_attended = models.IntegerField(default=0, help_text='Number of classes attended by student')
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text='Attendance percentage')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about attendance')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Mentor Attendance Record'
        verbose_name_plural = 'Mentor Attendance Records'
        ordering = ['-to_date', '-from_date', 'semester']
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'semester', 'from_date', 'to_date'],
                name='unique_mentor_attendance_date_range',
                condition=models.Q(from_date__isnull=False) & models.Q(to_date__isnull=False)
            )
        ]

    def __str__(self):
        if self.from_date and self.to_date:
            return f"{self.student.full_name or self.student.username} - {self.from_date} to {self.to_date} ({self.semester})"
        return f"{self.student.full_name or self.student.username} - {self.month} {self.semester} ({self.academic_year})"


class StudentAchievement(models.Model):
    """Model to store student achievements for extra-curricular and co-curricular activities."""
    ACHIEVEMENT_TYPE_CHOICES = (
        ('extra_curricular', 'Extra-Curricular'),
        ('co_curricular', 'Co-Curricular'),
        ('representation', 'Representation'),
        ('participation', 'Participation'),
        ('certifications', 'Certifications'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievement_records')
    achievement_type = models.CharField(max_length=50, choices=ACHIEVEMENT_TYPE_CHOICES, help_text='Type of achievement')
    activity_name = models.CharField(max_length=200, help_text='Name of the activity/event')
    event_name = models.CharField(max_length=200, help_text='Specific event name')
    participation_level = models.CharField(max_length=100, help_text='Level of participation (e.g., College, District, State, National)')
    achievement_details = models.TextField(help_text='Details about the achievement')
    date_achieved = models.DateField(help_text='Date when the achievement was made')
    certificate = models.FileField(upload_to='achievement_certificates/', blank=True, null=True, help_text='Certificate file for certifications')
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


class CounsellingNote(models.Model):
    """Model to store counselling notes for students."""
    CATEGORY_CHOICES = (
        ('training', 'Training'),
        ('career', 'Career'),
        ('behaviour', 'Behaviour'),
        ('student_links', 'Student Links'),
    )
    
    TRAINING_CHOICES = (
        ('pps', 'PPS'),
        ('oop', 'OOP'),
        ('dbms', 'DBMS'),
        ('ds', 'DS'),
        ('daa', 'DAA'),
        ('console_apps', 'Console Apps'),
        ('backend_framework', 'Backend Framework/API'),
        ('frontend', 'Frontend'),
        ('iot_hardware', 'IOT Hardware'),
        ('data_analytics', 'Data Analytics'),
        ('certification', 'Certification'),
        ('hackathon', 'Hackathon'),
        ('internship', 'Internship'),
    )
    
    REMARKS_STATUS_CHOICES = (
        ('na', 'NA'),
        ('yet_to_start', 'Yet to Start'),
        ('in_progress', 'In Progress'),
        ('need_help', 'Need Help'),
        ('comfortable', 'Comfortable'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='counselling_notes')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_counselling_notes')
    counselling_date = models.DateField(help_text='Date of the counselling session')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True, null=True, help_text='Category of counselling')
    training = models.CharField(max_length=100, choices=TRAINING_CHOICES, blank=True, null=True, help_text='Training type')
    remarks_status = models.CharField(max_length=50, choices=REMARKS_STATUS_CHOICES, blank=True, null=True, help_text='Remarks status')
    remarks = models.TextField(help_text='Counselling remarks and notes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Counselling Note'
        verbose_name_plural = 'Counselling Notes'
        ordering = ['-counselling_date', '-created_at']

    def __str__(self):
        return f"{self.mentor.full_name or self.mentor.username} - {self.student.full_name or self.student.username} - {self.counselling_date}"


class StudentBehaviour(models.Model):
    """Model to store student behaviour assessments for mentor dashboard."""
    BEHAVIOUR_CATEGORY_CHOICES = (
        ('discipline', 'Discipline'),
        ('participation', 'Class Participation'),
        ('teamwork', 'Teamwork'),
        ('leadership', 'Leadership'),
        ('communication', 'Communication'),
        ('time_management', 'Time Management'),
        ('other', 'Other'),
    )
    RATING_CHOICES = (
        (1, 'Poor'),
        (2, 'Below Average'),
        (3, 'Average'),
        (4, 'Good'),
        (5, 'Excellent'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='behaviour_records')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_behaviours', null=True, blank=True)
    behaviour_category = models.CharField(max_length=50, choices=BEHAVIOUR_CATEGORY_CHOICES, help_text='Category of behaviour')
    rating = models.IntegerField(choices=RATING_CHOICES, help_text='Rating (1-5)')
    assessment_date = models.DateField(help_text='Date of assessment')
    positive_aspects = models.TextField(blank=True, null=True, help_text='Positive aspects observed')
    areas_for_improvement = models.TextField(blank=True, null=True, help_text='Areas needing improvement')
    action_plan = models.TextField(blank=True, null=True, help_text='Action plan for improvement')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about behaviour')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Behaviour'
        verbose_name_plural = 'Student Behaviours'
        ordering = ['-assessment_date', '-created_at']

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.behaviour_category} ({self.rating}/5)"


class StudentCareer(models.Model):
    """Model to store student career information for mentor dashboard."""
    CAREER_STATUS_CHOICES = (
        ('placed', 'Placed'),
        ('seeking', 'Seeking Opportunities'),
        ('higher_studies', 'Pursuing Higher Studies'),
        ('entrepreneur', 'Entrepreneur'),
        ('not_placed', 'Not Placed'),
    )
    
    EXPECTED_PACKAGE_CHOICES = (
        ('3-6', '3-6 LPA'),
        ('6-10', '6-10 LPA'),
        ('10-15', '10-15 LPA'),
        ('15-20', '15-20 LPA'),
        ('20-25', '20-25 LPA'),
        ('25+', '25+ LPA'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_records')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_careers', null=True, blank=True)
    career_status = models.CharField(max_length=50, choices=CAREER_STATUS_CHOICES, help_text='Current career status')
    company_name = models.CharField(max_length=200, blank=True, null=True, help_text='Company name if placed')
    job_role = models.CharField(max_length=200, blank=True, null=True, help_text='Job role/designation')
    placement_date = models.DateField(blank=True, null=True, help_text='Date of placement')
    salary_package = models.CharField(max_length=100, blank=True, null=True, help_text='Salary package (e.g., 6 LPA)')
    skills_for_career = models.TextField(blank=True, null=True, help_text='Skills relevant for career')
    career_goals = models.TextField(blank=True, null=True, help_text='Student career goals')
    guidance_provided = models.TextField(blank=True, null=True, help_text='Career guidance provided by mentor')
    resume_status = models.CharField(max_length=50, blank=True, null=True, help_text='Resume preparation status')
    interview_preparation = models.TextField(blank=True, null=True, help_text='Interview preparation notes')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about career')
    # New fields for student career planning
    career_goal = models.CharField(max_length=200, blank=True, null=True, help_text='What do you want to become?')
    expected_package = models.CharField(max_length=20, choices=EXPECTED_PACKAGE_CHOICES, blank=True, null=True, help_text='Expected salary package')
    desired_role = models.CharField(max_length=200, blank=True, null=True, help_text='Which role do you want to do?')
    dream_company = models.CharField(max_length=200, blank=True, null=True, help_text='Dream company to work?')
    help_needed = models.TextField(blank=True, null=True, help_text='Need any help?')
    faculty_suggestions = models.TextField(blank=True, null=True, help_text='Suggestions from faculty')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Career'
        verbose_name_plural = 'Student Careers'
        ordering = ['-placement_date', '-created_at']

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.career_status}"


class StudentLink(models.Model):
    """Model to store student links/resources for mentor dashboard."""
    LINK_CATEGORY_CHOICES = (
        ('academic', 'Academic Resources'),
        ('career', 'Career Resources'),
        ('skill_development', 'Skill Development'),
        ('certification', 'Certification Resources'),
        ('placement', 'Placement Resources'),
        ('other', 'Other'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_links')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_links', null=True, blank=True)
    link_title = models.CharField(max_length=200, help_text='Title of the link/resource')
    link_url = models.URLField(help_text='URL of the resource')
    link_category = models.CharField(max_length=50, choices=LINK_CATEGORY_CHOICES, help_text='Category of the link')
    description = models.TextField(blank=True, null=True, help_text='Description of the resource')
    importance = models.CharField(max_length=50, blank=True, null=True, help_text='Importance level (e.g., High, Medium, Low)')
    status = models.CharField(max_length=50, default='pending', help_text='Status (e.g., pending, completed, in_progress)')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about the link')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Link'
        verbose_name_plural = 'Student Links'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.link_title}"


class StudentTraining(models.Model):
    """Model to store student training information for mentor dashboard."""
    TRAINING_TYPE_CHOICES = (
        ('technical', 'Technical Training'),
        ('soft_skills', 'Soft Skills Training'),
        ('industry', 'Industry Training'),
        ('certification', 'Certification Program'),
        ('workshop', 'Workshop'),
        ('other', 'Other'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='training_records')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_trainings', null=True, blank=True)
    training_name = models.CharField(max_length=200, help_text='Name of the training program')
    training_type = models.CharField(max_length=50, choices=TRAINING_TYPE_CHOICES, help_text='Type of training')
    organization = models.CharField(max_length=200, blank=True, null=True, help_text='Organization providing training')
    start_date = models.DateField(help_text='Start date of training')
    end_date = models.DateField(help_text='End date of training')
    duration_hours = models.IntegerField(blank=True, null=True, help_text='Duration in hours')
    skills_learned = models.TextField(blank=True, null=True, help_text='Skills learned during training')
    certification_obtained = models.BooleanField(default=False, help_text='Whether certification was obtained')
    certificate_name = models.CharField(max_length=200, blank=True, null=True, help_text='Name of certificate obtained')
    remarks = models.TextField(blank=True, null=True, help_text='Additional remarks about the training')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Training'
        verbose_name_plural = 'Student Trainings'
        ordering = ['-start_date', '-created_at']

    def __str__(self):
        return f"{self.student.full_name or self.student.username} - {self.training_name}"


class Permission(models.Model):
    """Model to store individual permissions."""
    PERMISSION_TYPES = (
        ('view', 'View'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    )
    
    name = models.CharField(max_length=100, unique=True, help_text='Permission name (e.g., attendance.view)')
    display_name = models.CharField(max_length=150, help_text='Human-readable permission name')
    description = models.TextField(blank=True, help_text='Description of what this permission allows')
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPES, help_text='Type of permission')
    module = models.CharField(max_length=50, help_text='Module this permission belongs to (e.g., attendance, students, mentorship)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Permission'
        verbose_name_plural = 'Permissions'
        ordering = ['module', 'name']

    def __str__(self):
        return f"{self.display_name} ({self.name})"


class RolePermission(models.Model):
    """Model to store permissions assigned to roles."""
    role = models.CharField(max_length=20, help_text='Role name (student, faculty, admin, mentor, hod)')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='role_permissions')
    can_access = models.BooleanField(default=True, help_text='Whether this role has this permission')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Role Permission'
        verbose_name_plural = 'Role Permissions'
        unique_together = [['role', 'permission']]
        ordering = ['role', 'permission__module', 'permission__name']

    def __str__(self):
        return f"{self.role} - {self.permission.display_name} ({'Granted' if self.can_access else 'Denied'})"


class UserPermission(models.Model):
    """Model to store custom permissions for individual users (overrides role permissions)."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='user_permissions')
    can_access = models.BooleanField(default=True, help_text='Whether this user has this permission')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Permission'
        verbose_name_plural = 'User Permissions'
        unique_together = [['user', 'permission']]
        ordering = ['user__username', 'permission__module', 'permission__name']

    def __str__(self):
        return f"{self.user.username} - {self.permission.display_name} ({'Granted' if self.can_access else 'Denied'})"


class TabAccess(models.Model):
    """Model to control which tabs/sections users can access."""
    TAB_CHOICES = (
        ('dashboard', 'Dashboard'),
        ('attendance', 'Attendance'),
        ('students', 'Students'),
        ('mentorship', 'Mentorship'),
        ('reports', 'Reports'),
        ('settings', 'Settings'),
        ('faculty_portal', 'Faculty Portal'),
        ('student_portal', 'Student Portal'),
        ('mentor_dashboard', 'Mentor Dashboard'),
        ('admin_panel', 'Admin Panel'),
    )
    
    role = models.CharField(max_length=20, help_text='Role name')
    tab = models.CharField(max_length=50, choices=TAB_CHOICES, help_text='Tab/section name')
    can_access = models.BooleanField(default=True, help_text='Whether this role can access this tab')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Tab Access'
        verbose_name_plural = 'Tab Access'
        unique_together = [['role', 'tab']]
        ordering = ['role', 'tab']

    def __str__(self):
        return f"{self.role} - {self.tab} ({'Accessible' if self.can_access else 'Restricted'})"
