import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import {  Patient } from '@/data/mockData';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  medicalHistory: z.string().optional(),
});

type PatientForm = z.infer<typeof patientSchema>;

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(() => {
  const storedPatients = localStorage.getItem('patients');
  return storedPatients ? JSON.parse(storedPatients) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const itemsPerPage = 5;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'male',
      bloodGroup: 'O+',
    },
  });

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
    );
  }, [patients, searchQuery]);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const openAddDialog = () => {
    setSelectedPatient(null);
    reset({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      bloodGroup: 'O+',
      medicalHistory: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    reset({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      medicalHistory: patient.medicalHistory || '',
    });
    setIsDialogOpen(true);
  };

  const openViewDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const onSubmit = (data: PatientForm) => {
    if (selectedPatient) {
          setPatients(prev => {
      const updated = prev.map(p => 
        p.id === selectedPatient.id 
              ? { ...selectedPatient, ...data }
          : p
      );
      localStorage.setItem('patients', JSON.stringify(updated));
      return updated;
    });    
      toast({
        title: 'Patient updated',
        description: 'Patient record has been successfully updated.',
      });
    } else {
      const newPatient: Patient = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        bloodGroup: data.bloodGroup,
        medicalHistory: data.medicalHistory,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPatients(prev => {
  const updated = [newPatient, ...prev];
  localStorage.setItem('patients', JSON.stringify(updated));
  return updated;
});
      toast({
        title: 'Patient added',
        description: 'New patient has been successfully registered.',
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (patient: Patient) => {
  setPatients(prev => {
    const updated = prev.filter(p => p.id !== patient.id);
    localStorage.setItem('patients', JSON.stringify(updated));
    return updated;
  });

  toast({
    title: 'Patient deleted',
    description: 'Patient record has been removed.',
    variant: 'destructive',
  });
};

  const columns = [
    {
      key: 'name',
      header: 'Patient Name',
      render: (patient: Patient) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium text-sm">
              {patient.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{patient.name}</p>
            <p className="text-sm text-muted-foreground">{patient.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone' },
    { key: 'bloodGroup', header: 'Blood Group' },
    {
      key: 'gender',
      header: 'Gender',
      render: (patient: Patient) => (
        <span className="capitalize">{patient.gender}</span>
      ),
    },
    { key: 'createdAt', header: 'Registered' },
    {
      key: 'actions',
      header: 'Actions',
      render: (patient: Patient) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => openViewDialog(patient)}>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openEditDialog(patient)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(patient)}>
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
          <h1 className="page-header mb-1">Patient Management</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      <DataTable
        data={paginatedPatients}
        columns={columns}
        searchPlaceholder="Search patients..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        emptyMessage="No patients found"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
            </DialogTitle>
            <DialogDescription>
              {selectedPatient 
                ? 'Update patient information below.'
                : 'Fill in the patient details to create a new record.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')} defaultValue={watch('gender')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select onValueChange={(value) => setValue('bloodGroup', value)} defaultValue={watch('bloodGroup')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
              <Textarea id="medicalHistory" {...register('medicalHistory')} rows={3} />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedPatient ? 'Update Patient' : 'Add Patient'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-xl">
                    {selectedPatient.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                  <p className="text-muted-foreground">{selectedPatient.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{selectedPatient.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{selectedPatient.bloodGroup}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{selectedPatient.address}</p>
              </div>
              
              {selectedPatient.medicalHistory && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Medical History</p>
                  <p className="font-medium">{selectedPatient.medicalHistory}</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Registered On</p>
                <p className="font-medium">{selectedPatient.createdAt}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
