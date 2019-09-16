const mongoose = require('mongoose'); //82
const dotenv = require('dotenv'); //67

//122
process.on('uncaughtException', err => {
  console.log('uncaught exception! shutting down..');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); //67
const app = require('./app'); //63

//82
const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

//82
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful'));

////START SERVER
//52, 63, 67, 121
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`running on port ${port}...`);
  console.log(process.env.NODE_ENV);
});

//121
process.on('unhandledRejection', err => {
  console.log('unhandled rejection! shutting down..');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
