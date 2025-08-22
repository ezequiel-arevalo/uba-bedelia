/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils, writeFile } from 'xlsx';
import { ClassSession, Diplomatura, StudentWithAttendance } from '../types';

export interface ExportData {
  students: StudentWithAttendance[];
  classSessions: ClassSession[];
  diplomaturas: Diplomatura[];
}

export const exportToExcel = (data: ExportData) => {
  try {
    // Create workbook
    const workbook = utils.book_new();

    // 1. Students Sheet
    const studentsData = data.students.map(student => ({
      'ID Estudiante': student.idEstudiante,
      'Nombre': student.nombre,
      'Apellido': student.apellido,
      'Email': student.email,
      'Teléfono': student.telefono,
      'Diplomatura': student.diplomatura,
      'Clases Asistidas': student.attendedClasses,
      'Total Clases': student.totalClassesForDiplomatura,
      'Porcentaje Asistencia': `${student.attendancePercentage.toFixed(1)}%`,
      'Estado': student.aprobado ? 'Aprobado' : 'No Aprobado'
    }));

    const studentsSheet = utils.json_to_sheet(studentsData);
    utils.book_append_sheet(workbook, studentsSheet, 'Estudiantes');

    // 2. Diplomaturas Sheet
    const diplomaturasData = data.diplomaturas.map(diplomatura => {
      const studentCount = data.students.filter(s => s.diplomatura === diplomatura.name).length;
      const approvedCount = data.students.filter(s => s.diplomatura === diplomatura.name && s.aprobado).length;
      
      return {
        'Nombre': diplomatura.name,
        'Total Clases': diplomatura.totalClasses,
        'Clases Mínimas (75%)': Math.ceil(diplomatura.totalClasses * 0.75),
        'Estudiantes Inscriptos': studentCount,
        'Estudiantes Aprobados': approvedCount,
        'Tasa Aprobación': studentCount > 0 ? `${((approvedCount / studentCount) * 100).toFixed(1)}%` : '0%',
        'Fecha Creación': new Date(diplomatura.createdAt).toLocaleDateString()
      };
    });

    const diplomaturasSheet = utils.json_to_sheet(diplomaturasData);
    utils.book_append_sheet(workbook, diplomaturasSheet, 'Diplomaturas');

    // 3. Class Sessions Sheet
    const classSessionsData = data.classSessions.map(session => ({
      'Fecha': new Date(session.date).toLocaleDateString(),
      'Diplomatura': session.diplomatura,
      'Archivo': session.fileName,
      'Total Estudiantes': session.totalStudents,
      'Presentes': session.presentStudents,
      'Ausentes': session.totalStudents - session.presentStudents,
      'Porcentaje Asistencia': `${Math.round((session.presentStudents / session.totalStudents) * 100)}%`
    }));

    const classSessionsSheet = utils.json_to_sheet(classSessionsData);
    utils.book_append_sheet(workbook, classSessionsSheet, 'Clases');

    // 4. Detailed Attendance Sheet
    const attendanceData: any[] = [];
    
    data.classSessions.forEach(session => {
      session.attendanceRecords.forEach(record => {
        const student = data.students.find(s => 
          `${s.nombre} ${s.apellido}`.toLowerCase().trim() === record.studentName.toLowerCase().trim()
        );
        
        attendanceData.push({
          'Fecha': new Date(session.date).toLocaleDateString(),
          'Diplomatura': session.diplomatura,
          'Estudiante': record.studentName,
          'ID Estudiante': student?.idEstudiante || 'N/A',
          'Presente': record.present ? 'Sí' : 'No',
          'Archivo': session.fileName
        });
      });
    });

    if (attendanceData.length > 0) {
      const attendanceSheet = utils.json_to_sheet(attendanceData);
      utils.book_append_sheet(workbook, attendanceSheet, 'Asistencia Detallada');
    }

    // 5. Summary Sheet
    const totalStudents = data.students.length;
    const totalApproved = data.students.filter(s => s.aprobado).length;
    const totalDiplomaturas = data.diplomaturas.length;
    const totalClasses = data.classSessions.length;
    const averageAttendance = totalStudents > 0 
      ? data.students.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents 
      : 0;

    const summaryData = [
      { 'Métrica': 'Total Estudiantes', 'Valor': totalStudents },
      { 'Métrica': 'Estudiantes Aprobados', 'Valor': totalApproved },
      { 'Métrica': 'Estudiantes No Aprobados', 'Valor': totalStudents - totalApproved },
      { 'Métrica': 'Tasa de Aprobación', 'Valor': totalStudents > 0 ? `${((totalApproved / totalStudents) * 100).toFixed(1)}%` : '0%' },
      { 'Métrica': 'Promedio de Asistencia', 'Valor': `${averageAttendance.toFixed(1)}%` },
      { 'Métrica': 'Total Diplomaturas', 'Valor': totalDiplomaturas },
      { 'Métrica': 'Total Clases Registradas', 'Valor': totalClasses },
      { 'Métrica': 'Fecha de Exportación', 'Valor': new Date().toLocaleString() }
    ];

    const summarySheet = utils.json_to_sheet(summaryData);
    utils.book_append_sheet(workbook, summarySheet, 'Resumen');

    // Generate filename with timestamp
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0 a 11
    const year = now.getFullYear();

    const timestamp = `${day}-${month}-${year}`;
    const filename = `Backup-${timestamp}.xlsx`;

    // Save file
    writeFile(workbook, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al exportar' 
    };
  }
};