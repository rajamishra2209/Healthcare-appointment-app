const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require('../models/appointmentModel')
const medicalhistoryModel = require('../models/medicalhistoryModel')
const moment = require('moment')

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// Apply Doctor CTRL
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async(req,res) => {
  try{
    const user = await userModel.findOne({_id:req.body.userId});
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success:true,
      message:"Notifications Deleted Successfully",
      data : updatedUser,
    });
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:'unable to delete all notifications',
      error
    });
  }
};

//Get All Doctor list
const getAllDoctorsController = async(req,res) =>{
  try{
    const doctors = await doctorModel.find({status:'approved'})
    res.status(200).send({
      success:true,
      message:'Doctors list fetched Sucessfully',
      data:doctors
    });
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false.
      error,
      message:'Error while fetching Doctors'
    })
  }
};

//Book Appointment
const bookAppointmentController = async(req,res) => {
try{
  req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
  req.body.time = moment(req.body.time , 'HH:mm').toISOString();
  req.body.status = "pending";
  const newAppointment = new appointmentModel(req.body);
  await newAppointment.save();
  const user = await userModel.findOne({_id: req.body.doctorInfo.userId});
  user.notification.push({
    type:'New-Appointment-Request',
    message:`A new Appointment Request from ${req.body.userInfo.name}`,
    onClickPath:'/user/appointments'
  });
  await user.save();
  res.status(200).send({
    success:true,
    message:'Appointment Book Successfully'
  });
}catch(error){
  console.log(error);
  res.status(500).send({
    success:false,
    error,
    message:"Error while Booking Appointment"
  });
}
};

// user appointment ctrl
const userAppointmentsController = async(req,res) =>{
  try{
    const appointments = await appointmentModel.find({
      userId:req.body.userId
    })
    res.status(200).senmd({
      success:true,
      message:'Users Appointments Fetch Successfully',
      data:appointments
    })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:'Error in appointments list'
    })
  }
}


// medicalhistory ctrl
const medicalHistoryController = async(req,res) => {
  try{
    const medicalHistory = new medicalhistoryModel({ ...req.body});
    medicalHistory.save();
    res.status(201).send({
      success:true,
      message:'Medical data saved successfully',
    })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while submitting data in medical history"});
  }
}


const getMedicalInfoController = async(req,res) =>{
  try{
     const medicalInfo = await medicalhistoryModel.findOne({ userId : req.body.userId});
     res.status(200).send({
       success:true,
       message:"medical info fetched successfully",
       data: medicalInfo
     })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while getting medical info"
    });
  }
}


const updateMedicalProfileController = async(req,res) => {
  try{
    const medicalData = await medicalhistoryModel.findOneAndUpdate(
      {userId : req.body.userId},
      req.body
    );
    res.status(201).send({
      success:true,
      message:"Medical History Updated",
      data:medicalData
    });
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while updating medical history"
    });
  }
}


module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  userAppointmentsController,
  medicalHistoryController,
  getMedicalInfoController,
  updateMedicalProfileController
};


