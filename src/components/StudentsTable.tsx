import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StudentWithAttendance, SortConfig } from '../types';

interface StudentsTableProps {
  students: StudentWithAttendance[];
  sortConfig: SortConfig;
  onEditStudent: (student: StudentWithAttendance) => void;
  onDeleteStudent: (studentId: string) => void;
  onSort: (key: 'idEstudiante' | 'aprobado') => void;
}

export function StudentsTable({ 
  students, 
  sortConfig, 
  onEditStudent, 
  onDeleteStudent, 
  onSort 
}: StudentsTableProps) {
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSortIcon = (key: 'idEstudiante' | 'aprobado') => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Estudiante</TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => onSort('idEstudiante')}
              >
                <div className="flex items-center gap-2">
                  ID Estudiante
                  {getSortIcon('idEstudiante')}
                </div>
              </TableHead>
              <TableHead className="font-semibold">Contacto</TableHead>
              <TableHead className="font-semibold">Diplomatura</TableHead>
              <TableHead className="font-semibold text-center">Asistencia</TableHead>
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => onSort('aprobado')}
              >
                <div className="flex items-center gap-2">
                  Estado
                  {getSortIcon('aprobado')}
                </div>
              </TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl">📚</div>
                    <p className="text-lg font-medium">No se encontraron estudiantes</p>
                    <p className="text-sm">Intenta ajustar los filtros o agregar nuevos estudiantes</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                          {getInitials(student.nombre, student.apellido)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {student.nombre} {student.apellido}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {student.idEstudiante}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{student.telefono}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {student.diplomatura}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getAttendanceColor(student.attendancePercentage)}`}>
                        {student.attendancePercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.attendedClasses}/{student.totalClassesForDiplomatura} clases
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={student.aprobado ? "default" : "destructive"}
                      className="font-medium"
                    >
                      {student.aprobado ? 'Aprobado' : 'No Aprobado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditStudent(student)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteStudent(student.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}