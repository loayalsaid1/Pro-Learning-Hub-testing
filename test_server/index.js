const express = require('express');
const http = require('http');
const fs = require('fs');
const ImageKit = require('imagekit');
const cors = require('cors');
const { Server: IO } = require('socket.io');
const socketIOLogic = require('./socketIO/server');
const db = require('./connect');
const authRouter = require('./routes/auth');
const lecturesRouter = require('./routes/lectures');
const questionsRouter = require('./routes/questions');
const repliesRouter = require('./routes/replies');
const announcementsRouter = require('./routes/announcements');
const commentsRouter = require('./routes/comments');

require('dotenv').config();
const port = 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


const io = new IO(server, {
  cors: {
    // Don't forget to set this properly
    origin: '*',
  }
})
app.set('io', io);
socketIOLogic(io);


app.use('/auth', authRouter);
app.use(lecturesRouter);
app.use(questionsRouter);
app.use(repliesRouter);
app.use(announcementsRouter);
app.use(commentsRouter);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Not found' });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});
if (!server.listening) {
  server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

module.exports = server;
