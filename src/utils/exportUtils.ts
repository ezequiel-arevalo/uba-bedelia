import { utils, writeFile } from 'xlsx';
import { Student, StudentStatistics, ClassSession } from '../types';

export const exportStudentsToExcel = (students: Student[]) => {
  const worksheet = utils.json_to_sheet(students.map(student => ({
    'Nombre': student.firstName,
    'Apellido': student.lastName,
    'ID Estudiante': student.studentId,
    'Teléfono': student.phone,
    'DNI': student.dni,
    'Diplomatura': student.program
  })));

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Alumnos');
  writeFile(workbook, 'lista_alumnos.xlsx');
};

export const exportStatisticsToExcel = (statistics: StudentStatistics[]) => {
  const summaryData = statistics.map(stat => ({
    'Nombre': stat.student.firstName,
    'Apellido': stat.student.lastName,
    'ID Estudiante': stat.student.studentId,
    'DNI': stat.student.dni,
    'Diplomatura': stat.student.program,
    'Total Clases': stat.totalClasses,
    'Asistencias': stat.attendances,
    'Faltas': stat.absences,
    'Porcentaje Asistencia': `${stat.attendancePercentage.toFixed(1)}%`,
    'Estado': stat.status
  }));

  const workbook = utils.book_new();
  
  // Summary sheet
  const summarySheet = utils.json_to_sheet(summaryData);
  utils.book_append_sheet(workbook, summarySheet, 'Resumen');

  // Detailed attendance sheet
  const detailedData: any[] = [];
  statistics.forEach(stat => {
    stat.classDetails.forEach(detail => {
      detailedData.push({
        'Nombre': stat.student.firstName,
        'Apellido': stat.student.lastName,
        'ID Estudiante': stat.student.studentId,
        'Fecha': detail.date,
        'Presente': detail.present ? 'Sí' : 'No'
      });
    });
  });

  if (detailedData.length > 0) {
    const detailedSheet = utils.json_to_sheet(detailedData);
    utils.book_append_sheet(workbook, detailedSheet, 'Asistencia Detallada');
  }

  writeFile(workbook, 'estadisticas_asistencia.xlsx');
};

export const exportClassSessionToExcel = (classSession: ClassSession) => {
  const data = classSession.attendanceRecords.map(record => ({
    'Nombre': record.studentName,
    'Duración (min)': record.duration,
    'Presente': record.present ? 'Sí' : 'No'
  }));

  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Asistencia');
  
  const fileName = `asistencia_${classSession.date}.xlsx`;
  writeFile(workbook, fileName);
};