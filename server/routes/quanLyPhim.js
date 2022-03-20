const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken1 = require('../middleware/auth1')
//const fs = require('node:fs')
//const buffer = require('node:buffer')

const Movie = require('../models/Movie')
const MovieSchedule = require('../models/MovieSchedule')
const CinemaCluster = require('../models/CinemaCluster')

//-------------------------------------------------
router.get('/LayDanhSachPhim', async (req, res) => {
    try {
        const movies = await Movie.find({ daXoa: false })
        var listJsonRespone = new Array()
        movies.forEach(e => {
            listJsonRespone.push(
                {
                    maPhim: e._id,
                    tenPhim: e.tenPhim,
                    biDanh: e.biDanh,
                    trailer: e.trailer,
                    hinhAnh: e.hinhAnh,
                    moTa: e.moTa,
                    ngayKhoiChieu: e.ngayKhoiChieu,
                    danhGia: e.danhGia
                }
            )
        })

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: listJsonRespone
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/LayDanhSachPhimPhanTrang', async (req, res) => {
    try {
        if (req.query.soPhanTuTrenTrang == null) {
            req.query.soPhanTuTrenTrang = 2
        }
        if (req.query.soTrang == null) {
            req.query.soTrang = 1
        }
        if (req.query.tenPhim) {
            const list = await Movie
                .find(
                    {
                        tenPhim:
                        {
                            $regex: '.*' + req.query.tenPhim + '.*',
                            $options: 'i'
                        },
                        daXoa: false
                    }
                )
            var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang
            var end = (list.length > start + req.query.soPhanTuTrenTrang) ? (start + req.query.soPhanTuTrenTrang) : (list.length)
            var jsonRespone = new Object()
            jsonRespone.currentPage = req.query.soTrang
            jsonRespone.count = list.slice(start, end).length
            jsonRespone.totalPages = parseInt((list.length % req.query.soPhanTuTrenTrang != 0) ? ((list.length / req.query.soPhanTuTrenTrang) + 1) : (list.length / req.query.soPhanTuTrenTrang))
            jsonRespone.totalCount = list.length
            var newArray = new Array()
            list.slice(start, end).forEach(e => {
                newArray.push({
                    maPhim: e._id,
                    tenPhim: e.tenPhim,
                    biDanh: e.biDanh,
                    trailer: e.trailer,
                    hinhAnh: e.hinhAnh,
                    moTa: e.moTa,
                    ngayKhoiChieu: e.ngayKhoiChieu,
                    danhGia: e.danhGia
                })
            })
            jsonRespone.items = newArray
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: jsonRespone
                })
        }
        else {
            const list = await Movie.find({ daXoa: false })
            var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang
            var end = (list.length > start + req.query.soPhanTuTrenTrang) ? (start + req.query.soPhanTuTrenTrang) : (list.length)
            var jsonRespone = new Object()
            jsonRespone.currentPage = req.query.soTrang
            jsonRespone.count = list.slice(start, end).length
            jsonRespone.totalPages = parseInt((list.length % req.query.soPhanTuTrenTrang != 0) ? ((list.length / req.query.soPhanTuTrenTrang) + 1) : (list.length / req.query.soPhanTuTrenTrang))
            jsonRespone.totalCount = list.length
            var newArray = new Array()
            list.slice(start, end).forEach(e => {
                newArray.push({
                    maPhim: e._id,
                    tenPhim: e.tenPhim,
                    biDanh: e.biDanh,
                    trailer: e.trailer,
                    hinhAnh: e.hinhAnh,
                    moTa: e.moTa,
                    ngayKhoiChieu: e.ngayKhoiChieu,
                    danhGia: e.danhGia
                })
            })
            jsonRespone.items = newArray
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: jsonRespone
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/LayDanhSachPhimTheoNgay', async (req, res) => {
    try {
        if (req.query.soPhanTuTrenTrang == null) {
            req.query.soPhanTuTrenTrang = 2
        }
        if (req.query.soTrang == null) {
            req.query.soTrang = 1
        }
        if (req.query.tenPhim) {
            var list, start0, end0
            if (req.query.tuNgay) {
                const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
                if (req.query.tuNgay.match(regex) === null) {
                    return res
                        .status(200)
                        .json({
                            message: "Xử lý thất bại",
                            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                        })
                }
                start0 = req.query.tuNgay.substring(3, 6) + req.query.tuNgay.substring(0, 3) + req.query.tuNgay.substring(6, 10)
            }
            else {
                start0 = new Date()
            }
            if (req.query.denNgay) {
                const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
                if (req.query.denNgay.match(regex) === null) {
                    return res
                        .status(200)
                        .json({
                            message: "Xử lý thất bại",
                            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                        })
                }
                end0 = req.query.denNgay.substring(3, 6) + req.query.denNgay.substring(0, 3) + req.query.denNgay.substring(6, 10)

                list = await Movie.find({
                    tenPhim:
                    {
                        $regex: '.*' + req.query.tenPhim + '.*',
                        $options: 'i'
                    },
                    ngayKhoiChieu: {
                        $gte: start0,
                        $lte: end0
                    },
                    daXoa: false
                })
            }
            else {
                list = await Movie.find({
                    tenPhim:
                    {
                        $regex: '.*' + req.query.tenPhim + '.*',
                        $options: 'i'
                    },
                    ngayKhoiChieu: {
                        $gte: start0
                    },
                    daXoa: false
                })
            }

            var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang
            var end = (list.length > start + req.query.soPhanTuTrenTrang) ? (start + req.query.soPhanTuTrenTrang) : (list.length)
            var jsonRespone = new Object()
            jsonRespone.currentPage = req.query.soTrang
            jsonRespone.count = list.slice(start, end).length
            jsonRespone.totalPages = parseInt((list.length % req.query.soPhanTuTrenTrang != 0) ? ((list.length / req.query.soPhanTuTrenTrang) + 1) : (list.length / req.query.soPhanTuTrenTrang))
            jsonRespone.totalCount = list.length
            var newArray = new Array()
            list.slice(start, end).forEach(e => {
                newArray.push({
                    maPhim: e._id,
                    tenPhim: e.tenPhim,
                    biDanh: e.biDanh,
                    trailer: e.trailer,
                    hinhAnh: e.hinhAnh,
                    moTa: e.moTa,
                    ngayKhoiChieu: e.ngayKhoiChieu,
                    danhGia: e.danhGia
                })
            })
            jsonRespone.items = newArray
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: newArray
                })
        }
        else {
            var list, start0, end0
            if (req.query.tuNgay) {
                const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
                if (req.query.tuNgay.match(regex) === null) {
                    return res
                        .status(200)
                        .json({
                            message: "Xử lý thất bại",
                            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                        })
                }
                start0 = req.query.tuNgay.substring(3, 6) + req.query.tuNgay.substring(0, 3) + req.query.tuNgay.substring(6, 10)
            }
            else {
                start0 = new Date()
            }
            if (req.query.denNgay) {
                const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
                if (req.query.denNgay.match(regex) === null) {
                    return res
                        .status(200)
                        .json({
                            message: "Xử lý thất bại",
                            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                        })
                }
                end0 = req.query.denNgay.substring(3, 6) + req.query.denNgay.substring(0, 3) + req.query.denNgay.substring(6, 10)

                list = await Movie.find({
                    tenPhim:
                    {
                        $regex: '.*' + req.query.tenPhim + '.*',
                        $options: 'i'
                    },
                    ngayKhoiChieu: {
                        $gte: start0,
                        $lte: end0
                    },
                    daXoa: false
                })
            }
            else {
                list = await Movie.find({
                    tenPhim:
                    {
                        $regex: '.*' + req.query.tenPhim + '.*',
                        $options: 'i'
                    },
                    ngayKhoiChieu: {
                        $gte: start0
                    },
                    daXoa: false
                })
            }

            var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang
            var end = (list.length > start + req.query.soPhanTuTrenTrang) ? (start + req.query.soPhanTuTrenTrang) : (list.length)
            var jsonRespone = new Object()
            jsonRespone.currentPage = req.query.soTrang
            jsonRespone.count = list.slice(start, end).length
            jsonRespone.totalPages = parseInt((list.length % req.query.soPhanTuTrenTrang != 0) ? ((list.length / req.query.soPhanTuTrenTrang) + 1) : (list.length / req.query.soPhanTuTrenTrang))
            jsonRespone.totalCount = list.length
            var newArray = new Array()
            list.slice(start, end).forEach(e => {
                newArray.push({
                    maPhim: e._id,
                    tenPhim: e.tenPhim,
                    biDanh: e.biDanh,
                    trailer: e.trailer,
                    hinhAnh: e.hinhAnh,
                    moTa: e.moTa,
                    ngayKhoiChieu: e.ngayKhoiChieu,
                    danhGia: e.danhGia
                })
            })
            jsonRespone.items = newArray
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: newArray
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/ThemPhim', verifyToken1, async (req, res) => {
    const {
        tenPhim,
        biDanh,
        trailer,
        hinhAnh,
        moTa,
        ngayKhoiChieu,
        danhGia
    } = req.body
    try {

        // Simple validation
        if (!tenPhim) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenPhim'
                    })
                )
        }
        // check for existing user
        const movie = await Movie.findOne({ tenPhim, daXoa: false })
        if (movie) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenPhim already taken'
                })
        }

        const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        if (ngayKhoiChieu.match(regex) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                })
        }
        var ngayMMddYYYY = ngayKhoiChieu.substring(3, 6) + ngayKhoiChieu.substring(0, 3) + ngayKhoiChieu.denNgay.substring(6, 10)

        const regexHinhAnh = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;
        if (hinhAnh.match(regexHinhAnh) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Link hình ảnh không hợp lệ, định dạng là png,jpg,jpeg,gif !"
                })
        }
        /*
        var filepath = '../public/image/'
        var filepathFull = filepath + hinhAnh.name
        var file_temp = hinhAnh.tmp_name
        const data = new Uint8Array(buffer.from(file_temp));
        fs.writeFile(filepathFull, data,(err) => {
            if (err) throw err
            console.log('The file has been saved!')
        })
        */

        const newMovie = new Movie({
            tenPhim,
            biDanh,
            trailer,
            hinhAnh,
            moTa,
            ngayKhoiChieu: ngayMMddYYYY,
            danhGia,
            daXoa
        })
        await newMovie.save()

        var result = new Object
        result.maPhim = newMovie._id
        result.tenPhim = newMovie.tenPhim
        result.biDanh = newMovie.biDanh
        result.trailer = newMovie.trailer
        result.hinhAnh = newMovie.hinhAnh
        result.moTa = newMovie.moTa
        result.ngayKhoiChieu = newMovie.ngayKhoiChieu
        result.danhGia = newMovie.danhGia
        result.daXoa = newMovie.daXoa

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: result
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

///--------------------------------------------------
const multer = require("multer");
const path = require('path');
const verifyTokenAdmin = require('../middleware/auth1')
router.post('/ThemPhimUploadHinh', async (req, res) => {
    const {
        tenPhim,
        biDanh,
        trailer,
        moTa,
        ngayKhoiChieu,
        danhGia
    } = req.body
    const {
        hinhAnh
    } = req.file
    try {

        // Simple validation
        if (!tenPhim) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenPhim'
                    })
                )
        }
        // check for existing user
        const movie = await Movie.findOne({ tenPhim, daXoa: false })
        if (movie) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenPhim already taken'
                })
        }

        const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        if (ngayKhoiChieu.match(regex) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                })
        }
        var ngayMMddYYYY = ngayKhoiChieu.substring(3, 6) + ngayKhoiChieu.substring(0, 3) + ngayKhoiChieu.substring(6, 10)
        // up hinh https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/images/');
            },
            // By default, multer removes file extensions so let's add them back
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        const imageFilter = function (req, file, cb) {
            // Accept images only
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        };
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single('hinhanh');
        upload(req, res, function (err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields, if there were any
            if (req.fileValidationError) {
                return res.send(req.fileValidationError);
            }
            else if (!req.file) {
                return res.json({ content: 'Please select an image to upload' });
            }
            else if (err instanceof multer.MulterError) {
                return res.send(err);
            }
            else if (err) {
                return res.send(err);
            }

            // Display uploaded image for user validation
            //res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
            const newMovie = new Movie({
                tenPhim,
                biDanh,
                trailer,
                hinhAnh: req.file.path,
                moTa,
                ngayKhoiChieu: ngayMMddYYYY,
                danhGia,
                daXoa
            })
            await newMovie.save()

            var result = new Object
            result.maPhim = newMovie._id
            result.tenPhim = newMovie.tenPhim
            result.biDanh = newMovie.biDanh
            result.trailer = newMovie.trailer
            result.hinhAnh = newMovie.hinhAnh
            result.moTa = newMovie.moTa
            result.ngayKhoiChieu = newMovie.ngayKhoiChieu
            result.danhGia = newMovie.danhGia
            result.daXoa = newMovie.daXoa

            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: result
                })
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/CapNhatPhimUpload', verifyTokenAdmin, async (req, res) => {
    const {
        maPhim,
        tenPhim,
        biDanh,
        trailer,
        moTa,
        ngayKhoiChieu,
        danhGia
    } = req.body
    const {
        hinhAnh
    } = req.file
    try {

        // Simple validation
        if (!tenPhim) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenPhim'
                    })
                )
        }

        const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        if (ngayKhoiChieu.match(regex) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                })
        }
        var ngayMMddYYYY = ngayKhoiChieu.substring(3, 6) + ngayKhoiChieu.substring(0, 3) + ngayKhoiChieu.substring(6, 10)
        // up hinh https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/images/');
            },
            // By default, multer removes file extensions so let's add them back
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        const imageFilter = function (req, file, cb) {
            // Accept images only
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        };
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single('hinhanh');
        upload(req, res, async function (err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields, if there were any
            if (req.fileValidationError) {
                return res.send(req.fileValidationError);
            }
            else if (!req.file) {
                return res.json({ content: 'Please select an image to upload' });
            }
            else if (err instanceof multer.MulterError) {
                return res.send(err);
            }
            else if (err) {
                return res.send(err);
            }

            // Display uploaded image for user validation
            //res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
            const newMovie = new Movie({
                tenPhim,
                biDanh,
                trailer,
                hinhAnh: req.file.path,
                moTa,
                ngayKhoiChieu: ngayMMddYYYY,
                danhGia,
                daXoa
            })
            const movieUpdated = await Movie.findOneAndUpdate(
                { _id: maPhim },
                newMovie
                , { new: true }
            )
            if (!movieUpdated) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        content: 'Movie updated error'
                    })
            }
            else {
                var result = new Object
                result.maPhim = newMovie._id
                result.tenPhim = newMovie.tenPhim
                result.biDanh = newMovie.biDanh
                result.trailer = newMovie.trailer
                result.hinhAnh = newMovie.hinhAnh
                result.moTa = newMovie.moTa
                result.ngayKhoiChieu = newMovie.ngayKhoiChieu
                result.danhGia = newMovie.danhGia
                result.daXoa = newMovie.daXoa

                return res
                    .status(200)
                    .json({
                        message: "Xử lý thành công",
                        content: result
                    })
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})






// 5 api giua ?










router.post('/CapNhatPhim', verifyToken1, async (req, res) => {
    const {
        tenPhim,
        biDanh,
        trailer,
        hinhAnh,
        moTa,
        ngayKhoiChieu,
        danhGia
    } = req.body
    try {

        // Simple validation
        if (!tenPhim) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenPhim'
                    })
                )
        }
        // check for existing user
        const movie = await Movie.findOne({ tenPhim, daXoa: false })
        if (movie) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenPhim already taken'
                })
        }

        const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        if (ngayKhoiChieu.match(regex) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !"
                })
        }
        var ngayMMddYYYY = req.query.denNgay.substring(3, 6) + req.query.denNgay.substring(0, 3) + req.query.denNgay.substring(6, 10)

        const regexHinhAnh = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;
        if (hinhAnh.match(regexHinhAnh) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Link hình ảnh không hợp lệ, định dạng là png,jpg,jpeg,gif !"
                })
        }
        /*
        var filepath = '../public/image/'
        var filepathFull = filepath + hinhAnh.name
        var file_temp = hinhAnh.tmp_name
        const data = new Uint8Array(buffer.from(file_temp));
        fs.writeFile(filepathFull, data,(err) => {
            if (err) throw err
            console.log('The file has been saved!')
        })
        */

        const newMovie = new Movie({
            tenPhim,
            biDanh,
            trailer,
            hinhAnh,
            moTa,
            ngayKhoiChieu: ngayMMddYYYY,
            danhGia,
            daXoa
        })
        await newMovie.save()

        var result = new Object
        result.maPhim = newMovie._id
        result.tenPhim = newMovie.tenPhim
        result.biDanh = newMovie.biDanh
        result.trailer = newMovie.trailer
        result.hinhAnh = newMovie.hinhAnh
        result.moTa = newMovie.moTa
        result.ngayKhoiChieu = newMovie.ngayKhoiChieu
        result.danhGia = newMovie.danhGia
        result.daXoa = newMovie.daXoa

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: result
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.delete('/XoaPhim', verifyToken1, async (req, res) => {
    try {
        const moviedeleted = await Movie.findOneAndUpdate({ _id: req.query.MaPhim, daXoa: false }, { daXoa: true }, { new: true })
        // xoa thuc su
        //const moviedeleted = await Movie.findOneAndDelete({ _id: req.query.MaPhim, daXoa: false })
        if (!moviedeleted) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Phim not found or user not authorised'
                })
        }
        else {
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: "Xóa thành công !"
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/LayThongTinPhim', async (req, res) => {
    try {
        if (!req.query.MaPhim) {
            return res
                .status(401)
                .json({
                    success: 'Xử lý thất bại',
                    message: 'Value MaPhim is invalid'
                })
        }
        else {
            const movieFind = await Movie.findOne({ daXoa: false, _id: req.query.MaPhim })
            if (!movieFind) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Phim not found'
                    })
            }
            else {
                var newArray = new Array()
                const listLichChieu = await MovieSchedule.find({ movie: movieFind._id }).populate("movie")
                    .populate({
                        path: 'cinema',
                        populate: {
                            path: 'maCumRap',
                            populate: {
                                path: 'maHeThongRap'
                            }
                        }
                    })

                for (let x = 0; x < listLichChieu.length; x++) {
                    newArray[x] = new Object()
                    newArray[x].maLichChieu = listLichChieu[x]._id
                    newArray[x].maRap = listLichChieu[x].cinema._id
                    newArray[x].maPhim = listLichChieu[x].movie._id
                    newArray[x].tenPhim = listLichChieu[x].movie.tenPhim
                    newArray[x].ngayChieuGioChieu = listLichChieu[x].ngayChieuGioChieu
                    newArray[x].giaVe = listLichChieu[x].giaVe
                    newArray[x].thoiLuong = listLichChieu[x].thoiLuong
                    newArray[x].thongTinRap = new Object()
                    newArray[x].thongTinRap.maRap = listLichChieu[x].cinema._id
                    newArray[x].thongTinRap.tenRap = listLichChieu[x].cinema.tenRap
                    newArray[x].thongTinRap.maCumRap = listLichChieu[x].cinema.maCumRap._id
                    newArray[x].thongTinRap.tenCumRap = listLichChieu[x].cinema.maCumRap.tenCumRap
                    newArray[x].thongTinRap.maHeThongRap = listLichChieu[x].cinema.maCumRap.maHeThongRap._id
                    newArray[x].thongTinRap.tenHeThongRap = listLichChieu[x].cinema.maCumRap.maHeThongRap.tenHeThongRap
                }

                var responseResult = new Object()
                responseResult.maPhim = movieFind._id
                responseResult.tenPhim = movieFind.tenPhim
                responseResult.biDanh = movieFind.biDanh
                responseResult.trailer = movieFind.biDanh
                responseResult.hinhAnh = movieFind.hinhAnh
                responseResult.moTa = movieFind.moTa
                responseResult.ngayKhoiChieu = movieFind.ngayKhoiChieu
                responseResult.danhGia = movieFind.danhGia
                responseResult.lichChieu = newArray

                return res
                    .status(200)
                    .json({
                        message: "Xử lý thành công",
                        content: responseResult
                    })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

module.exports = router