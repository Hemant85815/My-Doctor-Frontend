import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react'; // Activity removed as we don't use it yet
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    completedToday: 0,
  });
  const [todayAppointmentsList, setTodayAppointmentsList] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/appointments'),
          api.get('/doctors')
        ]);

        const patients = patientsRes.data;
        const appointments = appointmentsRes.data;
        const doctorsData = doctorsRes.data;

        setDoctors(doctorsData);

        // Calculate Stats
        const today = new Date().toISOString().split('T')[0];
        const todaysAppts = appointments.filter((a: any) => a.date === today);

        setStats({
          totalPatients: patients.length,
          totalAppointments: appointments.length,
          todayAppointments: todaysAppts.length,
          completedToday: todaysAppts.filter((a: any) => a.status === 'completed').length
        });

        setTodayAppointmentsList(todaysAppts.slice(0, 5)); // Show top 5

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

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
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          variant="info"
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

      {/* Today's Schedule & Available Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="form-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
          </div>
          <div className="space-y-4">
            {todayAppointmentsList.length === 0 && <p className="text-muted-foreground text-sm">No scheduled appointments for today.</p>}
            {todayAppointmentsList.map((apt) => (
              <div key={apt._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-medium text-sm">
                      {apt.patientName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      With {apt.doctorName || 'Doctor'} at {apt.time}
                    </p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Available Doctors */}
        <div className="form-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Doctors</h3>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {doctor.name.split(' ').map((n: string) => n.charAt(0)).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


