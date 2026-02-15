import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockAppointments } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (date: string) => {
    return mockAppointments.filter(apt => apt.date === date);
  };

  const formatDateString = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const calendarDays = useMemo(() => {
    const days = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: lastDayOfPrevMonth - i,
        isCurrentMonth: false,
        date: '',
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: formatDateString(i),
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: '',
      });
    }
    
    return days;
  }, [year, month, daysInMonth, firstDayOfMonth, lastDayOfPrevMonth]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header mb-1">Calendar</h1>
          <p className="text-muted-foreground">View and manage appointments by date</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode('month')} 
            className={viewMode === 'month' ? 'bg-primary text-primary-foreground' : ''}>
            Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewMode('week')}
            className={viewMode === 'week' ? 'bg-primary text-primary-foreground' : ''}>
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="form-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-48 text-center">
              {monthNames[month]} {year}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((dayInfo, index) => {
            const appointments = dayInfo.isCurrentMonth ? getAppointmentsForDate(dayInfo.date) : [];
            const isTodayDate = dayInfo.isCurrentMonth && isToday(dayInfo.day);
            
            return (
              <div
                key={index}
                className={cn(
                  "bg-card min-h-28 p-2 transition-colors hover:bg-muted/50",
                  !dayInfo.isCurrentMonth && "bg-muted/30 text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-1",
                  isTodayDate && "bg-primary text-primary-foreground"
                )}>
                  {dayInfo.day}
                </div>
                
                <div className="space-y-1">
                  {appointments.slice(0, 2).map(apt => (
                    <div
                      key={apt.id}
                      className={cn(
                        "text-xs px-2 py-1 rounded truncate cursor-pointer transition-colors",
                        apt.status === 'scheduled' && "bg-info/10 text-info hover:bg-info/20",
                        apt.status === 'completed' && "bg-success/10 text-success hover:bg-success/20",
                        apt.status === 'cancelled' && "bg-destructive/10 text-destructive hover:bg-destructive/20",
                        apt.status === 'in-progress' && "bg-warning/10 text-warning hover:bg-warning/20"
                      )}
                    >
                      <span className="font-medium">{apt.time}</span> {apt.patientName.split(' ')[0]}
                    </div>
                  ))}
                  {appointments.length > 2 && (
                    <p className="text-xs text-muted-foreground pl-2">
                      +{appointments.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments Detail */}
      <div className="form-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Today's Schedule
        </h3>
        
        <div className="space-y-3">
          {mockAppointments.filter(apt => apt.date === new Date().toISOString().split('T')[0] || apt.date === '2025-01-25').slice(0, 5).map(apt => (
            <div key={apt.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-16 text-center">
                <p className="font-semibold text-foreground">{apt.time}</p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{apt.patientName}</p>
                <p className="text-sm text-muted-foreground">{apt.doctorName} • {apt.reason}</p>
              </div>
              <StatusBadge status={apt.status} />
            </div>
          ))}
          
          {mockAppointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No appointments scheduled for today
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
