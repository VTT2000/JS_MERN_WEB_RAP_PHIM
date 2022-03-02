const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const CinemaSystem = require('../models/CinemaSystem')
const CinemaCluster = require('../models/CinemaCluster')
const Cinema = require('../models/Cinema')

// cái này đẩy lên csdl làm xong hết api xóa đi
router.post('/post0', async (req, res) => {

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

router.post('/post1', async (req, res) => {

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

router.post('/post2', async (req, res) => {

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

//-------------------------------------------------
router.get('/LayThongTinHeThongRap', async (req, res) => {
    try {
        const cinemaSystems = await CinemaSystem.find()
        var listJsonRespone = new Array()
        cinemaSystems.forEach(e => {
            listJsonRespone.push(
                {
                    maHeThongRap: e._id,
                    tenHeThongRap: e.tenHeThongRap,
                    biDanh: e.biDanh,
                    logo: e.logo
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