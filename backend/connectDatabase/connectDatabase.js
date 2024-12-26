const mongoose=require('mongoose');

const connectDatabase=async()=>{
    let URI= process.env.MONGO_URI;
    try{
    await mongoose.connect(URI);
    console.log("Connected Successfully");
    }catch(e){
        console.error(e);
    }
}

module.exports={connectDatabase};