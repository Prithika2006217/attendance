
from rest_framework import serializers
from .models import User, Attendance, Department, Subject, Section, FacultyDepartmentSection, QRAttendanceSession, QRAttendanceRecord, MentorStudentAssignment, StudentAcademicRecord, MentorAttendanceRecord, StudentAchievement, MentorRemark, CounsellingNote, StudentBehaviour, StudentCareer, StudentLink, StudentTraining
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
            'date_of_birth', 'date_of_joining', 'guardian_name', 'guardian_relation', 'guardian_mobile',
            'occupation', 'income', 'address', 'city', 'state', 'pincode',
            'admission_category', 'eapcet_rank', 'ecet_rank', 'reservation_category',
            'scholarship', 'residential_details', 'mode_of_transport', 'photo',
            'ssc_board', 'ssc_school', 'ssc_percentage', 'ssc_class',
            'intermediate_board', 'intermediate_college', 'intermediate_percentage', 'intermediate_class',
            'medium_of_instruction', 'local', 'mother_tongue', 'achievements', 'hobbies',
            'areas_of_interest', 'other_information'
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
            'date_of_birth', 'date_of_joining', 'guardian_name', 'guardian_relation', 'guardian_mobile',
            'occupation', 'income', 'address', 'city', 'state', 'pincode',
            'admission_category', 'eapcet_rank', 'ecet_rank', 'reservation_category',
            'scholarship', 'residential_details', 'mode_of_transport', 'photo',
            'ssc_board', 'ssc_school', 'ssc_percentage', 'ssc_class',
            'intermediate_board', 'intermediate_college', 'intermediate_percentage', 'intermediate_class',
            'medium_of_instruction', 'local', 'mother_tongue', 'achievements', 'hobbies',
            'areas_of_interest', 'other_information'
        )
        read_only_fields = ('id', 'username', 'role')
        extra_kwargs = {
            'assigned_subject_ids': {'required': False},
            'is_detained': {'required': False},
            'date_of_birth': {'required': False},
            'date_of_joining': {'required': False},
            'guardian_name': {'required': False},
            'guardian_relation': {'required': False},
            'guardian_mobile': {'required': False},
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

    def to_representation(self, instance):
        """Custom representation to handle photo field."""
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
        return data

    def update(self, instance, validated_data):
        # Username/role are read-only on the serializer; email may be updated by allowed users.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
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
    department_code = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subject
        fields = ('id', 'name', 'code', 'departments', 'department_codes', 'department_code', 'year', 'semester')

    def get_department_codes(self, obj):
        codes = [d.code for d in obj.departments.all()]
        return sorted(codes)

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

    class Meta:
        model = MentorStudentAssignment
        fields = (
            'id', 'mentor', 'student', 'mentor_name', 'mentor_email',
            'student_name', 'student_email', 'student_roll_number',
            'student_department', 'student_section', 'assigned_at', 'notes'
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
            'total_classes', 'classes_attended', 'attendance_percentage',
            'remarks', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'mentor')

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_student_roll_number(self, obj):
        return obj.student.roll_number

    def get_mentor_name(self, obj):
        return obj.mentor.full_name or obj.mentor.username


class StudentAchievementSerializer(serializers.ModelSerializer):
    """Serializer for student achievements."""
    student_name = serializers.SerializerMethodField(read_only=True)
    student_roll_number = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentAchievement
        fields = (
            'id', 'student', 'student_name', 'student_roll_number',
            'achievement_type', 'activity_name', 'event_name', 
            'participation_level', 'achievement_details', 'date_achieved',
            'created_at', 'updated_at'
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
