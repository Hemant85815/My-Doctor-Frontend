import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarPlus, User, Stethoscope, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import api from '@/lib/api';
import { Patient, Doctor } from '@/types';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

export default function NewAppointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/doctors')
        ]);

        // Map _id to id
        const mappedPatients = patientsRes.data.map((p: any) => ({ ...p, id: p._id }));
        const mappedDoctors = doctorsRes.data.map((d: any) => ({ ...d, id: d._id }));

        setPatients(mappedPatients);
        setDoctors(mappedDoctors);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({ title: "Error", description: "Failed to load options", variant: "destructive" });
      }
    };
    fetchData();
  }, []);

  const selectedPatient = patients.find(p => p.id === watch('patientId'));
  const selectedDoctor = doctors.find(d => d.id === watch('doctorId'));

  const onSubmit = async (data: AppointmentForm) => {
    setIsSubmitting(true);

    try {
      const payload = {
        patientId: data.patientId,
        patientName: selectedPatient?.name || "Unknown",
        doctorId: data.doctorId,
        doctorName: selectedDoctor?.name || "Unknown",
        date: data.date,
        time: data.time,
        reason: data.reason,
        notes: data.notes,
        status: 'scheduled'
      };

      await api.post("/appointments", payload);

      toast({
        title: "Appointment scheduled!",
        description: `Appointment created successfully`,
      });

      navigate("/dashboard"); // Or appointments list
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to schedule appointment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarPlus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Register New Appointment</h1>
        </div>
        <p className="text-muted-foreground">Schedule a new appointment for a patient</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Patient Information
          </h2>

          <div className="space-y-2">
            <Label htmlFor="patientId">Select Patient</Label>
            <Select onValueChange={(value) => setValue('patientId', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patientId && (
              <p className="text-sm text-destructive">{errors.patientId.message}</p>
            )}
          </div>

          {selectedPatient && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedPatient.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{selectedPatient.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{selectedPatient.gender}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Doctor Selection
          </h2>

          <div className="space-y-2">
            <Label htmlFor="doctorId">Select Doctor</Label>
            <Select onValueChange={(value) => setValue('doctorId', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center gap-2">
                      <span>{doctor.name}</span>
                      <span className="text-muted-foreground">• {doctor.specialization}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p className="text-sm text-destructive">{errors.doctorId.message}</p>
            )}
          </div>

          {selectedDoctor && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Specialization</p>
                  <p className="font-medium">{selectedDoctor.specialization}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Availability</p>
                  <p className="font-medium">{selectedDoctor.available ? 'Available' : 'Unavailable'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  className="pl-10 h-12"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('date')}
                />
              </div>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time Slot</Label>
              <Select onValueChange={(value) => setValue('time', value)}>
                <SelectTrigger className="h-12">
                  <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Appointment Details
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input
                id="reason"
                placeholder="e.g., Annual checkup, Follow-up visit"
                className="h-12"
                {...register('reason')}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information or special requirements..."
                rows={4}
                {...register('notes')}
              />
            </div>
          </div>
        </div>


        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={() => navigate('/appointments')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Scheduling...
              </>
            ) : (
              'Schedule Appointment'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

