require('./models/Firstlist');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3800;
const mongoose = require('mongoose');
const path = require('path');
const firstRoutes = require('./routes/firstRoutes');

app.use(cors());

app.use(firstRoutes);

const mongoUri = 'mongodb+srv://pranay_projectnewm:Saturday1415@cluster0.bbunj.mongodb.net/newM?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
});

app.use((req,res,next)=>{
  res.set({
    'Acces-Control-Allow-Origin': 'https://www.juiy.in',
          'Access-Control-Allow-Credentials' : true,
          'Acces-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
          'Acces-Control-Allow-Headers': 'Content-Type, Accept, Authorization'
   // 'Content-Type': 'text/plain',
  }) 
  next(); 
});
  
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//app.get('/', (req, res) => {
  //  res.send('hello');
//})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})