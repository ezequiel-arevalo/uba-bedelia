# Student Management System (Sistema de Gestión de Alumnos)

A modern, responsive student management interface built with Next.js, React, and Tailwind CSS. This system provides comprehensive tools for managing student records with advanced filtering, sorting, and CRUD operations.

## 🚀 Features

### Core Functionality
- **Student Management**: Create, read, update, and delete student records
- **Modal-based Operations**: Clean pop-up interfaces for all CRUD operations
- **Advanced Search**: Real-time search across all student fields
- **Dynamic Statistics**: Live stats that update based on filtered results
- **Pagination**: Display 10 students per page with navigation controls

### Filtering & Sorting
- **Diplomatura Filter**: Single or multiple selection filtering by program
- **Approval Status Filter**: Filter by approved/not approved students
- **Sortable Columns**: Click to sort by Student ID or Approval Status
- **Combined Filtering**: All filters work together seamlessly

### Data Management
- **Import/Export**: Buttons for data import and export functionality
- **Form Validation**: Comprehensive validation for all student fields
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 📊 Student Data Structure

Each student record contains:
- **Nombre** (Name): Student's first name
- **Apellido** (Last Name): Student's surname
- **ID Estudiante** (Student ID): Unique identifier
- **DNI**: National identification number
- **Teléfono** (Phone): Contact number
- **Diplomatura** (Program): Academic program enrolled in
- **Aprobado** (Approved): Pass/fail status
- **Asistencia** (Attendance): Attendance percentage

## 🎯 Key Components

### StudentManagement (`components/student-management.tsx`)
Main component that orchestrates the entire system:
- Manages all state (students, filters, pagination, modals)
- Handles search and filtering logic
- Calculates dynamic statistics
- Renders the complete interface

### StudentModal (`components/student-modal.tsx`)
Reusable modal for create/edit operations:
- Form validation and error handling
- Dynamic mode switching (create vs edit)
- Diplomatura dropdown with predefined options

### DeleteConfirmModal (`components/delete-confirm-modal.tsx`)
Confirmation dialog for safe deletion:
- Prevents accidental deletions
- Shows student details for confirmation
- Clean cancel/confirm actions

## 🔧 Technical Implementation

### State Management
- **React useState**: Local state for all data and UI states
- **Derived State**: Filtered and paginated data computed from base state
- **Real-time Updates**: Statistics and counts update automatically

### Filtering Logic
\`\`\`typescript
// Multi-layered filtering system
const filteredStudents = students
  .filter(student => searchTerm match)
  .filter(student => diplomatura filter match)
  .filter(student => approval status match)
  .sort(by selected column and direction)
\`\`\`

### Pagination System
- **Items per page**: Fixed at 10 students
- **Dynamic page calculation**: Based on filtered results
- **Auto-reset**: Returns to page 1 when filters change
- **Navigation**: Previous/Next buttons + numbered pages

### Statistics Calculation
Dynamic stats based on currently filtered students:
- **Total Students**: Count of filtered results
- **Approved**: Count of approved students in current view
- **Not Approved**: Count of non-approved students in current view
- **Average Attendance**: Mean attendance of visible students

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and navigation
- **Success**: Green for approved status and positive actions
- **Warning**: Red for deletion and negative status
- **Neutral**: Gray scale for backgrounds and secondary elements

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, consistent sizing
- **Form Labels**: Clear, accessible labeling

### Layout
- **Card-based Design**: Clean sections with proper spacing
- **Responsive Grid**: Adapts to different screen sizes
- **Consistent Spacing**: 16px base unit for margins and padding

## 📱 User Experience

### Workflow
1. **View Dashboard**: See statistics and student list
2. **Search/Filter**: Find specific students or groups
3. **Add Student**: Click "Agregar Alumno" → Fill form → Save
4. **Edit Student**: Click edit icon → Modify data → Update
5. **Delete Student**: Click delete icon → Confirm → Remove

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Clear focus indicators

## 🛠 Dependencies
### UI Components
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library

### Component Library
- **shadcn/ui**: Pre-built accessible components
  - Button, Card, Input, Select
  - Dialog, Badge, Table
  - Form validation components

## 🔮 Future Enhancements

- **Data Persistence**: Connect to database (Supabase/PostgreSQL)
- **Authentication**: User login and role-based access
- **Bulk Operations**: Select multiple students for batch actions
- **Advanced Reporting**: Generate detailed reports and analytics
- **File Upload**: Import students from CSV/Excel files
- **Email Integration**: Send notifications and communications