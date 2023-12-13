const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const cloudinary = require('cloudinary').v2;


const userRoute = require("../Route/UserRoute");
const listenerRoute = require("../Route/ListenerRoute");
const musicRoute = require("../Route/musicRoute");
const dotenv = require("dotenv").config();
const PORT = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require('../middleware/errorMiddleware')
const path = require("path");
const playlistRoutes=require('../Route/PlayListRoute')
const advertRoutes = require('../Route/advertRoute');
const serverPath = path.resolve(__dirname, "server.js");
require(serverPath);

app.get("/", (req, res) => {
  res.send("Home page");
});
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'ds5nnf5hi',
  api_key: '362823846319858',
  api_secret: 'kjlomN4fuFuRsl06Csmsp3yLt0M',
});



//middlewaress
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//route middleware
//Routes middleware
app.use("/api/users", userRoute);
app.use("/api/listeners", listenerRoute);
app.use("/api/musics", musicRoute);
app.use('/api/playlists', playlistRoutes);
app.use('/api/advertisements',advertRoutes)

// error handler
app.use(errorHandler)


mongoose
  .connect(
    `mongodb+srv://akinwumisehinde:sahar@cluster0.3fqmwzt.mongodb.net/imis?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Port now starting on Port ${PORT}`);
    });
  }) //sahar
  .catch((err) => console.log(err));
