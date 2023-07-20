require('dotenv').config();
const express = require('express');
const app = express();
const http = require("http").Server(app);
const cors = require('cors');
const ImageKit = require("imagekit");
const sequelize = require('./db.js');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const commentController = require('./controllers/commentController.js');
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

const PORT = process.env.PORT || 5000;

const imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    console.log(`${socket.id}user disconnected`);
  });
});

app.use('/', router);
app.get('/', function (req, res) {
  const result = imagekit.getAuthenticationParameters();
  res.status(200).send(result);
});
app.post('/comment/create', async (req, res) => {
  const comment = await commentController.create(req.body);
  io.emit("new-comment", { comment });
  res.status(200).json(comment);
});
app.get('/comment/all/:itemId', commentController.getAll);
app.delete('/comment/delete/:id', async (req, res) => {
  const id = await commentController.delete(req.params);
  io.emit("delete-comment", { id });
  res.status(200).json(id);
});

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
