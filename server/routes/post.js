const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth1')

const UserType = require('../models/UserType')
const User = require('../models/User')
const Movie = require('../models/Movie')
const MovieSchedule = require('../models/MovieSchedule')
const Cinema = require('../models/Cinema')
const CinemaCluster = require('../models/CinemaCluster')
const CinemaSystem = require('../models/CinemaSystem')
const BookTicket = require('../models/BookTicket')


router.post('/UserType', async (req, res) => {
    const {
        tenLoai
    } = req.body
    try {
        const newUserType = new UserType({
            tenLoai
        })
        await newUserType.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'UserType created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/Movie', async (req, res) => {

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

router.post('/CinemaSystem', async (req, res) => {

    const {
        tenHeThongRap,
        biDanh,
        logo
    } = req.body

    try {
        // Simple validation
        if (!tenHeThongRap || !biDanh || !logo) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenHeThongRap and/or biDanh and/or logo'
                    })
                )
        }
        // check for existing user
        const cinemaSystem = await CinemaSystem.findOne({ tenHeThongRap })
        if (cinemaSystem) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenHeThongRap already taken'
                })
        }
        const newCinemaSystem = new CinemaSystem({
            tenHeThongRap,
            biDanh,
            logo
        })
        await newCinemaSystem.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'CinemaSystem created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/CinemaCluster', async (req, res) => {

    const {
        tenCumRap,
        hinhAnh,
        diaChi,
        maHeThongRap
    } = req.body

    try {
        // Simple validation
        if (!maHeThongRap || !diaChi || !tenCumRap) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing maHeThongRap and/or diaChi and/or tenCumRap'
                    })
                )
        }
        // check for existing user
        const cinemaCluster = await CinemaCluster.findOne({ tenCumRap })
        if (cinemaCluster) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenCumRap already taken'
                })
        }
        const newCinemaCluster = new CinemaCluster({
            tenCumRap,
            hinhAnh,
            diaChi,
            maHeThongRap
        })
        await newCinemaCluster.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'CinemaCluster created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/Cinema', async (req, res) => {

    const {
        tenRap,
        maCumRap
    } = req.body

    try {
        // Simple validation
        if (!tenRap || !maCumRap) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tengRap and/or maCumRap'
                    })
                )
        }
        // check for existing user
        const cinema = await Cinema.findOne({ tenRap, maCumRap })
        if (cinema) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenRap and maCumRap already taken'
                })
        }
        const newCinema = new Cinema({
            tenRap,
            maCumRap
        })
        await newCinema.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'Cinema created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

//------------------------------------------------------
router.post('/MovieSchedule', async (req, res) => {

    const {
        movie,
        ngayChieuGioChieu,
        giaVe,
        cinema,
        thoiLuong
    } = req.body

    try {
        
        const newMovieSchedule = new MovieSchedule({
            movie,
            ngayChieuGioChieu,
            giaVe,
            cinema,
            thoiLuong
        })
        await newMovieSchedule.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'MovieSchedule created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})



module.exports = router