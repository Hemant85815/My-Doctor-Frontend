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
    createdAt?: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    available: boolean;
    email?: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName?: string;
    doctorId: string;
    doctorName?: string;
    date: string;
    time: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    reason: string;
    notes?: string;
}
