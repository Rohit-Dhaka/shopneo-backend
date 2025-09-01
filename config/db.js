const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();


const ConnectDb = async function(){
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("app connect to database")        

    }
    catch(error){
        process.exit(1)
    }
}
module.exports = ConnectDb