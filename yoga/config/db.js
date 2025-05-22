const mongoose=require('mongoose');
const res = require("express/lib/response");


connectDB=async function(url){

        await mongoose.connect(url)
            .then(()=>{
            console.log("Connected to DB")})
            .catch((err)=>{
            console.log(err)
            })


}
module.exports=connectDB;