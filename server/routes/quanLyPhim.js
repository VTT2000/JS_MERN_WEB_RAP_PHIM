const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken1 = require('../middleware/auth1')
//const fs = require('node:fs')
//const buffer = require('node:buffer')

const Movie = require('../models/Movie')

//-------------------------------------------------
router.get('/LayDanhSachPhim', async (req, res) => {
    try {
        const movies = await Movie.find()
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
                        }
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
            const list = await Movie.find()
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
                    }
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
                    }
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
                    }
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
                    }
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
        const movie = await Movie.findOne({ tenPhim })
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
        if (hinhAnh.match(regex) === null) {
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





module.exports = router