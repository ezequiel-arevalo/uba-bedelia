import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  GraduationCap, 
  Edit, 
  Trash2, 
  Search,
  Users,
  BookOpen
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DiplomaturaModal } from './DiplomaturaModal';
import { Diplomatura } from '../types';

interface DiplomaturaManagementProps {
  diplomaturas: Diplomatura[];
  onAddDiplomatura: (diplomatura: Omit<Diplomatura, 'id' | 'createdAt'>) => void;
  onUpdateDiplomatura: (id: string, diplomatura: Omit<Diplomatura, 'id' | 'createdAt'>) => void;
  onDeleteDiplomatura: (id: string) => void;
  getStudentCountByDiplomatura: (diplomaturaName: string) => number;
}

export function DiplomaturaManagement({
  diplomaturas,
  onAddDiplomatura,
  onUpdateDiplomatura,
  onDeleteDiplomatura,
  getStudentCountByDiplomatura
}: DiplomaturaManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiplomatura, setEditingDiplomatura] = useState<Diplomatura | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDiplomatura, setDeletingDiplomatura] = useState<Diplomatura | null>(null);

  const filteredDiplomaturas = diplomaturas.filter(diplomatura =>
    diplomatura.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      setDeletingDiplomatura(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = (diplomaturaData: Omit<Diplomatura, 'id' | 'createdAt'>) => {
    if (editingDiplomatura) {
      onUpdateDiplomatura(editingDiplomatura.id, diplomaturaData);
    } else {
      onAddDiplomatura(diplomaturaData);
    }
    setEditingDiplomatura(undefined);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingDiplomatura(undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Gestión de Diplomaturas</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Administra las diplomaturas y sus configuraciones de clases
                </p>
              </div>
            </div>
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Diplomatura
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar diplomaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

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

      {/* Modals */}
      <DiplomaturaModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        diplomatura={editingDiplomatura}
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
    </div>
  );
}