import User from '../models/User.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
export const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
