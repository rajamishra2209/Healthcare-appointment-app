const mongoose = require("mongoose");

const medicalhistorySchema = new mongoose.Schema( {
    userId:{
        type:String,
    },
    allergies:{
        type:String,
        required:[true,'allergies data is required']
    },
    medications:{
        type:String,
        required:[true,'medications data is required']
    },
    pastProcedure:{
        type:String,
        required:[true,'past procedure data is required']
    },
    }
);

const medicalhistoryModel = mongoose.model("medicalHistory",medicalhistorySchema);
module.exports = medicalhistoryModel;