const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

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
            req.query.soPhanTuTrenTrang = 0
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
                            $regex: '.*' + req.query.tuKhoa + '.*',
                            $options: 'i'
                        }
                    }
                )
                .limit(req.query.soPhanTuTrenTrang)
                .skip((req.query.soTrang - 1) * req.query.soPhanTuTrenTrang)
            
            
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: list
                })
        }
        else {
            const list = await Movie
                .find()
                .limit(req.query.soPhanTuTrenTrang)
                .skip((req.query.soTrang - 1) * req.query.soPhanTuTrenTrang)
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: list
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})



module.exports = router