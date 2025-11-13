import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
}

export interface TableProps<T = any> extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({
    className,
    columns,
    data,
    onSort,
    sortKey,
    sortDirection = 'asc',
    onRowClick,
    emptyMessage = 'No data available',
    ...props
  }, ref) => {
    const handleSort = (key: string) => {
      if (!onSort) return;
      const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(key, newDirection);
    };

    return (
      <div className="w-full overflow-x-auto">
        <table
          ref={ref}
          className={cn(
            'w-full border-collapse',
            className
          )}
          {...props}
        >
          <thead>
            <tr className="bg-backend-accent border-b border-backend-default">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-sm font-semibold text-backend-primary',
                    column.sortable && 'cursor-pointer select-none hover:bg-backend-secondary/5',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-backend-focus">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-backend-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={cn(
                    'border-b border-backend-default transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-backend-accent'
                  )}
                >
                  {columns.map((column) => {
                    const value = row[column.key];
                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm text-backend-primary"
                      >
                        {column.render ? column.render(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

// Simple pagination component
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, showFirstLast = true }, ref) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Show max 7 page numbers
    let visiblePages = pages;
    if (totalPages > 7) {
      if (currentPage <= 4) {
        visiblePages = [...pages.slice(0, 5), -1, totalPages];
      } else if (currentPage >= totalPages - 3) {
        visiblePages = [1, -1, ...pages.slice(totalPages - 5)];
      } else {
        visiblePages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
      }
    }

    return (
      <div ref={ref} className="flex items-center justify-center gap-2 mt-6">
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              currentPage === 1
                ? 'text-backend-muted cursor-not-allowed'
                : 'text-backend-secondary hover:bg-backend-accent'
            )}
          >
            First
          </button>
        )}

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            currentPage === 1
              ? 'text-backend-muted cursor-not-allowed'
              : 'text-backend-secondary hover:bg-backend-accent'
          )}
        >
          Previous
        </button>

        {visiblePages.map((page, idx) =>
          page === -1 ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-backend-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage === page
                  ? 'bg-deep-navy text-creamy-white'
                  : 'text-backend-secondary hover:bg-backend-accent'
              )}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            currentPage === totalPages
              ? 'text-backend-muted cursor-not-allowed'
              : 'text-backend-secondary hover:bg-backend-accent'
          )}
        >
          Next
        </button>

        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              currentPage === totalPages
                ? 'text-backend-muted cursor-not-allowed'
                : 'text-backend-secondary hover:bg-backend-accent'
            )}
          >
            Last
          </button>
        )}
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
