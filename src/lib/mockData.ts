import { Student, ClassSession, Diplomatura } from '../types';

export const mockDiplomaturas: Diplomatura[] = [
  { 
    id: '1', 
    name: 'TANGO', 
    totalClasses: 20,
    createdAt: '2024-01-01'
  },
];

export const mockStudents: Student[] = [
  {
    id: '1',
    nombre: 'Ezequiel',
    apellido: 'Arevalo',
    telefono: '+54 11 1234-5678',
    email: 'ezequiel.arevalo@economicas.com',
    diplomatura: 'TANGO',
    idEstudiante: '001'
  },
];

export const mockClassSessions: ClassSession[] = [
  {
    id: 'test',
    date: '2024-02-29',
    fileName: 'tango.csv',
    diplomatura: 'TANGO',
    attendanceRecords: [
      {
        id: '001',
        studentId: '001',
        studentName: 'Ezequiel Arevalo',
        date: '2024-02-29',
        present: true
      }
    ],
    totalStudents: 1,
    presentStudents: 1
  },
];