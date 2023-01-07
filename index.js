const express = require('express')
const app = express()
const mongoose = require('mongoose');
const multer = require('multer')
const path = require("path")
const bodyParser = require('body-parser')
const Auth = require("./src/Routes/Auth")
const Blog = require("./src/Routes/Blog")


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // mengarahakan destination ke file images
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        // agar nama file nya memiliki gettima dan di akahir ada original file
        cb(null, new Date().getTime() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        // untuk mencari type nya
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg"

    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


app.use(bodyParser.json())
app.use(allowCrossDomain);
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"))
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/v1/Auth", Auth)
app.use("/v1/Blog", Blog)

// set up
mongoose.set('strictQuery', true);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data });

})
// pemanngilan mongo db tidak bisa menggunakan indihome
mongoose.connect('mongodb://fahri:fahri@ac-ti34yso-shard-00-00.dr0ih0u.mongodb.net:27017,ac-ti34yso-shard-00-01.dr0ih0u.mongodb.net:27017,ac-ti34yso-shard-00-02.dr0ih0u.mongodb.net:27017/Mern_Stack?ssl=true&replicaSet=atlas-xuz98e-shard-0&authSource=admin&retryWrites=true&w=majority')
    .then(() => { console.log("mongoDB connect") })
    .catch(() => console.log("MOngodb 404 not found"))

app.listen(4000, () => {
    console.log("open in browser")
})

