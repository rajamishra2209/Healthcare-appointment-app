const express = require('express');
const { loginController, registerController, authController , applyDoctorController , getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController, userAppointmentsController, medicalHistoryController ,getMedicalInfoController, updateMedicalProfileController} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login',loginController);

//Register || POST
router.post('/register',registerController);

// AUTH || POST
router.post('/getUserData',authMiddleware , authController);

// Apply Doctor || POST
router.post('/apply-doctor',authMiddleware , applyDoctorController);

// Apply Notification || POST
router.post('/get-all-notification',authMiddleware , getAllNotificationController);

// Delete all Notification || POST
router.post('/delete-all-notification',authMiddleware , deleteAllNotificationController);

//Get all Doctor List
router.get('/getAllDoctors', authMiddleware , getAllDoctorsController);

//Book Appointment
router.post('/book-appointment',authMiddleware , bookAppointmentController);

//Appointment List
router.get('/user-appointments', authMiddleware ,userAppointmentsController);

// Apply Medical History|| POST
router.post('/medical-history',authMiddleware , medicalHistoryController);

//Post  medicalInfo of user
router.post('/getMedicalInfo', authMiddleware , getMedicalInfoController);

//Update medicalInfo of user
router.post('/updateMedicalProfile', authMiddleware , updateMedicalProfileController);

module.exports= router;