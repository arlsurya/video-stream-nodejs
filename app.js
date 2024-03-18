const express = require('express');
const monitor = require('express-status-monitor');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(monitor());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html')); // sending static html file
})

app.get('/playVideo', (req, res) => { // this route will help to play the video
try {
    const range = req.headers.range;
    if(!range) return res.status(400).send('Range Not Found');
    const videoPath = path.join(__dirname, 'videos','tom&jerry.mp4');
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10**6; // 1MB
    const start = Number(range.replace(/\D/g, '')); // remove non-digit characters
    const end = Math.min(start + CHUNK_SIZE, videoSize + 1); 
    const contentLength = end - start + 1;
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    };

    res.writeHead(206,headers) // writing custom headers with 206 status code
    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);
    
} catch (error) {
    console.log(error);
    return res.status(500).json({
        statusCode:500,
        message:"Internal Server Error",
    })
    
}

})


app.listen(5000, (_) => {
    console.log('Server is running on port 5000');
})