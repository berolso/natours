const fs = require('fs'); //93
const mongoose = require('mongoose'); //82
const dotenv = require('dotenv'); //67
const Tour = require('./../../models/tourModel'); //93
const Review = require('./../../models/reviewModel'); //165
const User = require('./../../models/userModel'); //165
//67
dotenv.config({ path: './config.env' });
console.log(Tour);
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

//READ JSON FILE
//93, 149
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
//165
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
//165
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORT DATA INTO DB
//93, 165
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); //165
    await Review.create(reviews); //165
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DB
//93, 165
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany(); //165
    await Review.deleteMany(); //165
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//93
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
