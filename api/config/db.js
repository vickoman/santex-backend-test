const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected");
    } catch(e){
        console.log("Something wrong happening connecting mongoDB");
        console.log(e);
        process.exit(1); // Get out of here MDF
    }
};

module.exports = dbConnection;