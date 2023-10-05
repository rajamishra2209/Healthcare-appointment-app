const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//Post GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleware , getDoctorByIdController);

//Get Appointments
router.get('/doctor-appointments' , authMiddleware ,doctorAppointmentsController);

//Post Update Status
router.post('/update-status' , authMiddleware , updateStatusController);

module.exports = router;