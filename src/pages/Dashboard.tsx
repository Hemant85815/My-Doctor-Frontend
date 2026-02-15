import React from 'react';
import { Users, Calendar, Clock, CheckCircle, Activity } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { getDashboardStats, getMonthlyStats, mockDoctors } from '@/data/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';
import { useState, useEffect } from 'react';
import { Patient } from '@/data/mockData'; // make sure Patient type is imported

export default function Dashboard() {
  const { user } = useAuth();
  const stats = getDashboardStats();
  const monthlyStats = getMonthlyStats();

const [patients, setPatients] = useState<Patient[]>([]);

useEffect(() => {
  const loadPatients = () => {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      setPatients([]);
    }
  };

  loadPatients(); // initial load

  // Listen for storage changes (from other tabs or components)
  window.addEventListener('storage', loadPatients);

  return () => {
    window.removeEventListener('storage', loadPatients);
  };
}, []);


const todayAppointments = patients.slice(0, 5); // show first 5 patients

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at your clinic today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          variant="info"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
      </div>

      {/* Monthly Trend & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       

        {/* Today's Schedule */}
        <div className="form-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-medium text-sm">
                    {apt.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {apt.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {apt.email} • {apt.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Doctors */}
      <div className="form-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Doctors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockDoctors.filter(d => d.available).map((doctor) => (
            <div key={doctor.id} className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {doctor.name.split(' ').map(n => n.charAt(0)).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


