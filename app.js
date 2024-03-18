const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html')); // sending static html file
})

app.get('/playVideo', (req, res) => { // this route will help to play the video

})


app.listen(5000, (_) => {
    console.log('Server is running on port 5000');
})