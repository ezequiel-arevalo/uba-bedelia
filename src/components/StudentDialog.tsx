import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '../types';
import { DIPLOMATURAS } from '../lib/mockData';

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
  onSave: (student: Omit<Student, 'id'> & { attendanceRate?: number }) => void;
}

export function StudentDialog({ open, onOpenChange, student, onSave }: StudentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    diplomatura: '',
    status: 'aprobado' as Student['status'],
    totalClasses: 0,
    attendedClasses: 0,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        diplomatura: student.diplomatura,
        status: student.status,
        totalClasses: student.totalClasses,
        attendedClasses: student.attendedClasses,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        diplomatura: '',
        status: 'aprobado',
        totalClasses: 0,
        attendedClasses: 0,
      });
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attendanceRate = formData.totalClasses > 0 
      ? (formData.attendedClasses / formData.totalClasses) * 100 
      : 0;

    const calculatedStatus: Student['status'] = attendanceRate >= 75 ? 'aprobado' : 'desaprobado';
    
    onSave({
      ...formData,
      status: calculatedStatus,
      attendanceRate,
    });
    onOpenChange(false);
  };

  const attendancePercentage = formData.totalClasses > 0
    ? (formData.attendedClasses / formData.totalClasses) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:border [&>button]:border-input [&>button]:bg-transparent [&>button]:hover:bg-accent [&>button]:hover:text-accent-foreground [&>button]:rounded-md [&>button]:p-2">
        <DialogHeader>
          <DialogTitle>{student ? 'Editar Estudiante' : 'Nuevo Estudiante'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diplomatura">Diplomatura</Label>
            <Select
              value={formData.diplomatura}
              onValueChange={(value) => setFormData({ ...formData, diplomatura: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar diplomatura" />
              </SelectTrigger>
              <SelectContent>
                {DIPLOMATURAS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attendance / Status Section */}
          <div className="space-y-2">
            <Label>Estado (Calculado automáticamente)</Label>
            <div className="p-3 bg-muted rounded-md">
              <span className={`font-medium ${
                attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.totalClasses > 0
                  ? (attendancePercentage >= 75 ? 'Aprobado' : 'Desaprobado')
                  : 'Sin datos'
                }
                {formData.totalClasses > 0 && ` (${attendancePercentage.toFixed(1)}%)`}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Se requiere 75% de asistencia para aprobar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalClasses">Clases totales</Label>
              <Input
                id="totalClasses"
                type="number"
                min="0"
                value={formData.totalClasses}
                onChange={(e) => setFormData({ ...formData, totalClasses: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendedClasses">Clases asistidas</Label>
              <Input
                id="attendedClasses"
                type="number"
                min="0"
                max={formData.totalClasses}
                value={formData.attendedClasses}
                onChange={(e) => setFormData({ ...formData, attendedClasses: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{student ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
