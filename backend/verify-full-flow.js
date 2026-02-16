import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
let doctorToken = '';
let patientId = '';
let doctorId = '';

const log = (msg, data) => {
    console.log(`\n=== ${msg} ===`);
    if (data) console.log(JSON.stringify(data, null, 2));
};

const run = async () => {
    try {
        // 1. Register Doctor
        const doctorRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Dr. Verify',
                email: `doctor${Date.now()}@test.com`,
                password: 'password123',
                role: 'doctor',
                specialization: 'General'
            })
        });
        const doctorData = await doctorRes.json();
        log('Registered Doctor', doctorData);
        doctorToken = doctorData.token;
        doctorId = doctorData._id;

        if (!doctorToken) throw new Error('Failed to register doctor');

        // 2. Create Patient (as Doctor)
        const patientRes = await fetch(`${BASE_URL}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${doctorToken}`
            },
            body: JSON.stringify({
                name: 'Test Patient',
                email: `patient${Date.now()}@test.com`,
                phone: '1234567890',
                gender: 'male',
                dateOfBirth: '1990-01-01'
            })
        });
        const patientData = await patientRes.json();
        log('Created Patient', patientData);
        patientId = patientData._id;

        // 3. Create Appointment
        const appointmentRes = await fetch(`${BASE_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${doctorToken}`
            },
            body: JSON.stringify({
                patientName: 'Test Patient',
                patientId: patientId,
                doctorId: doctorId,
                date: '2025-02-20',
                time: '10:00',
                reason: 'Checkup'
            })
        });
        const appointmentData = await appointmentRes.json();
        log('Created Appointment', appointmentData);

        // 4. Get Appointments
        const getApptsRes = await fetch(`${BASE_URL}/appointments`, {
            headers: { 'Authorization': `Bearer ${doctorToken}` }
        });
        const getApptsData = await getApptsRes.json();
        log('Fetched Appointments', getApptsData);

        console.log('\n✅ Verification Passed!');
    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
    }
};

run();
