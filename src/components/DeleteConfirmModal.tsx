import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Student } from '../types';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ 
  open, 
  onOpenChange, 
  student, 
  onConfirm 
}: DeleteConfirmModalProps) {
  if (!student) return null;

  return (
    <AlertDialog aria-describedby={undefined} open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                ¿Estás seguro de que deseas eliminar al siguiente estudiante? 
                Esta acción no se puede deshacer.
              </p>
              
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Nombre:</span>
                  <span>{student.nombre} {student.apellido}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ID:</span>
                  <Badge variant="outline">{student.idEstudiante}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Diplomatura:</span>
                  <Badge variant="secondary">{student.diplomatura}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estado:</span>
                  <Badge variant={student.aprobado ? "default" : "destructive"}>
                    {student.aprobado ? 'Aprobado' : 'No Aprobado'}
                  </Badge>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar Estudiante
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}