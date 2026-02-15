import React from 'react';
import { cn } from '@/lib/utils';

type Status = 'scheduled' | 'completed' | 'cancelled' | 'in-progress' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  scheduled: { label: 'Scheduled', className: 'badge-info' },
  completed: { label: 'Completed', className: 'badge-success' },
  cancelled: { label: 'Cancelled', className: 'badge-destructive' },
  'in-progress': { label: 'In Progress', className: 'badge-warning' },
  active: { label: 'Active', className: 'badge-success' },
  inactive: { label: 'Inactive', className: 'badge-destructive' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
}
