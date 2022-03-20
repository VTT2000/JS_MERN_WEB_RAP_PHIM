require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')


const multer = require('multer');
const path = require('path');


// Cac route trang user
const qlNguoiDungRouter = require('./routes/quanLyNguoiDung')
const qlPhimRouter = require('./routes/quanLyPhim')
const qlRapRouter = require('./routes/quanLyRap')
const qlPost = require('./routes/post')

// Cac route trang admin
//const adminUserTypeRouter = require('./routesAdmin/usertype')
//const adminUserRouter = require('./routesAdmin/user')

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}
// Kết nối cloud mongo db
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@banverapphimwebjs.nn0hi.mongodb.net/BanVeRapPhimWebJS?retryWrites=true&w=majority`)
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
connectDB()

const app = express()
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/api/QuanLyNguoiDung', qlNguoiDungRouter)
app.use('/api/QuanLyPhim', qlPhimRouter)
app.use('/api/QuanLyRap', qlRapRouter)
app.use('/api/posts', qlPost)

app.use(express.static(__dirname + '/public'));


//app.use(express.static('public')); 
//app.use('/images', express.static('images'));

/*
app.use('/', function (req, res) {
    fs.readFile('', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
})
*/
/*
app.get('/user/:uid/photos/:file', function(req, res){
    var uid = req.params.uid
      , file = req.params.file;
  
    req.user.mayViewFilesFrom(uid, function(yes){
      if (yes) {
        res.sendFile('/uploads/' + uid + '/' + file);
      } else {
        res.send(403, 'Sorry! you cant see that.');
      }
    });
  });
  */
//app.use('/admin/usertypes', adminUserTypeRouter)
//app.use('/admin/users', adminUserRouter)

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

