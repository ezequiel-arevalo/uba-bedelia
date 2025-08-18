import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Calendar, Users, CheckCircle } from 'lucide-react';
import { ClassSession } from '../types';
import { processTeamsFile } from '../utils/attendanceProcessor';

interface AttendanceUploadProps {
  onClassSessionAdded: (classSession: ClassSession) => void;
  existingClasses: ClassSession[];
}

export const AttendanceUpload: React.FC<AttendanceUploadProps> = ({
  onClassSessionAdded,
  existingClasses
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Por favor selecciona un archivo CSV o Excel (.xlsx, .xls)');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const classSession = await processTeamsFile(file);
      
      // Check if this date already exists
      const existingClass = existingClasses.find(cls => cls.date === classSession.date);
      if (existingClass) {
        setError(`Ya existe una clase registrada para la fecha ${classSession.date}`);
        setIsProcessing(false);
        return;
      }

      onClassSessionAdded(classSession);
      setSuccess(
        `Clase del ${classSession.date} procesada exitosamente. ` +
        `${classSession.presentStudents} de ${classSession.totalStudents} estudiantes presentes.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el archivo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h3 className="mb-0">Cargar Asistencia de Teams</h3>
          <p className="text-muted mb-0">
            Sube archivos CSV o Excel exportados desde Microsoft Teams
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible" role="alert">
          <CheckCircle size={16} className="me-2" />
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div
                className={`border-2 border-dashed rounded p-5 text-center ${
                  dragActive ? 'border-primary bg-light' : 'border-secondary'
                } ${isProcessing ? 'opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isProcessing ? (
                  <div>
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Procesando...</span>
                    </div>
                    <p className="mb-0">Procesando archivo...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="text-secondary mb-3" />
                    <h5>Arrastra tu archivo aquí o haz clic para seleccionar</h5>
                    <p className="text-muted mb-3">
                      Formatos soportados: CSV, Excel (.xlsx, .xls)
                    </p>
                    <input
                      type="file"
                      className="form-control d-none"
                      id="fileInput"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    <label htmlFor="fileInput" className="btn btn-primary">
                      <FileSpreadsheet size={16} className="me-2" />
                      Seleccionar Archivo
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Información del Archivo</h6>
            </div>
            <div className="card-body">
              <div className="text-muted">
                <p className="mb-2">
                  <strong>Formato esperado:</strong><br/>
                  El archivo debe contener las columnas:
                </p>
                <ul className="small">
                  <li>Nombre (First Name)</li>
                  <li>Apellido (Last Name)</li>
                  <li>Duración de conexión</li>
                </ul>
                <p className="mb-2">
                  <strong>Criterio de asistencia:</strong><br/>
                  Se considera presente si estuvo conectado al menos 1 minuto.
                </p>
                <p className="mb-0">
                  <strong>Extracción de fecha:</strong><br/>
                  Se intentará extraer la fecha del nombre del archivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {existingClasses.length > 0 && (
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Clases Registradas ({existingClasses.length})</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {existingClasses.map(classSession => (
                    <div key={classSession.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card border-left-primary">
                        <div className="card-body py-3">
                          <div className="d-flex align-items-center">
                            <Calendar size={20} className="text-primary me-3" />
                            <div>
                              <div className="fw-bold">{classSession.date}</div>
                              <small className="text-muted">
                                <Users size={14} className="me-1" />
                                {classSession.presentStudents}/{classSession.totalStudents} presentes
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};