import express from 'express';
import { getPatients, createPatient, getPatient, updatePatient, deletePatient } from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .get(getPatients)
    .post(createPatient);

router.route('/:id')
    .get(getPatient)
    .put(updatePatient)
    .delete(deletePatient);

export default router;
