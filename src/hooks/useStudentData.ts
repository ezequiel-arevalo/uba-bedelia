/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Student, ClassSession, Filters, SortConfig, StudentStats, StudentWithAttendance, Diplomatura } from '../types';
import { mockStudents, mockClassSessions, mockDiplomaturas } from '../lib/mockData';
import { useLocalStorage } from './useLocalStorage';

export function useStudentData() {
  const [students, setStudents] = useLocalStorage<Student[]>('students-data', mockStudents);
  const [classSessions, setClassSessions] = useLocalStorage<ClassSession[]>('class-sessions', mockClassSessions);
  const [diplomaturas, setDiplomaturas] = useLocalStorage<Diplomatura[]>('diplomaturas-data', mockDiplomaturas);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

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

  const addDiplomatura = (diplomaturaData: Omit<Diplomatura, 'id' | 'createdAt'>) => {
    const newDiplomatura: Diplomatura = {
      ...diplomaturaData,
      id: `diplomatura-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDiplomaturas([...diplomaturas, newDiplomatura]);
  };

  const updateDiplomatura = (id: string, diplomaturaData: Omit<Diplomatura, 'id' | 'createdAt'>) => {
    setDiplomaturas(diplomaturas.map(diplomatura => 
      diplomatura.id === id ? { ...diplomatura, ...diplomaturaData } : diplomatura
    ));
  };

  const deleteDiplomatura = (id: string) => {
    const diplomatura = diplomaturas.find(d => d.id === id);
    if (diplomatura) {
      // Remove all students and class sessions for this diplomatura
      setStudents(students.filter(student => student.diplomatura !== diplomatura.name));
      setClassSessions(classSessions.filter(session => session.diplomatura !== diplomatura.name));
      setDiplomaturas(diplomaturas.filter(d => d.id !== id));
    }
  };

  const getStudentCountByDiplomatura = (diplomaturaName: string): number => {
    return students.filter(student => student.diplomatura === diplomaturaName).length;
  };

  const getStudentsWithAttendance = (): StudentWithAttendance[] => {
    return students.map(student => {
      // Get diplomatura configuration
      const diplomaturaConfig = diplomaturas.find(config => config.name === student.diplomatura);
      const totalClassesForDiplomatura = diplomaturaConfig?.totalClasses || 20;

      // Count attended classes for this student
      const attendedClasses = classSessions
        .filter(session => session.diplomatura === student.diplomatura)
        .reduce((count, session) => {
          const hasAttendance = session.attendanceRecords.some(record => 
            record.studentName.toLowerCase().trim() === `${student.nombre} ${student.apellido}`.toLowerCase().trim()
          );
          return hasAttendance ? count + 1 : count;
        }, 0);

      const attendancePercentage = totalClassesForDiplomatura > 0 
        ? (attendedClasses / totalClassesForDiplomatura) * 100 
        : 0;

      const aprobado = attendancePercentage >= 75;

      return {
        ...student,
        attendedClasses,
        totalClassesForDiplomatura,
        attendancePercentage,
        aprobado
      };
    });
  };

  const getFilteredAndSortedStudents = (filters: Filters): StudentWithAttendance[] => {
    const studentsWithAttendance = getStudentsWithAttendance();
    
    let filtered = studentsWithAttendance.filter(student => {
      // Search filter
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !searchTerm || 
        student.nombre.toLowerCase().includes(searchTerm) ||
        student.apellido.toLowerCase().includes(searchTerm) ||
        student.idEstudiante.toLowerCase().includes(searchTerm) ||
        student.telefono.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.diplomatura.toLowerCase().includes(searchTerm);

      // Diplomatura filter
      const matchesDiplomatura = filters.diplomatura === 'all' || 
        (Array.isArray(filters.diplomatura) 
          ? filters.diplomatura.includes(student.diplomatura)
          : filters.diplomatura === student.diplomatura);

      // Approval status filter
      const matchesApproval = filters.aprobado === 'all' || 
        (filters.aprobado === 'aprobado' ? student.aprobado : !student.aprobado);

      return matchesSearch && matchesDiplomatura && matchesApproval;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key!];
        let bValue: any = b[sortConfig.key!];

        if (sortConfig.key === 'idEstudiante') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        } else if (sortConfig.key === 'aprobado') {
          aValue = a.aprobado ? 1 : 0;
          bValue = b.aprobado ? 1 : 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const getStats = (filters: Filters): StudentStats => {
    const filteredStudents = getFilteredAndSortedStudents(filters);
    
    const totalStudents = filteredStudents.length;
    const approvedStudents = filteredStudents.filter(s => s.aprobado).length;
    const notApprovedStudents = totalStudents - approvedStudents;
    const averageAttendance = totalStudents > 0 
      ? filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents 
      : 0;

    return {
      totalStudents,
      approvedStudents,
      notApprovedStudents,
      averageAttendance,
    };
  };

  const handleSort = (key: 'idEstudiante' | 'aprobado') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    students,
    classSessions,
    diplomaturas,
    sortConfig,
    addStudent,
    updateStudent,
    deleteStudent,
    addClassSession,
    addDiplomatura,
    updateDiplomatura,
    deleteDiplomatura,
    getStudentCountByDiplomatura,
    getFilteredAndSortedStudents,
    getStats,
    handleSort,
  };
}