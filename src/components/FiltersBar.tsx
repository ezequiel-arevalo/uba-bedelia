import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { Filters, Diplomatura } from '../types';

interface FiltersBarProps {
  filters: Filters;
  diplomaturas: Diplomatura[];
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function FiltersBar({ filters, diplomaturas, onFiltersChange, onClearFilters }: FiltersBarProps) {
  const hasActiveFilters = 
    filters.diplomatura !== 'all' || 
    filters.aprobado !== 'all' || 
    filters.search !== '';

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtros</h3>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar estudiantes..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Diplomatura Filter */}
          <Select
            value={filters.diplomatura as string}
            onValueChange={(value) => onFiltersChange({ ...filters, diplomatura: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por diplomatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las diplomaturas</SelectItem>
              {diplomaturas.map((diplomatura) => (
                <SelectItem key={diplomatura.id} value={diplomatura.name}>
                  {diplomatura.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Approval Status Filter */}
          <Select
            value={filters.aprobado}
            onValueChange={(value) => onFiltersChange({ ...filters, aprobado: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="aprobado">Aprobados</SelectItem>
              <SelectItem value="no-aprobado">No Aprobados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}