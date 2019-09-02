const mongoose = require('mongoose'); //82
const dotenv = require('dotenv'); //67
const app = require('./app'); //63
//67
dotenv.config({ path: './config.env' });

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
//52, 63, 67
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running on port ${port}...`);
});
