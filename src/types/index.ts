export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  phone: string;
  dni: string;
  program: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  duration: number; // in minutes
  present: boolean;
}

export interface ClassSession {
  id: string;
  date: string;
  fileName: string;
  attendanceRecords: AttendanceRecord[];
  totalStudents: number;
  presentStudents: number;
}

export interface StudentStatistics {
  student: Student;
  totalClasses: number;
  attendances: number;
  absences: number;
  attendancePercentage: number;
  status: 'Aprobado' | 'No Aprobado';
  classDetails: {
    classId: string;
    date: string;
    present: boolean;
  }[];
}

export interface TeamsAttendanceRow {
  [key: string]: string | number;
}