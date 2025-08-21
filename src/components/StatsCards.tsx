import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { StudentStats } from '../types';

interface StatsCardsProps {
  stats: StudentStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Estudiantes
          </CardTitle>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Estudiantes registrados
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Aprobados
          </CardTitle>
          <UserCheck className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{stats.approvedStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            ≥75% de asistencia
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            No Aprobados
          </CardTitle>
          <UserX className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{stats.notApprovedStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            &lt;75% de asistencia
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Asistencia Promedio
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            {stats.averageAttendance.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Promedio general
          </p>
        </CardContent>
      </Card>
    </div>
  );
}