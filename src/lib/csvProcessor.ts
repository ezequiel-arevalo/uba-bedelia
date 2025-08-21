import { read, utils } from 'xlsx';
import { AttendanceRecord, ClassSession } from '../types';

export const processAttendanceFile = async (file: File, diplomatura: string): Promise<ClassSession> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let workbook;
        
        if (file.name.toLowerCase().endsWith('.csv')) {
          const text = e.target?.result as string;
          workbook = read(text, { type: 'string' });
        } else {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          workbook = read(data, { type: 'array' });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData[0] || jsonData[0][0] !== 'Nombre completo') {
          throw new Error('El archivo debe tener "Nombre completo" en la celda A1');
        }

        const attendanceRecords: AttendanceRecord[] = [];
        const processedNames = new Set<string>();

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0 || !row[0]) continue;

          const name = row[0].toString().trim();
          const normalizedName = name.toLowerCase();
          
          if (!name || processedNames.has(normalizedName)) continue;
          processedNames.add(normalizedName);

          attendanceRecords.push({
            id: `att-${Date.now()}-${i}`,
            studentId: `student-${i}`,
            studentName: name,
            date: new Date().toISOString().split('T')[0],
            present: true,
            duration: 1,
          });
        }

        const extractedDate = extractDateFromFilename(file.name) || new Date().toISOString().split('T')[0];
        const presentStudents = attendanceRecords.filter((r) => r.present).length;

        const classSession: ClassSession = {
          id: `class-${Date.now()}`,
          date: extractedDate,
          fileName: file.name,
          diplomatura,
          attendanceRecords,
          totalStudents: attendanceRecords.length,
          presentStudents,
        };

        resolve(classSession);
      } catch (error) {
        console.error('Error processing file:', error);
        reject(new Error(`Error procesando el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`));
      }
    };

    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file, 'utf-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

const extractDateFromFilename = (filename: string): string | null => {
  const dateMatch = filename.match(/(\d{2}[-_]\d{2}[-_]\d{2})/);
  if (dateMatch) {
    const [day, month, year] = dateMatch[1].split(/[-_]/);
    return `20${year}-${month}-${day}`;
  }

  const dateMatch2 = filename.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
  if (dateMatch2) return dateMatch2[1].replace(/_/g, '-');

  const dateMatch3 = filename.match(/(\d{2}[-_]\d{2}[-_]\d{4})/);
  if (dateMatch3) {
    const [day, month, year] = dateMatch3[1].split(/[-_]/);
    return `${year}-${month}-${day}`;
  }

  return null;
};