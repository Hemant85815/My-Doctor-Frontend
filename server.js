import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/mydoctor")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const appointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorId: String,
  doctorName: String,
  date: String,
  time: String,
  reason: String,
  notes: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// CREATE appointment
app.post("/api/appointments", async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Failed to create appointment" });
  }
});

// GET appointments
app.get("/api/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
