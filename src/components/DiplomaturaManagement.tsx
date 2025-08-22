import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, GraduationCap, Edit, Trash2, Search, Users, BookOpen, Download, FileText, Calendar, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { DiplomaturaModal } from './DiplomaturaModal';
import { Diplomatura, ClassSession } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface DiplomaturaManagementProps {
  diplomaturas: Diplomatura[];
  classSessions: ClassSession[];
  onAddDiplomatura: (diplomatura: Omit<Diplomatura, 'id' | 'createdAt'>) => void;
  onUpdateDiplomatura: (id: string, diplomatura: Omit<Diplomatura, 'id' | 'createdAt'>) => void;
  onDeleteDiplomatura: (id: string) => void;
  onDeleteClassSession: (id: string) => void;
  getStudentCountByDiplomatura: (diplomaturaName: string) => number;
  onExportData: () => void;
}

export function DiplomaturaManagement({
  diplomaturas,
  classSessions,
  onAddDiplomatura,
  onUpdateDiplomatura,
  onDeleteDiplomatura,
  onDeleteClassSession,
  getStudentCountByDiplomatura,
  onExportData
}: DiplomaturaManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiplomatura, setEditingDiplomatura] = useState<Diplomatura | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDiplomatura, setDeletingDiplomatura] = useState<Diplomatura | null>(null);
  const [deleteSessionDialogOpen, setDeleteSessionDialogOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState<ClassSession | null>(null);

  const filteredDiplomaturas = diplomaturas.filter(diplomatura =>
    diplomatura.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClassSessions = classSessions.filter(session =>
    session.diplomatura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (diplomatura: Diplomatura) => {
    setEditingDiplomatura(diplomatura);
    setModalOpen(true);
  };

  const handleDelete = (diplomatura: Diplomatura) => {
    setDeletingDiplomatura(diplomatura);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingDiplomatura) {
      onDeleteDiplomatura(deletingDiplomatura.id);
      toast.success(`Diplomatura "${deletingDiplomatura.name}" eliminada correctamente`);
      setDeletingDiplomatura(null);
      setDeleteDialogOpen(false);
    }
  };

  const confirmDeleteSession = () => {
    if (deletingSession) {
      onDeleteClassSession(deletingSession.id);
      toast.success(`Archivo "${deletingSession.fileName}" eliminado correctamente`);
      setDeletingSession(null);
      setDeleteSessionDialogOpen(false);
    }
  };

  const handleSave = (diplomaturaData: Omit<Diplomatura, 'id' | 'createdAt'>) => {
    if (editingDiplomatura) {
      onUpdateDiplomatura(editingDiplomatura.id, diplomaturaData);
      toast.success(`Diplomatura "${diplomaturaData.name}" actualizada correctamente`);
    } else {
      onAddDiplomatura(diplomaturaData);
      toast.success(`Diplomatura "${diplomaturaData.name}" creada correctamente`);
    }
    setEditingDiplomatura(undefined);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingDiplomatura(undefined);
    }
  };

  const handleDeleteSession = (session: ClassSession) => {
    setDeletingSession(session);
    setDeleteSessionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Export */}
      <Card>
        <CardContent className="pt-6 flex flex-row justify-between items-center">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar diplomaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={onExportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Diplomatura
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="diplomaturas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diplomaturas" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Diplomaturas
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <FileText className="h-4 w-4" />
            Archivos Subidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diplomaturas">
          {/* Diplomaturas Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDiplomaturas.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron diplomaturas' : 'No hay diplomaturas registradas'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Comienza creando tu primera diplomatura'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Primera Diplomatura
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDiplomaturas.map((diplomatura) => {
            const studentCount = getStudentCountByDiplomatura(diplomatura.name);
            const minClassesRequired = Math.ceil(diplomatura.totalClasses * 0.75);
            
            return (
              <Card key={diplomatura.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{diplomatura.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Creada el {new Date(diplomatura.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(diplomatura)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(diplomatura)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {diplomatura.totalClasses}
                      </div>
                      <div className="text-sm text-blue-600">Total Clases</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {minClassesRequired}
                      </div>
                      <div className="text-sm text-green-600">Mín. Aprobar</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {studentCount} estudiante{studentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      75% requerido
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
          </div>
        </TabsContent>

        <TabsContent value="files">
          {/* Class Sessions Files */}
          <div className="space-y-4">
            {filteredClassSessions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? 'No se encontraron archivos' : 'No hay archivos subidos'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? 'Intenta con otros términos de búsqueda'
                        : 'Los archivos de asistencia aparecerán aquí una vez que los subas'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredClassSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{session.fileName}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            <Badge variant="outline">{session.diplomatura}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {session.presentStudents}/{session.totalStudents} presentes
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((session.presentStudents / session.totalStudents) * 100)}% asistencia
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSession(session)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DiplomaturaModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        diplomatura={editingDiplomatura}
        existingNames={diplomaturas.map(d => d.name)}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Eliminar Diplomatura
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  ¿Estás seguro de que deseas eliminar la diplomatura <strong>{deletingDiplomatura?.name}</strong>?
                </p>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Esta acción eliminará:
                  </p>
                  <ul className="text-sm text-destructive mt-1 ml-4 list-disc">
                    <li>La configuración de la diplomatura</li>
                    <li>Todos los estudiantes asociados</li>
                    <li>Todos los registros de asistencia</li>
                  </ul>
                  <p className="text-sm text-destructive mt-2 font-medium">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Diplomatura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteSessionDialogOpen} onOpenChange={setDeleteSessionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <X className="h-5 w-5" />
              Eliminar Archivo de Asistencia
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  ¿Estás seguro de que deseas eliminar el archivo <strong>{deletingSession?.fileName}</strong>?
                </p>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Esta acción eliminará:
                  </p>
                  <ul className="text-sm text-destructive mt-1 ml-4 list-disc">
                    <li>El archivo de asistencia</li>
                    <li>Todos los registros de asistencia de esa clase</li>
                  </ul>
                  <p className="text-sm text-destructive mt-2 font-medium">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSession}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Archivo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}