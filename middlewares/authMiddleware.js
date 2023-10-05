//middleware I am using for authentication purpose
const JWT =require('jsonwebtoken')

//callback function
module.exports = async(req,res,next) => {
    try{
    const token =req.headers['authorization'].split(" ")[1]  //split method is using for getting token directly
    JWT.verify(token,process.env.JWT_SECRET,(err,decode) =>{
        if(err){
            return res
            .status(200)
            .send({
                message:"AUTH failed",
                success:false,
            });
        }else{
            req.body.userId = decode.id;
            next();
        }
    });
}catch(error){
    console.log(error);
    res.status(401).send({
        message: "AUTHENTICATION FAILED",
        success:false
    });
}
}