const mongoose = require('mongoose')

const colors = require('colors')




const connectDB = async() => {

    try{

        await mongoose.connect(process.env.MONGO_URL,{

        useNewUrlParser: true,

        useUnifiedTopology: true

            })

            .then((conn) => {

                console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen.white);

                //do other things

            })

    }catch(error){

        console.log(`Mongodb Server Issue ${error}`.bgRed.white);

    }

};




module.exports = connectDB;