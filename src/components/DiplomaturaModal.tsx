import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Hash } from 'lucide-react';
import { Diplomatura } from '../types';

interface DiplomaturaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diplomatura?: Diplomatura;
  existingNames: string[];
  onSave: (diplomatura: Omit<Diplomatura, 'id' | 'createdAt'>) => void;
}

export function DiplomaturaModal({ open, onOpenChange, diplomatura, existingNames, onSave }: DiplomaturaModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    totalClasses: 20,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (diplomatura) {
      setFormData({
        name: diplomatura.name,
        totalClasses: diplomatura.totalClasses,
      });
    } else {
      setFormData({
        name: '',
        totalClasses: 20,
      });
    }
    setErrors({});
  }, [diplomatura, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre de la diplomatura es requerido';
    
    // Check for duplicate names (excluding current diplomatura when editing)
    const isDuplicate = existingNames.some(name => 
      name.toLowerCase() === formData.name.trim().toLowerCase() && 
      (!diplomatura || name !== diplomatura.name)
    );
    if (isDuplicate) newErrors.name = 'Ya existe una diplomatura con este nombre';
    
    if (formData.totalClasses < 1) newErrors.totalClasses = 'El número de clases debe ser mayor a 0';
    if (formData.totalClasses > 100) newErrors.totalClasses = 'El número de clases no puede ser mayor a 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave({ ...formData, name: formData.name.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:border [&>button]:border-input [&>button]:bg-transparent [&>button]:hover:bg-accent [&>button]:hover:text-accent-foreground [&>button]:rounded-md [&>button]:p-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5" />
            {diplomatura ? 'Editar Diplomatura' : 'Crear Nueva Diplomatura'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Diplomatura *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="Ej: TANGO, FOLKLORE, JAZZ"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalClasses">Número Total de Clases *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="totalClasses"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.totalClasses}
                      onChange={(e) => setFormData({ ...formData, totalClasses: parseInt(e.target.value) || 0 })}
                      className={`pl-10 ${errors.totalClasses ? 'border-red-500' : ''}`}
                      placeholder="20"
                    />
                  </div>
                  {errors.totalClasses && <p className="text-sm text-red-500">{errors.totalClasses}</p>}
                  <p className="text-sm text-muted-foreground">
                    Los estudiantes necesitarán asistir al 75% de estas clases para aprobar
                    ({Math.ceil(formData.totalClasses * 0.75)} clases mínimas)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Una vez creada la diplomatura, podrás subir archivos CSV 
              de asistencia para cada clase. Los estudiantes que aparezcan en el archivo 
              serán marcados como presentes automáticamente.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {diplomatura ? 'Actualizar Diplomatura' : 'Crear Diplomatura'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}