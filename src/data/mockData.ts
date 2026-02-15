export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  bloodGroup: string;
  medicalHistory?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  reason: string;
  notes?: string;
}

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    address: '123 Main Street, New York, NY 10001',
    bloodGroup: 'O+',
    medicalHistory: 'Hypertension, managed with medication',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.j@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1992-07-22',
    gender: 'female',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    bloodGroup: 'A+',
    medicalHistory: 'No significant history',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1978-11-08',
    gender: 'male',
    address: '789 Pine Road, Chicago, IL 60601',
    bloodGroup: 'B-',
    medicalHistory: 'Diabetes Type 2',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.w@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1990-05-30',
    gender: 'female',
    address: '321 Elm Street, Houston, TX 77001',
    bloodGroup: 'AB+',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '1965-09-12',
    gender: 'male',
    address: '654 Maple Drive, Phoenix, AZ 85001',
    bloodGroup: 'O-',
    medicalHistory: 'Arthritis, Allergies (Penicillin)',
    createdAt: '2024-02-15',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medicare.com',
    specialization: 'General Medicine',
    phone: '+1 (555) 111-2222',
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medicare.com',
    specialization: 'Cardiology',
    phone: '+1 (555) 222-3333',
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@medicare.com',
    specialization: 'Pediatrics',
    phone: '+1 (555) 333-4444',
    available: true,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@medicare.com',
    specialization: 'Orthopedics',
    phone: '+1 (555) 444-5555',
    available: false,
  },
  {
    id: '5',
    name: 'Dr. Amanda Garcia',
    email: 'amanda.garcia@medicare.com',
    specialization: 'Dermatology',
    phone: '+1 (555) 555-6666',
    available: true,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-25',
    time: '09:00',
    status: 'scheduled',
    reason: 'Annual checkup',
    notes: 'Patient requested blood work',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Johnson',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-25',
    time: '10:30',
    status: 'in-progress',
    reason: 'Heart palpitations',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-25',
    time: '14:00',
    status: 'scheduled',
    reason: 'Diabetes follow-up',
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Sarah Wilson',
    doctorId: '3',
    doctorName: 'Dr. Emily Davis',
    date: '2025-01-24',
    time: '11:00',
    status: 'completed',
    reason: 'Vaccination',
    notes: 'Flu shot administered',
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'David Lee',
    doctorId: '4',
    doctorName: 'Dr. James Wilson',
    date: '2025-01-26',
    time: '15:30',
    status: 'scheduled',
    reason: 'Knee pain consultation',
  },
  {
    id: '6',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '5',
    doctorName: 'Dr. Amanda Garcia',
    date: '2025-01-23',
    time: '09:30',
    status: 'cancelled',
    reason: 'Skin rash examination',
    notes: 'Patient cancelled due to travel',
  },
  {
    id: '7',
    patientId: '2',
    patientName: 'Emily Johnson',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-27',
    time: '16:00',
    status: 'scheduled',
    reason: 'General consultation',
  },
  {
    id: '8',
    patientId: '3',
    patientName: 'Michael Brown',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-28',
    time: '10:00',
    status: 'scheduled',
    reason: 'Cardiac evaluation',
  },
];

export const getDashboardStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(a => a.date === today);
  
  return {
    totalPatients: mockPatients.length,
    totalAppointments: mockAppointments.length,
    todayAppointments: todayAppointments.length || 3,
    completedToday: mockAppointments.filter(a => a.date === today && a.status === 'completed').length || 1,
    pendingAppointments: mockAppointments.filter(a => a.status === 'scheduled').length,
    cancelledAppointments: mockAppointments.filter(a => a.status === 'cancelled').length,
  };
};

export const getWeeklyStats = () => {
  return [
    { day: 'Mon', appointments: 12, patients: 8 },
    { day: 'Tue', appointments: 15, patients: 10 },
    { day: 'Wed', appointments: 8, patients: 6 },
    { day: 'Thu', appointments: 18, patients: 14 },
    { day: 'Fri', appointments: 14, patients: 11 },
    { day: 'Sat', appointments: 6, patients: 4 },
    { day: 'Sun', appointments: 3, patients: 2 },
  ];
};

export const getMonthlyStats = () => {
  return [
    { month: 'Jan', appointments: 145, newPatients: 32 },
    { month: 'Feb', appointments: 132, newPatients: 28 },
    { month: 'Mar', appointments: 167, newPatients: 45 },
    { month: 'Apr', appointments: 154, newPatients: 38 },
    { month: 'May', appointments: 178, newPatients: 52 },
    { month: 'Jun', appointments: 189, newPatients: 48 },
  ];
};

export const getAppointmentsByStatus = () => {
  return [
    { name: 'Scheduled', value: 45, color: 'hsl(var(--info))' },
    { name: 'Completed', value: 120, color: 'hsl(var(--success))' },
    { name: 'Cancelled', value: 15, color: 'hsl(var(--destructive))' },
    { name: 'In Progress', value: 8, color: 'hsl(var(--warning))' },
  ];
};
