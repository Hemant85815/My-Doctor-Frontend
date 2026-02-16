import { useEffect } from 'react';
import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Appointment } from '@/types';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<{ id: string, name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const itemsPerPage = 6;

  // Fetch Data
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      // Map backend _id to frontend id
      const formatted = data.map((apt: any) => ({
        ...apt,
        id: apt._id,
      }));
      setAppointments(formatted);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      toast({ title: "Error", description: "Failed to load appointments", variant: "destructive" });
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      const formatted = data.map((doc: any) => ({
        id: doc._id,
        name: doc.name
      }));
      setDoctors(formatted);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    patientName: '', // Added patientName as backend expects it or patientId
    patientId: '', // Optional in backend if name provided, but good to have
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: '',
    status: 'scheduled' as Appointment['status'],
  });

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Role-based filtering for doctors
    if (user?.role === 'doctor') {
      filtered = filtered.filter(apt => apt.doctorId === user.id);
    }

    if (searchQuery) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (apt.doctorName && apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (doctorFilter !== 'all') {
      filtered = filtered.filter(apt => apt.doctorId === doctorFilter);
    }

    return filtered;
  }, [appointments, searchQuery, statusFilter, doctorFilter, user]);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      notes: appointment.notes || '',
      status: appointment.status,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setSelectedAppointment(null);
    setFormData({
      patientName: '',
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      notes: '',
      status: 'scheduled',
    });
    setIsDialogOpen(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedAppointment) {
        // Update
        await api.put(`/appointments/${selectedAppointment.id}`, formData);
        toast({ title: 'Appointment updated', description: 'Success.' });
      } else {
        // Create
        // We need a patientId? For now, if we don't have a patients list picker, 
        // the backend might require patientId/Name. 
        // My backend model has strict `doctorId` required but relaxed `patientId`.
        // User needs to select a Doctor.

        await api.post('/appointments', formData);
        toast({ title: 'Appointment created', description: 'Success.' });
      }
      setIsDialogOpen(false);
      fetchAppointments(); // Refresh list
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Operation failed',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      setAppointments(prev => prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      toast({ title: 'Status updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/appointments/${appointment.id}`);
      setAppointments(prev => prev.filter(apt => apt.id !== appointment.id));
      toast({ title: 'Appointment cancelled', variant: 'destructive', });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const columns = [
    {
      key: 'patient',
      header: 'Patient',
      render: (apt: Appointment) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium text-sm">
              {apt.patientName?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{apt.patientName}</p>
            <p className="text-sm text-muted-foreground">{apt.reason}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (apt: Appointment) => (
        <span className="text-foreground">{apt.doctorName || doctors.find(d => d.id === apt.doctorId)?.name || 'Unknown'}</span>
      ),
    },
    {
      key: 'dateTime',
      header: 'Date & Time',
      render: (apt: Appointment) => (
        <div>
          <p className="font-medium text-foreground">{apt.date}</p>
          <p className="text-sm text-muted-foreground">{apt.time}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (apt: Appointment) => <StatusBadge status={apt.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (apt: Appointment) => (
        <div className="flex items-center gap-2">
          <Select
            defaultValue={apt.status}
            onValueChange={(value) => handleStatusChange(apt.id, value as Appointment['status'])}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => openEditDialog(apt)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(apt)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header mb-1">Appointment Management</h1>
          <p className="text-muted-foreground">View and manage all appointments</p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={doctorFilter} onValueChange={setDoctorFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Doctor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doctors</SelectItem>
            {doctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(statusFilter !== 'all' || doctorFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter('all');
              setDoctorFilter('all');
            }}
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <DataTable
        data={paginatedAppointments}
        columns={columns}
        searchPlaceholder="Search appointments..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        emptyMessage="No appointments found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAppointment ? 'Edit' : 'New'} Appointment</DialogTitle>
            <DialogDescription>
              {selectedAppointment ? 'Update details below.' : 'Schedule a new appointment.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Name - For simplicity allowing text input, ideally a select from Patients API */}
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Appointment['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedAppointment ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


