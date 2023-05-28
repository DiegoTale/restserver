const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        const db = await mongoose.connect(process.env.MONGODB_ATLAS, 
            {
                // useNewUrlParse: true,
                useUnifiedTopology: true,
                // useCreateIndex: true,
                // useFindAndModify: false
            }
        );

        const url = `${db.connection.host}:${db.connection.port}`
        // console.log(`MongoDB conectado en: ${url}`);
        console.log("Base de datos online");

    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1); 
    }

}





module.exports = {
    dbConnection
}