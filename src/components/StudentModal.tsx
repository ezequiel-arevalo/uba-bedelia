import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, GraduationCap } from 'lucide-react';
import { Student, Diplomatura } from '../types';

interface StudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
  diplomaturas: Diplomatura[];
  onSave: (student: Omit<Student, 'id'>) => void;
}

export function StudentModal({ open, onOpenChange, student, diplomaturas, onSave }: StudentModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    diplomatura: '',
    idEstudiante: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        nombre: student.nombre,
        apellido: student.apellido,
        telefono: student.telefono,
        email: student.email,
        diplomatura: student.diplomatura,
        idEstudiante: student.idEstudiante,
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        diplomatura: '',
        idEstudiante: '',
      });
    }
    setErrors({});
  }, [student, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.diplomatura) newErrors.diplomatura = 'La diplomatura es requerida';
    if (!formData.idEstudiante.trim()) newErrors.idEstudiante = 'El ID de estudiante es requerido';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent aria-describedby={undefined} className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:border [&>button]:border-input [&>button]:bg-transparent [&>button]:hover:bg-accent [&>button]:hover:text-accent-foreground [&>button]:rounded-md [&>button]:p-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            {student ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Información Personal
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className={errors.nombre ? 'border-red-500' : ''}
                  />
                  {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className={errors.apellido ? 'border-red-500' : ''}
                  />
                  {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Información de Contacto
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className={errors.telefono ? 'border-red-500' : ''}
                    placeholder="+54 11 1234-5678"
                  />
                  {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-red-500' : ''}
                    placeholder="estudiante@email.com"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Información Académica
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="idEstudiante">ID Estudiante *</Label>
                  <Input
                    id="idEstudiante"
                    value={formData.idEstudiante}
                    onChange={(e) => setFormData({ ...formData, idEstudiante: e.target.value })}
                    className={errors.idEstudiante ? 'border-red-500' : ''}
                    placeholder="EST001"
                  />
                  {errors.idEstudiante && <p className="text-sm text-red-500">{errors.idEstudiante}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diplomatura">Diplomatura *</Label>
                  <Select
                    value={formData.diplomatura}
                    onValueChange={(value) => setFormData({ ...formData, diplomatura: value })}
                  >
                    <SelectTrigger className={errors.diplomatura ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar diplomatura" />
                    </SelectTrigger>
                    <SelectContent>
                      {diplomaturas.map((d) => (
                        <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.diplomatura && <p className="text-sm text-red-500">{errors.diplomatura}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Note */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> La asistencia se calculará automáticamente basada en los archivos CSV 
              que subas para cada clase. Los estudiantes necesitan 75% de asistencia para aprobar.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {student ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}