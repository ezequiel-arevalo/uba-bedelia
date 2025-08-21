import { read, utils } from 'xlsx';
import { AttendanceRecord, ClassSession } from '../types';

export const processTeamsFile = async (file: File): Promise<ClassSession> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let workbook;
        
        if (file.name.toLowerCase().endsWith('.csv')) {
          // Para archivos CSV, leemos como texto
          const text = e.target?.result as string;
          workbook = read(text, { type: 'string' });
        } else {
          // Para archivos Excel, leemos como ArrayBuffer
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          workbook = read(data, { type: 'array' });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertimos a JSON (array de arrays) 
        const jsonData: any[] = utils.sheet_to_json(worksheet, { header: 1 });

        // Verificar que A1 contenga "Nombre completo"
        if (!jsonData[0] || jsonData[0][0] !== 'Nombre completo') {
          throw new Error('El archivo debe tener "Nombre completo" en la celda A1');
        }

        const attendanceRecords: AttendanceRecord[] = [];
        const processedNames = new Set<string>();

        // Procesar desde la fila 2 (índice 1) en adelante
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0 || !row[0]) continue;

          const name = row[0].toString().trim().toLowerCase();
          if (!name || processedNames.has(name)) continue;

          processedNames.add(name);

          // Si el nombre aparece en la columna A, significa que se conectó (presente)
          // La duración no importa, solo el hecho de que aparezca en la lista

          attendanceRecords.push({
            id: `${i}`,
            studentName: name,
            duration: 1, // Valor simbólico ya que no importa la duración
            present: true, // Si aparece en la lista, está presente
          });
        }

        const extractedDate =
          extractDateFromFilename(file.name) || new Date().toISOString().split('T')[0];

        const presentStudents = attendanceRecords.filter((r) => r.present).length;

        const classSession: ClassSession = {
          id: `class-${Date.now()}`,
          date: extractedDate,
          fileName: file.name,
          attendanceRecords,
          totalStudents: attendanceRecords.length,
          presentStudents,
        };

        resolve(classSession);
      } catch (error) {
        console.error('Error processing file:', error);
        reject(
          new Error(
            `Error procesando el archivo: ${
              error instanceof Error ? error.message : 'Error desconocido'
            }`
          )
        );
      }
    };

    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    // Leer según el tipo de archivo
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file, 'utf-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

// Helpers
const parseDuration = (duration: string): number => {
  if (!duration) return 0;
  let totalMinutes = 0;

  const hoursMatch = duration.match(/(\d+)h/);
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;

  const minutesMatch = duration.match(/(\d+)m/);
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);

  const secondsMatch = duration.match(/(\d+)s/);
  if (secondsMatch && !minutesMatch && !hoursMatch) {
    const seconds = parseInt(secondsMatch[1], 10);
    totalMinutes = seconds >= 30 ? 1 : 0;
  }

  return totalMinutes;
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
