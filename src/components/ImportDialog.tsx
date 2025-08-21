import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { processAttendanceFile } from '../lib/csvProcessor';
import { ClassSession } from '../types';
import { DIPLOMATURAS } from '../lib/mockData';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (classSession: ClassSession) => void;
}

export function ImportDialog({ open, onOpenChange, onImportSuccess }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [diplomatura, setDiplomatura] = useState('');
  const [classDate, setClassDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      
      // Try to extract date from filename
      const extractedDate = extractDateFromFilename(selectedFile.name);
      if (extractedDate) {
        setClassDate(extractedDate);
      }
    }
  };

  const extractDateFromFilename = (filename: string): string => {
    // Try different date patterns
    const patterns = [
      /(\d{2}[-_]\d{2}[-_]\d{2})/,  // dd-mm-yy or dd_mm_yy
      /(\d{4}[-_]\d{2}[-_]\d{2})/,  // yyyy-mm-dd or yyyy_mm_dd
      /(\d{2}[-_]\d{2}[-_]\d{4})/   // dd-mm-yyyy or dd_mm_yyyy
    ];

    for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (match) {
        const dateStr = match[1];
        const parts = dateStr.split(/[-_]/);
        
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // yyyy-mm-dd format
            return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else if (parts[2].length === 4) {
            // dd-mm-yyyy format
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          } else {
            // dd-mm-yy format (assume 20xx)
            return `20${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      }
    }

    // Default to today's date
    return new Date().toISOString().split('T')[0];
  };

  const handleImport = async () => {
    if (!file || !diplomatura || !classDate) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const classSession = await processAttendanceFile(file, diplomatura);
      // Override the date with the manually selected one
      classSession.date = classDate;
      
      onImportSuccess(classSession);
      onOpenChange(false);
      setFile(null);
      setDiplomatura('');
      setClassDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFile(null);
    setDiplomatura('');
    setClassDate('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:border [&>button]:border-input [&>button]:bg-transparent [&>button]:hover:bg-accent [&>button]:hover:text-accent-foreground [&>button]:rounded-md [&>button]:p-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Asistencia de Clase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diplomatura">Diplomatura *</Label>
            <Select value={diplomatura} onValueChange={setDiplomatura}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar diplomatura" />
              </SelectTrigger>
              <SelectContent>
                {DIPLOMATURAS.map((dip) => (
                  <SelectItem key={dip} value={dip}>
                    {dip}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="classDate">Fecha de la Clase *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="classDate"
                type="date"
                value={classDate}
                onChange={(e) => setClassDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Archivo CSV/Excel *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Formato del archivo CSV:</p>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li>• La primera columna debe contener "Nombre completo"</li>
              <li>• Cada fila representa un estudiante presente</li>
              <li>• Si el nombre del estudiante aparece en el archivo, se marca como presente</li>
              <li>• Si no aparece, se marca como ausente</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Importante:</strong> Los nombres deben coincidir exactamente con los registrados en el sistema.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || !diplomatura || !classDate || loading}
            >
              {loading ? 'Procesando...' : 'Importar Asistencia'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}