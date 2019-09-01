const dotenv = require('dotenv'); //67
//67
dotenv.config({ path: './config.env' });
// console.log(process.env);

const app = require('./app'); //63

////START SERVER
//52, 63, 67
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running on port ${port}...`);
});
