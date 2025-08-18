import React, { useState, useMemo } from 'react';
import { BarChart, Download, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Student, ClassSession, StudentStatistics } from '../types';
import { exportStatisticsToExcel } from '../utils/exportUtils';

interface StatisticsDashboardProps {
  students: Student[];
  classSessions: ClassSession[];
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
  students,
  classSessions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'notApproved'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'percentage'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const statistics = useMemo(() => {
    return students.map(student => {
      const studentName = `${student.firstName.trim()} ${student.lastName.trim()}`.toLowerCase();
      
      const classDetails = classSessions.map(classSession => {
        const attendanceRecord = classSession.attendanceRecords.find(record => 
          record.studentName.toLowerCase().trim() === studentName
        );
        
        return {
          classId: classSession.id,
          date: classSession.date,
          present: attendanceRecord ? attendanceRecord.present : false
        };
      });

      const totalClasses = classSessions.length;
      const attendances = classDetails.filter(detail => detail.present).length;
      const absences = totalClasses - attendances;
      const attendancePercentage = totalClasses > 0 ? (attendances / totalClasses) * 100 : 0;

      return {
        student,
        totalClasses,
        attendances,
        absences,
        attendancePercentage,
        status: attendancePercentage >= 75 ? 'Aprobado' as const : 'No Aprobado' as const,
        classDetails
      };
    });
  }, [students, classSessions]);

  const filteredAndSortedStatistics = useMemo(() => {
    let filtered = statistics.filter(stat => {
      const matchesSearch = 
        stat.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'approved' && stat.status === 'Aprobado') ||
        (statusFilter === 'notApproved' && stat.status === 'No Aprobado');

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.student.firstName} ${a.student.lastName}`.localeCompare(
            `${b.student.firstName} ${b.student.lastName}`
          );
          break;
        case 'attendance':
          comparison = a.attendances - b.attendances;
          break;
        case 'percentage':
          comparison = a.attendancePercentage - b.attendancePercentage;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [statistics, searchTerm, statusFilter, sortBy, sortOrder]);

  const overallStats = useMemo(() => {
    const approved = statistics.filter(stat => stat.status === 'Aprobado').length;
    const avgAttendance = statistics.length > 0 
      ? statistics.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / statistics.length 
      : 0;

    return {
      totalStudents: statistics.length,
      approved,
      notApproved: statistics.length - approved,
      approvalRate: statistics.length > 0 ? (approved / statistics.length) * 100 : 0,
      avgAttendance
    };
  }, [statistics]);

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Estadísticas de Asistencia</h3>
              <p className="text-muted mb-0">Resumen del rendimiento académico</p>
            </div>
            <button
              className="btn btn-success"
              onClick={() => exportStatisticsToExcel(statistics)}
              disabled={statistics.length === 0}
            >
              <Download size={16} className="me-1" />
              Exportar Estadísticas
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-left-primary">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Estudiantes
                  </div>
                  <div className="h5 mb-0 font-weight-bold">{overallStats.totalStudents}</div>
                </div>
                <div className="col-auto">
                  <BarChart size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-left-success">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Aprobados
                  </div>
                  <div className="h5 mb-0 font-weight-bold">{overallStats.approved}</div>
                </div>
                <div className="col-auto">
                  <TrendingUp size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-left-danger">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    No Aprobados
                  </div>
                  <div className="h5 mb-0 font-weight-bold">{overallStats.notApproved}</div>
                </div>
                <div className="col-auto">
                  <TrendingDown size={24} className="text-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-left-info">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Promedio Asistencia
                  </div>
                  <div className="h5 mb-0 font-weight-bold">
                    {overallStats.avgAttendance.toFixed(1)}%
                  </div>
                </div>
                <div className="col-auto">
                  <BarChart size={24} className="text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">Todos los estados</option>
            <option value="approved">Aprobados</option>
            <option value="notApproved">No Aprobados</option>
          </select>
        </div>
        <div className="col-md-5">
          <p className="mb-0 text-muted">
            Mostrando {filteredAndSortedStatistics.length} de {statistics.length} estudiantes
          </p>
        </div>
      </div>

      {/* Statistics Table */}
      <div className="row">
        <div className="col">
          {filteredAndSortedStatistics.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted mb-0">
                  {statistics.length === 0 
                    ? 'No hay datos para mostrar. Agrega estudiantes y clases primero.'
                    : 'No se encontraron estudiantes que coincidan con los filtros.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th 
                        className="cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        Estudiante {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>ID / DNI</th>
                      <th>Diplomatura</th>
                      <th className="text-center">Total Clases</th>
                      <th 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('attendance')}
                      >
                        Asistencias {sortBy === 'attendance' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-center">Faltas</th>
                      <th 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('percentage')}
                      >
                        % Asistencia {sortBy === 'percentage' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedStatistics.map(stat => (
                      <tr key={stat.student.id}>
                        <td>
                          <div>
                            <div className="fw-bold">
                              {stat.student.firstName} {stat.student.lastName}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div>{stat.student.studentId}</div>
                            <div className="text-muted">{stat.student.dni}</div>
                          </div>
                        </td>
                        <td className="small">{stat.student.program}</td>
                        <td className="text-center">{stat.totalClasses}</td>
                        <td className="text-center text-success fw-bold">{stat.attendances}</td>
                        <td className="text-center text-danger">{stat.absences}</td>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                              <div
                                className={`progress-bar ${
                                  stat.attendancePercentage >= 75 ? 'bg-success' : 'bg-danger'
                                }`}
                                style={{ width: `${stat.attendancePercentage}%` }}
                              ></div>
                            </div>
                            <span className="small fw-bold">
                              {stat.attendancePercentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${
                            stat.status === 'Aprobado' ? 'bg-success' : 'bg-danger'
                          }`}>
                            {stat.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};