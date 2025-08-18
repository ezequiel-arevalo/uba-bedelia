import { useState } from 'react';
import { Users, Upload, BarChart3, FileSpreadsheet } from 'lucide-react';
import { Student, ClassSession } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceUpload } from './components/AttendanceUpload';
import { StatisticsDashboard } from './components/StatisticsDashboard';

type ActiveTab = 'students' | 'upload' | 'statistics';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('students');
  const [students, setStudents] = useLocalStorage<Student[]>('attendance-students', []);
  const [classSessions, setClassSessions] = useLocalStorage<ClassSession[]>('attendance-classes', []);

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdateStudent = (id: string, studentData: Omit<Student, 'id'>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...studentData, id } : student
    ));
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  const handleClassSessionAdded = (classSession: ClassSession) => {
    setClassSessions(prev => [...prev, classSession]);
  };

  const tabs = [
    { id: 'students' as const, label: 'Alumnos', icon: Users, count: students.length },
    { id: 'upload' as const, label: 'Cargar Asistencia', icon: Upload, count: classSessions.length },
    { id: 'statistics' as const, label: 'Estadísticas', icon: BarChart3, count: null },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <StudentManagement
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'upload':
        return (
          <AttendanceUpload
            onClassSessionAdded={handleClassSessionAdded}
            existingClasses={classSessions}
          />
        );
      case 'statistics':
        return (
          <StatisticsDashboard
            students={students}
            classSessions={classSessions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <FileSpreadsheet size={24} className="me-2" />
            Sistema de Asistencia Teams
          </a>
          <div className="navbar-text text-light d-none d-md-block">
            Gestión de Asistencia para Clases Virtuales
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="container-fluid">
          <ul className="nav nav-tabs border-0 pt-3">
            {tabs.map(tab => (
              <li key={tab.id} className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={16} className="me-2" />
                  {tab.label}
                  {tab.count !== null && (
                    <span className="badge bg-secondary ms-2">{tab.count}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-4 min-vh-100">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-top mt-auto py-3">
        <div className="container-fluid">
          <div className="text-center text-muted small">
            Sistema de Gestión de Asistencia Microsoft Teams - 
            Todos los datos se almacenan localmente en tu navegador
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;