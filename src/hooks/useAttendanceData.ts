import { Student, AttendanceStats, ClassSession, Filters } from '../types';
import { mockStudents, mockClassSessions } from '../lib/mockData';
import { useLocalStorage } from './useLocalStorage';

export function useAttendanceData() {
  const [students, setStudents] = useLocalStorage<Student[]>('attendance-students', mockStudents);
  const [classSessions, setClassSessions] = useLocalStorage<ClassSession[]>('attendance-classes', mockClassSessions);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, studentData: Omit<Student, 'id'>) => {
    setStudents(students.map(student => 
      student.id === id ? { ...studentData, id } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const addClassSession = (classSession: ClassSession) => {
    setClassSessions([...classSessions, classSession]);
  };

  const getFilteredStudents = (filters: Filters) => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           student.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDiplomatura = filters.diplomatura === 'all' || student.diplomatura === filters.diplomatura;
      const matchesStatus = filters.status === 'all' || student.status === filters.status;

      return matchesSearch && matchesDiplomatura && matchesStatus;
    });
  };

  const getStats = (filters: Filters): AttendanceStats => {
    const filteredStudents = getFilteredStudents(filters);
    
    const totalStudents = filteredStudents.length;
    const approvedStudents = filteredStudents.filter(s => s.status === 'aprobado').length;
    const averageAttendance = totalStudents > 0 
      ? filteredStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents 
      : 0;
    
    const totalClasses = filteredStudents.reduce((sum, s) => sum + s.totalClasses, 0);

    // Stats por diplomatura
    const diplomaturasStats: { [key: string]: { totalStudents: number; averageAttendance: number; totalClasses: number } } = {};
    
    const diplomaturas = [...new Set(students.map(s => s.diplomatura))];
    diplomaturas.forEach(diplomatura => {
      const diplomaStudents = students.filter(s => s.diplomatura === diplomatura);
      diplomaturasStats[diplomatura] = {
        totalStudents: diplomaStudents.length,
        averageAttendance: diplomaStudents.length > 0 
          ? diplomaStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / diplomaStudents.length 
          : 0,
        totalClasses: diplomaStudents.reduce((sum, s) => sum + s.totalClasses, 0),
      };
    });

    return {
      totalStudents,
      approvedStudents,
      averageAttendance,
      totalClasses,
      diplomaturasStats,
    };
  };

  return {
    students,
    classSessions,
    addStudent,
    updateStudent,
    deleteStudent,
    addClassSession,
    getFilteredStudents,
    getStats,
  };
}