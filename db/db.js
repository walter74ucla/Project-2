const mongoose = require('mongoose');
// mongoose is an odm
const connectionString = process.env.MONGODB_URI;
// db name is habit


mongoose.connect(connectionString, { useNewUrlParser: true,
                                     useUnifiedTopology: true,
                                     useCreateIndex: true,
                                     useFindAndModify: false
                                    });


mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${connectionString}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose error: ', err);
});
