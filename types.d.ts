// types.d.ts
export {};

declare global {
    interface JobApplication {
        id: number;
        job_post_id: number;
        user_id: number;
        cover_letter: string;
        resume_path: string;
        status: string;
        applied_at: string;
        created_at: string;
        updated_at: string;
    }

    interface EmployeeDetail {
        employeeNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        jobTitle: string | null;
        department?: string;
        dateHired: string;
        status: string;
        qrCodePath?: string;
    }

    interface LeaveRequest {
        id: number;
        created_at: string;
        status: string;
        leave_type: LeaveType;
    }

    interface LeaveType {
        id: number;
        name: string;
        description?: string;
        notice_days: number;
        value: number;
    }

    interface JobPost {
        id: number;
        title: string;
    }

    interface EmployeeRow {
        employeeNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        jobTitle: string | null;
        status: string;
    }

    interface AttendanceRecord {
      id: number;
      employee_id: number;
      date: string;
      time_in: string;
      time_out: string;
      total_hours: number;
      late_duration: number;
    }
    
    interface PaginatedAttendanceRecord {
      data: AttendanceRecord[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    }
}
