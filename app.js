require('./models/Firstlist');
const express = require('express')
const app = express()
const port = 6000
const mongoose = require('mongoose');
const path = require('path');
const firstRoutes = require('./routes/firstRoutes');

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

app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})