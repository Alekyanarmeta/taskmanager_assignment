const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const userRoutes = require('./controllers/user');
const taskRoutes = require('./controllers/task');


dotenv.config();
const PORT = process.env.PORT || port;


app.use(express.json());

const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${port}`);
});