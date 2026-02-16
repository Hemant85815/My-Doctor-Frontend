import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        // required: true // relaxed for now as frontend sends patientName sometimes directly or we might need to look it up
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: String, // Cache for easier display
    date: {
        type: String, // Keeping as string to match frontend '2025-01-25' format easily, or can use Date
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
        default: 'scheduled'
    },
    reason: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Appointment', appointmentSchema);
