import React, { useState } from 'react';
import { Plus, Download, Edit3, Trash2, Search } from 'lucide-react';
import { Student } from '../types';
import { exportStudentsToExcel } from '../utils/exportUtils';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    phone: '',
    dni: '',
    program: ''
  });

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.dni.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    } else {
      onAddStudent(formData);
    }
    setFormData({
      firstName: '',
      lastName: '',
      studentId: '',
      phone: '',
      dni: '',
      program: ''
    });
    setShowForm(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      phone: student.phone,
      dni: student.dni,
      program: student.program
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      studentId: '',
      phone: '',
      dni: '',
      program: ''
    });
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Gestión de Alumnos</h3>
            <div>
              <button
                className="btn btn-success me-2"
                onClick={() => exportStudentsToExcel(students)}
                disabled={students.length === 0}
              >
                <Download size={16} className="me-1" />
                Exportar
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} className="me-1" />
                Agregar Alumno
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  {editingStudent ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellido *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ID Estudiante *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.studentId}
                        onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">DNI *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dni}
                        onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Diplomatura *</label>
                      <select
                        className="form-select"
                        value={formData.program}
                        onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                        required
                      >
                        <option value="">Seleccionar diplomatura...</option>
                        <option value="Tango">Tango</option>
                        <option value="Oratoria y Marketing Personal">Oratoria y Marketing Personal</option>
                        <option value="Estrategia y Planificación Empresarial para PyMES">Estrategia y Planificación Empresarial para PyMES</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingStudent ? 'Actualizar' : 'Agregar'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, ID o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <p className="mb-0 text-muted">
            Total: {filteredStudents.length} alumno{filteredStudents.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          {filteredStudents.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted mb-0">
                  {searchTerm ? 'No se encontraron alumnos que coincidan con la búsqueda' : 'No hay alumnos registrados'}
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>ID Estudiante</th>
                      <th>DNI</th>
                      <th>Teléfono</th>
                      <th>Diplomatura</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.studentId}</td>
                        <td>{student.dni}</td>
                        <td>{student.phone || '-'}</td>
                        <td>{student.program}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDeleteStudent(student.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};