require('dotenv').config()
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bodyParser = require('body-parser');


const app = express();

const contactformRouter = require('./routers/contactform_router')
const userRouter = require('./routers/user_router')
const portfolioRouter = require('./routers/portfolio_router');
const router = require('./routers/user_router');

app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true})) 
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

app.use(cors({
  origin: '*'
}))

// For uploading of files into cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Fraction',
    },
});

const fileParser = multer({ storage: storage });

// multer-cloudinary routes
app.post('/api/media/upload', fileParser.single('media_file'), (req, res) => {
    if (!req.file) {
        res.statusCode = 500
        return res.json({
            msg: 'failed to upload file'
        })
    }

    res.json(req.file)
})

// API endpoint routes
app.use('/api/user', userRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/contactform', contactformRouter)

// LISTENER
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    console.log('DB connected')

    // boot up app
    app.listen(process.env.PORT, () => {
        console.log('Fraction BE running on port: ', process.env.PORT);
    })
})
.catch(err => {
    console.log('err when connecting: ' + err)
})