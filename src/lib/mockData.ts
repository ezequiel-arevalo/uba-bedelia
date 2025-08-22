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
    email: 'maria.gonzalez@email.com',
    diplomatura: 'TANGO',
    idEstudiante: 'EST001'
  },
];

export const mockClassSessions: ClassSession[] = [
  {
    id: 'class-1',
    date: '2024-01-15',
    fileName: 'tango_15_01_24.csv',
    diplomatura: 'TANGO',
    attendanceRecords: [
      {
        id: 'att-1',
        studentId: '1',
        studentName: 'maría gonzález',
        date: '2024-01-15',
        present: true
      },
      {
        id: 'att-2',
        studentId: '4',
        studentName: 'luis fernández',
        date: '2024-01-15',
        present: true
      }
    ],
    totalStudents: 2,
    presentStudents: 2
  },
  {
    id: 'class-2',
    date: '2024-01-18',
    fileName: 'folklore_18_01_24.csv',
    diplomatura: 'TANGO',
    attendanceRecords: [
      {
        id: 'att-3',
        studentId: '2',
        studentName: 'carlos rodríguez',
        date: '2024-01-18',
        present: true
      }
    ],
    totalStudents: 1,
    presentStudents: 1
  }
];