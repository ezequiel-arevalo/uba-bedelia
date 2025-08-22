export interface Student {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  diplomatura: string;
  idEstudiante: string;
  aprobado?: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  present: boolean;
  duration?: number;
}

export interface ClassSession {
  id: string;
  date: string;
  fileName: string;
  diplomatura: string;
  attendanceRecords: AttendanceRecord[];
  totalStudents: number;
  presentStudents: number;
}

export interface Diplomatura {
  id: string;
  name: string;
  totalClasses: number;
  createdAt: string;
}

export interface StudentWithAttendance extends Student {
  attendedClasses: number;
  totalClassesForDiplomatura: number;
  attendancePercentage: number;
  aprobado: boolean;
}

export interface Filters {
  diplomatura: string | string[];
  aprobado: string;
  search: string;
}

export interface SortConfig {
  key: 'idEstudiante' | 'aprobado' | null;
  direction: 'asc' | 'desc';
}

export interface StudentStats {
  totalStudents: number;
  approvedStudents: number;
  notApprovedStudents: number;
  averageAttendance: number;
}