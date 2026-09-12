
from rest_framework import serializers
from .models import User, Attendance, Department, Subject, Section, FacultyDepartmentSection, QRAttendanceSession, QRAttendanceRecord, MentorStudentAssignment, StudentAcademicRecord, MentorAttendanceRecord, StudentAchievement, MentorRemark, CounsellingNote, StudentBehaviour, StudentCareer, StudentLink, StudentTraining, Permission, RolePermission, UserPermission, TabAccess
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField(read_only=True)
    sections = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'role',
            'full_name', 'roll_number', 'phone',
            'department', 'section', 'sections', 'year',
            'is_detained',
            'assigned_subject_ids', 'subjects',
            'date_of_birth', 'date_of_joining', 'guardian_name', 'guardian_relation', 'guardian_mobile', 'guardian_mobiles',
            'occupation', 'income', 'address', 'city', 'state', 'pincode',
            'admission_category', 'eapcet_rank', 'ecet_rank', 'reservation_category',
            'scholarship', 'residential_details', 'mode_of_transport', 'photo',
            'ssc_board', 'ssc_school', 'ssc_percentage', 'ssc_class',
            'intermediate_board', 'intermediate_college', 'intermediate_percentage', 'intermediate_class',
            'medium_of_instruction', 'local', 'mother_tongue', 'achievements', 'hobbies',
            'areas_of_interest', 'other_information',
            'visible_password'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'assigned_subject_ids': {'required': False},
            'is_detained': {'required': False},
            'date_of_birth': {'required': False},
            'date_of_joining': {'required': False},
            'guardian_name': {'required': False},
            'guardian_relation': {'required': False},
            'occupation': {'required': False},
            'income': {'required': False},
            'address': {'required': False},
            'city': {'required': False},
            'state': {'required': False},
            'pincode': {'required': False},
            'admission_category': {'required': False},
            'eapcet_rank': {'required': False},
            'ecet_rank': {'required': False},
            'reservation_category': {'required': False},
            'scholarship': {'required': False},
            'residential_details': {'required': False},
            'mode_of_transport': {'required': False},
            'photo': {'required': False},
            'ssc_board': {'required': False},
            'ssc_school': {'required': False},
            'ssc_percentage': {'required': False},
            'ssc_class': {'required': False},
            'intermediate_board': {'required': False},
            'intermediate_college': {'required': False},
            'intermediate_percentage': {'required': False},
            'intermediate_class': {'required': False},
            'medium_of_instruction': {'required': False},
            'local': {'required': False},
            'mother_tongue': {'required': False},
            'achievements': {'required': False},
            'hobbies': {'required': False},
            'areas_of_interest': {'required': False},
            'other_information': {'required': False},
        }
        read_only_fields = ('visible_password',)

    def get_subjects(self, obj):
        s = (obj.assigned_subject_ids or '').strip()
        return [x.strip() for x in s.split(',') if x.strip()] if s else []

    def get_sections(self, obj):
        s = (obj.section or '').strip()
        return [x.strip() for x in s.split(',') if x.strip()] if s else []

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.visible_password = password
        user.save()
        return user

User = get_user_model()

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found. Use the same email you used when creating the account."})

        if not user.check_password(data['password']):
            raise serializers.ValidationError({"detail": "Invalid password."})

        data['user'] = user
        return data



class UserSerializer(serializers.ModelSerializer):
    """Read and update user (e.g. student details). No password exposure."""
    departments = serializers.SerializerMethodField(read_only=True)
    subjects = serializers.SerializerMethodField(read_only=True)
    sections = serializers.SerializerMethodField(read_only=True)
    faculty_department_sections = serializers.SerializerMethodField(read_only=True)
    parser_classes = [MultiPartParser, FormParser]

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'role',
            'full_name', 'roll_number', 'phone',
            'department', 'departments', 'section', 'sections', 'year',
            'is_detained',
            'assigned_subject_ids', 'subjects', 'faculty_department_sections',
            'date_of_birth', 'date_of_joining', 'guardian_name', 'guardian_relation', 'guardian_mobile', 'guardian_mobiles',
            'occupation', 'income', 'address', 'city', 'state', 'pincode',
            'admission_category', 'eapcet_rank', 'ecet_rank', 'reservation_category',
            'scholarship', 'residential_details', 'mode_of_transport', 'photo',
            'ssc_board', 'ssc_school', 'ssc_percentage', 'ssc_class',
            'intermediate_board', 'intermediate_college', 'intermediate_percentage', 'intermediate_class',
            'medium_of_instruction', 'local', 'mother_tongue', 'achievements', 'hobbies',
            'areas_of_interest', 'other_information',
            'visible_password'
        )
        read_only_fields = ('id', 'username', 'role', 'visible_password')
        extra_kwargs = {
            'phone': {'required': False, 'allow_blank': True},
            'assigned_subject_ids': {'required': False},
            'is_detained': {'required': False},
            'date_of_birth': {'required': False},
            'date_of_joining': {'required': False},
            'guardian_name': {'required': False},
            'guardian_relation': {'required': False},
            'guardian_mobile': {'required': False},
            'guardian_mobiles': {'required': False},
            'occupation': {'required': False},
            'income': {'required': False},
            'address': {'required': False},
            'city': {'required': False},
            'state': {'required': False},
            'pincode': {'required': False},
            'admission_category': {'required': False},
            'eapcet_rank': {'required': False},
            'ecet_rank': {'required': False},
            'reservation_category': {'required': False},
            'scholarship': {'required': False},
            'residential_details': {'required': False},
            'mode_of_transport': {'required': False},
            'photo': {'required': False},
            'ssc_board': {'required': False},
            'ssc_school': {'required': False},
            'ssc_percentage': {'required': False},
            'ssc_class': {'required': False},
            'intermediate_board': {'required': False},
            'intermediate_college': {'required': False},
            'intermediate_percentage': {'required': False},
            'intermediate_class': {'required': False},
            'medium_of_instruction': {'required': False},
            'local': {'required': False},
            'mother_tongue': {'required': False},
            'achievements': {'required': False},
            'hobbies': {'required': False},
            'areas_of_interest': {'required': False},
            'other_information': {'required': False},
        }

    def get_departments(self, obj):
        s = (obj.department or '').strip()
        return [x.strip() for x in s.split(',') if x.strip()]

    def get_subjects(self, obj):
        s = (obj.assigned_subject_ids or '').strip()
        if not s:
            return []
        return [x.strip() for x in s.split(',') if x.strip()]

    def get_sections(self, obj):
        s = (obj.section or '').strip()
        return [x.strip() for x in s.split(',') if x.strip()] if s else []

    def get_faculty_department_sections(self, obj):
        """Return faculty department-section assignments for faculty users."""
        if obj.role != 'faculty':
            return []
        assignments = FacultyDepartmentSection.objects.filter(faculty=obj).select_related('department', 'section')
        return [
            {
                'department_code': assignment.department.code,
                'section_name': assignment.section.name
            }
            for assignment in assignments
        ]

    def validate_guardian_mobiles(self, value):
        """Validate guardian mobile numbers."""
        if value is None:
            return []
        
        # Handle JSON string from FormData
        if isinstance(value, str):
            try:
                import json
                value = json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid format for guardian mobiles.")
        
        if not isinstance(value, list):
            raise serializers.ValidationError("Guardian mobiles must be a list.")
        
        # Filter out empty strings and validate each mobile number
        valid_mobiles = [m.strip() for m in value if m and m.strip()]
        
        # Validate mobile number format
        if valid_mobiles and len(valid_mobiles) > 0:
            for mobile in valid_mobiles:
                if not mobile.isdigit() or len(mobile) < 10:
                    raise serializers.ValidationError(f"Invalid mobile number: {mobile}")
        
        return valid_mobiles

    def to_representation(self, instance):
        """Custom representation to handle photo field and guardian mobiles."""
        data = super().to_representation(instance)
        
        # Handle photo field - return full URL if exists, null otherwise
        if instance.photo and hasattr(instance.photo, 'url'):
            # Get the URL from the image field
            photo_url = instance.photo.url
            # Ensure it starts with /media/
            if not photo_url.startswith('/media/'):
                photo_url = f"/media/{photo_url.lstrip('/')}"
            data['photo'] = photo_url
        else:
            data['photo'] = None
        
        # Handle guardian_mobiles field - prioritize guardian_mobiles, fallback to guardian_mobile
        if instance.guardian_mobiles and isinstance(instance.guardian_mobiles, list) and len(instance.guardian_mobiles) > 0:
            data['guardian_mobiles'] = instance.guardian_mobiles
        elif instance.guardian_mobile:
            data['guardian_mobiles'] = [instance.guardian_mobile]
        else:
            data['guardian_mobiles'] = []
        
        return data

    def update(self, instance, validated_data):
        # Handle guardian_mobiles field
        if 'guardian_mobiles' in validated_data:
            guardian_mobiles = validated_data.pop('guardian_mobiles')
            # Parse JSON string if needed (from FormData)
            if isinstance(guardian_mobiles, str):
                try:
                    import json
                    guardian_mobiles = json.loads(guardian_mobiles)
                except json.JSONDecodeError:
                    guardian_mobiles = []
            
            instance.guardian_mobiles = guardian_mobiles
            # Update legacy guardian_mobile field for backward compatibility
            if guardian_mobiles and len(guardian_mobiles) > 0:
                instance.guardian_mobile = guardian_mobiles[0]
            else:
                instance.guardian_mobile = None
        
        # Username/role are read-only on the serializer; email may be updated by allowed users.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Refresh the instance to ensure all fields are updated
        instance.refresh_from_db()
        
        return instance


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'code')


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('id', 'name')


class SubjectSerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), many=True)
    department_codes = serializers.SerializerMethodField(read_only=True)
    department_names = serializers.SerializerMethodField(read_only=True)
    department_code = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subject
        fields = ('id', 'name', 'code', 'departments', 'department_codes', 'department_names', 'department_code', 'year', 'semester')

    def get_department_codes(self, obj):
        codes = [d.code for d in obj.departments.all()]
        return sorted(codes)

    def get_department_names(self, obj):
        names = [d.name for d in obj.departments.all()]
        return sorted(names)

    def get_department_code(self, obj):
        codes = self.get_department_codes(obj)
        return codes[0] if codes else ''

    def create(self, validated_data):
        departments = validated_data.pop('departments', [])
        subject = Subject.objects.create(**validated_data)
        if departments:
            subject.departments.set(departments)
        return subject

    def update(self, instance, validated_data):
        departments = validated_data.pop('departments', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if departments is not None:
            instance.departments.set(departments)
        return instance


class FacultyDepartmentSectionSerializer(serializers.ModelSerializer):
    """Serializer for faculty department-section assignments."""
    department_code = serializers.SerializerMethodField(read_only=True)
    section_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FacultyDepartmentSection
        fields = ('id', 'faculty', 'department', 'section', 'department_code', 'section_name')
        read_only_fields = ('id', 'faculty')

    def get_department_code(self, obj):
        return obj.department.code if obj.department else None

    def get_section_name(self, obj):
        return obj.section.name if obj.section else None


class QRAttendanceSessionSerializer(serializers.ModelSerializer):
    """Serializer for QR attendance sessions."""
    faculty_name = serializers.SerializerMethodField(read_only=True)
    attendance_count = serializers.SerializerMethodField(read_only=True)
    is_expired = serializers.SerializerMethodField(read_only=True)
    branches = serializers.SerializerMethodField(read_only=True)
    duration_hours = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = QRAttendanceSession
        fields = (
            'id', 'faculty', 'faculty_name', 'subject', 'year', 'branch', 'branches', 'sections',
            'duration_minutes', 'duration_hours', 'start_time', 'end_time', 'is_active', 
            'current_qr_token', 'token_expires_at', 'token_refresh_interval',
            'custom_session_id', 'session_id_expires_at',
            'attendance_count', 'is_expired'
        )
        read_only_fields = ('id', 'faculty', 'start_time', 'current_qr_token', 'token_expires_at', 'custom_session_id', 'session_id_expires_at')

    def get_faculty_name(self, obj):
        return obj.faculty.full_name or obj.faculty.username

    def get_attendance_count(self, obj):
        return obj.attendance_records.count()

    def get_is_expired(self, obj):
        from django.utils import timezone
        return timezone.now() > obj.end_time

    def get_branches(self, obj):
        # Return branches field if it exists, otherwise use branch field
        if hasattr(obj, 'branches') and obj.branches:
            return obj.branches
        elif obj.branch:
            return obj.branch
        return ''

    def get_duration_hours(self, obj):
        # Convert duration_minutes to hours
        return round(obj.duration_minutes / 60, 2)


class QRAttendanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for QR attendance records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    student_section = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = QRAttendanceRecord
        fields = (
            'id', 'session', 'student', 'student_name', 'student_roll_number', 
            'student_section', 'device_id', 'scanned_at'
        )
        read_only_fields = ('id', 'session', 'student', 'scanned_at')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_student_section(self, obj):
        return obj.student.section


class MentorStudentAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for mentor-student assignments."""
    mentor_name = serializers.SerializerMethodField(read_only=True)
    mentor_email = serializers.SerializerMethodField(read_only=True)
    student_name = serializers.SerializerMethodField(read_only=True)
    student_email = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    student_department = serializers.SerializerMethodField(read_only=True)
    student_section = serializers.SerializerMethodField(read_only=True)
    student_year = serializers.SerializerMethodField(read_only=True)
    student_phone = serializers.SerializerMethodField(read_only=True)
    student_is_detained = serializers.SerializerMethodField(read_only=True)
    student_photo = serializers.SerializerMethodField(read_only=True)
    attendance_percentage = serializers.SerializerMethodField(read_only=True)
    overall_cgpa = serializers.SerializerMethodField(read_only=True)
    guardian_name = serializers.SerializerMethodField(read_only=True)
    guardian_relation = serializers.SerializerMethodField(read_only=True)
    guardian_mobile = serializers.SerializerMethodField(read_only=True)
    guardian_mobiles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MentorStudentAssignment
        fields = (
            'id', 'mentor', 'student', 'mentor_name', 'mentor_email',
            'student_name', 'student_email', 'student_roll_number',
            'student_department', 'student_section', 'student_year',
            'student_phone', 'student_is_detained', 'student_photo',
            'assigned_at', 'notes', 'attendance_percentage', 'overall_cgpa',
            'guardian_name', 'guardian_relation', 'guardian_mobile', 'guardian_mobiles'
        )
        read_only_fields = ('id', 'assigned_at')

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username

    def get_mentor_email(self, obj):
        return obj.mentor.email

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_email(self, obj):
        return obj.student.email

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_student_department(self, obj):
        return obj.student.department

    def get_student_section(self, obj):
        return obj.student.section

    def get_student_year(self, obj):
        return obj.student.year

    def get_student_phone(self, obj):
        return obj.student.phone

    def get_student_is_detained(self, obj):
        return obj.student.is_detained

    def get_student_photo(self, obj):
        if obj.student.photo and hasattr(obj.student.photo, 'url'):
            photo_url = obj.student.photo.url
            if not photo_url.startswith('/media/'):
                photo_url = f"/media/{photo_url.lstrip('/')}"
            return photo_url
        return None

    def get_guardian_name(self, obj):
        return obj.student.guardian_name

    def get_guardian_relation(self, obj):
        return obj.student.guardian_relation

    def get_guardian_mobile(self, obj):
        return obj.student.guardian_mobile

    def get_guardian_mobiles(self, obj):
        # Return guardian_mobiles if available, otherwise fall back to guardian_mobile
        if obj.student.guardian_mobiles and isinstance(obj.student.guardian_mobiles, list) and len(obj.student.guardian_mobiles) > 0:
            return obj.student.guardian_mobiles
        elif obj.student.guardian_mobile:
            return [obj.student.guardian_mobile]
        else:
            return []

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_student_department(self, obj):
        return obj.student.department

    def get_student_section(self, obj):
        return obj.student.section

    def get_attendance_percentage(self, obj):
        """Calculate overall attendance percentage for the student from mentor attendance records."""
        from .models import MentorAttendanceRecord
        try:
            # First try to get attendance from mentor attendance records
            mentor_attendance_records = MentorAttendanceRecord.objects.filter(student=obj.student)
            if mentor_attendance_records.exists():
                # Calculate average attendance percentage from all mentor records
                total_percentage = 0
                count = 0
                for record in mentor_attendance_records:
                    if record.attendance_percentage is not None:
                        total_percentage += float(record.attendance_percentage)
                        count += 1
                
                if count > 0:
                    return round(total_percentage / count, 1)
            
            # Fallback to regular attendance records if no mentor records found
            from .models import Attendance
            total_classes = Attendance.objects.filter(student=obj.student).count()
            if total_classes == 0:
                return None
            present_classes = Attendance.objects.filter(student=obj.student, status='present').count()
            percentage = (present_classes / total_classes) * 100
            return round(percentage, 1)
        except Exception:
            return None

    def get_overall_cgpa(self, obj):
        """Calculate overall CGPA from academic records using SGPA values."""
        from .models import StudentAcademicRecord
        try:
            academic_records = StudentAcademicRecord.objects.filter(student=obj.student)
            if not academic_records.exists():
                return None
            
            total_sgpa = 0
            count = 0
            for record in academic_records:
                if record.sgpa:
                    total_sgpa += float(record.sgpa)
                    count += 1
            
            if count == 0:
                return None
            return round(total_sgpa / count, 2)
        except Exception:
            return None


class StudentAcademicRecordSerializer(serializers.ModelSerializer):
    """Serializer for student academic records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    updated_by_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentAcademicRecord
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'course_name', 'semester', 'academic_year',
            'mid1_marks', 'mid2_marks', 'cie_marks', 'total_internal_marks',
            'marks_obtained', 'credits_obtained', 'sgpa',
            'audit_course_cleared', 'grade', 'remarks',
            'created_at', 'updated_at', 'updated_by', 'updated_by_name'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'updated_by')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_updated_by_name(self, obj):
        return obj.updated_by.full_name or obj.updated_by.username if obj.updated_by else None


class MentorAttendanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for mentor attendance records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MentorAttendanceRecord
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'month', 'semester', 'academic_year',
            'from_date', 'to_date', 'total_classes', 'classes_attended', 'attendance_percentage',
            'remarks', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username

    def validate(self, data):
        """Validate that the combination of student, semester, and date range is unique."""
        # Skip validation for updates (when instance exists)
        if self.instance:
            return data

        student = data.get('student')
        semester = data.get('semester')
        from_date = data.get('from_date')
        to_date = data.get('to_date')

        # Check for duplicate records only if all fields are present
        if student and semester and from_date and to_date:
            if MentorAttendanceRecord.objects.filter(
                student=student,
                semester=semester,
                from_date=from_date,
                to_date=to_date
            ).exists():
                raise serializers.ValidationError(
                    "An attendance record for this student, semester, and date range already exists."
                )
        return data

    def create(self, validated_data):
        """Override create to set the mentor from the request context."""
        # Get the mentor from the context (set in the view)
        mentor = self.context.get('request').user
        validated_data['mentor'] = mentor
        return super().create(validated_data)


class StudentAchievementSerializer(serializers.ModelSerializer):
    """Serializer for student achievements."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    certificate = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = StudentAchievement
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'achievement_type', 'activity_name', 'event_name', 
            'participation_level', 'achievement_details', 'date_achieved',
            'certificate', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number


class MentorRemarkSerializer(serializers.ModelSerializer):
    """Serializer for mentor remarks."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)
    mentor_email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MentorRemark
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'mentor_email',
            'remark_date', 'mentoring_area', 'remarks',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'student', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username

    def get_mentor_email(self, obj):
        return obj.mentor.email


class CounsellingNoteSerializer(serializers.ModelSerializer):
    """Serializer for counselling notes."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)
    mentor_email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CounsellingNote
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'mentor_email',
            'counselling_date', 'category', 'training', 'remarks_status', 'remarks',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'student', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username

    def get_mentor_email(self, obj):
        return obj.mentor.email


class StudentBehaviourSerializer(serializers.ModelSerializer):
    """Serializer for student behaviour records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentBehaviour
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'behaviour_category', 'rating',
            'assessment_date', 'positive_aspects', 'areas_for_improvement',
            'action_plan', 'remarks', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'student', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username if obj.mentor else None


class StudentCareerSerializer(serializers.ModelSerializer):
    """Serializer for student career records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentCareer
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'career_status', 'company_name',
            'job_role', 'placement_date', 'salary_package',
            'skills_for_career', 'career_goals', 'guidance_provided',
            'resume_status', 'interview_preparation', 'remarks',
            'career_goal', 'expected_package', 'desired_role',
            'dream_company', 'help_needed', 'faculty_suggestions',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'student', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username if obj.mentor else None


class StudentLinkSerializer(serializers.ModelSerializer):
    """Serializer for student link records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentLink
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'link_title', 'link_url',
            'link_category', 'description', 'importance', 'status',
            'remarks', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'student', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username if obj.mentor else None


class StudentTrainingSerializer(serializers.ModelSerializer):
    """Serializer for student training records."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)
    mentor_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentTraining
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'mentor', 'mentor_name', 'training_name', 'training_type',
            'organization', 'start_date', 'end_date', 'duration_hours',
            'skills_learned', 'certification_obtained', 'certificate_name',
            'remarks', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'student', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username if obj.mentor else None


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer for permissions."""
    class Meta:
        model = Permission
        fields = ('id', 'name', 'display_name', 'description', 'permission_type', 'module', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class RolePermissionSerializer(serializers.ModelSerializer):
    """Serializer for role permissions."""
    permission_details = PermissionSerializer(source='permission', read_only=True)
    
    class Meta:
        model = RolePermission
        fields = ('id', 'role', 'permission', 'permission_details', 'can_access', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class UserPermissionSerializer(serializers.ModelSerializer):
    """Serializer for user permissions."""
    permission_details = PermissionSerializer(source='permission', read_only=True)
    user_username = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = UserPermission
        fields = ('id', 'user', 'user_username', 'permission', 'permission_details', 'can_access', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_user_username(self, obj):
        return obj.user.username


class TabAccessSerializer(serializers.ModelSerializer):
    """Serializer for tab access control."""
    class Meta:
        model = TabAccess
        fields = ('id', 'role', 'tab', 'can_access', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
