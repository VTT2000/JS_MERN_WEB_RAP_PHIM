const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const Movie = require('../models/Movie')

// cái này đẩy lên csdl làm xong hết api xóa đi
router.post('/post', async (req, res) => {

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
        if (!tenPhim || !trailer || !hinhAnh || !moTa) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenPhim and/or trailer and/or hinhAnh and/or moTa'
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
        const newMovie = new Movie({
            tenPhim,
            biDanh,
            trailer,
            hinhAnh,
            moTa,
            ngayKhoiChieu,
            danhGia
        })
        await newMovie.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'Movie created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

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
            .json(
                listJsonRespone
            )
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

module.exports = router