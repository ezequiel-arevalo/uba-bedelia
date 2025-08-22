/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Plus, Upload, GraduationCap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from './components/StatsCards';
import { FiltersBar } from './components/FiltersBar';
import { StudentsTable } from './components/StudentsTable';
import { StudentModal } from './components/StudentModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ImportDialog } from './components/ImportDialog';
import { DiplomaturaManagement } from './components/DiplomaturaManagement';
import { Pagination } from './components/Pagination';
import { useStudentData } from './hooks/useStudentData';
import { exportToExcel } from './lib/excelExporter';
import { Student, Filters, StudentWithAttendance } from './types';
import { toast } from 'sonner';

function App() {
  const { 
    diplomaturas, 
    classSessions, 
    sortConfig, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    addClassSession, 
    deleteClassSession, 
    addDiplomatura, 
    updateDiplomatura, 
    deleteDiplomatura, 
    getStudentCountByDiplomatura, 
    getFilteredAndSortedStudents, 
    getStats, 
    handleSort 
  } = useStudentData();

  const [filters, setFilters] = useState<Filters>({
    diplomatura: 'all',
    aprobado: 'all',
    search: '',
  });

  const [currentTab, setCurrentTab] = useState("students"); // 👈 nuevo estado
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentWithAttendance | undefined>();
  const [deletingStudent, setDeletingStudent] = useState<StudentWithAttendance | null>(null);

  const filteredStudents = getFilteredAndSortedStudents(filters);
  const stats = getStats(filters);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ diplomatura: 'all', aprobado: 'all', search: '' });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleEditStudent = (student: StudentWithAttendance) => {
    setEditingStudent(student);
    setStudentModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (student) {
      setDeletingStudent(student);
      setDeleteModalOpen(true);
    }
  };

  const confirmDeleteStudent = () => {
    if (deletingStudent) {
      deleteStudent(deletingStudent.id);
      toast.success(`Estudiante ${deletingStudent.nombre} ${deletingStudent.apellido} eliminado correctamente`);
      setDeletingStudent(null);
      setDeleteModalOpen(false);
    }
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
      toast.success('Estudiante actualizado correctamente');
    } else {
      addStudent(studentData);
      toast.success('Estudiante agregado correctamente');
    }
    setEditingStudent(undefined);
  };

  const handleStudentModalClose = (open: boolean) => {
    setStudentModalOpen(open);
    if (!open) {
      setEditingStudent(undefined);
    }
  };

  const handleImportSuccess = (classSession: any) => {
    addClassSession(classSession);
    toast.success(`Asistencia importada: ${classSession.presentStudents} estudiantes presentes`);
  };

  const handleExportData = () => {
    const studentsWithAttendance = getFilteredAndSortedStudents({ diplomatura: 'all', aprobado: 'all', search: '' });
    const result = exportToExcel({
      students: studentsWithAttendance,
      classSessions,
      diplomaturas
    });
    
    if (result.success) {
      toast.success(`Datos exportados correctamente: ${result.filename}`);
    } else {
      toast.error(`Error al exportar: ${result.error}`);
    }
  };

  // 👇 Config de header según tab activo
  const headerConfig = {
    students: {
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      title: "Sistema de Gestión de Alumnos",
      subtitle: "Gestión integral de estudiantes y control de asistencia",
      bg: "from-blue-500 to-blue-600",
    },
    diplomaturas: {
      icon: <Settings className="h-8 w-8 text-white" />,
      title: "Gestión de Diplomaturas",
      subtitle: "Administra las diplomaturas y sus configuraciones de clases",
      bg: "from-purple-500 to-purple-600",
    }
  };

  const { icon, title, subtitle, bg } = headerConfig[currentTab as keyof typeof headerConfig];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
          {/* Header dinámico */}
          <Card className="p-6 bg-white shadow-sm border-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-gradient-to-br ${bg} rounded-xl shadow-lg`}>
                  {icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="students" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Estudiantes
                  </TabsTrigger>
                  <TabsTrigger value="diplomaturas" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Diplomaturas
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </Card>

          {/* Contenido estudiantes */}
          <TabsContent value="students" className="space-y-8">
            <Card className="p-4">
              <div className="flex gap-3 justify-end">
                <Button onClick={() => setImportDialogOpen(true)} variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importar CSV
                </Button>
                <Button onClick={() => setStudentModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Alumno
                </Button>
              </div>
            </Card>

            <StatsCards stats={stats} />

            <FiltersBar
              filters={filters}
              diplomaturas={diplomaturas}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            <StudentsTable
              students={paginatedStudents}
              sortConfig={sortConfig}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onSort={handleSort}
            />

            {filteredStudents.length > 0 && (
              <Card className="p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredStudents.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={handlePageSizeChange}
                />
              </Card>
            )}
          </TabsContent>

          {/* Contenido diplomaturas */}
          <TabsContent value="diplomaturas">
            <DiplomaturaManagement
              diplomaturas={diplomaturas}
              classSessions={classSessions}
              onAddDiplomatura={addDiplomatura}
              onUpdateDiplomatura={updateDiplomatura}
              onDeleteDiplomatura={deleteDiplomatura}
              onDeleteClassSession={deleteClassSession}
              getStudentCountByDiplomatura={getStudentCountByDiplomatura}
              onExportData={handleExportData}
            />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <StudentModal
          open={studentModalOpen}
          onOpenChange={handleStudentModalClose}
          student={editingStudent}
          diplomaturas={diplomaturas}
          onSave={handleSaveStudent}
        />

        <DeleteConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          student={deletingStudent}
          onConfirm={confirmDeleteStudent}
        />

        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          diplomaturas={diplomaturas}
          onImportSuccess={handleImportSuccess}
        />
      </div>
    </div>
  );
}

export default App;