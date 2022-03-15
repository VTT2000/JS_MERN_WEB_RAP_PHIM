const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const CinemaSystem = require('../models/CinemaSystem')
const CinemaCluster = require('../models/CinemaCluster')
const Cinema = require('../models/Cinema')



//-------------------------------------------------
router.get('/LayThongTinHeThongRap', async (req, res) => {
    try {
        if(req.query.maHeThongRap == null){
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
                .json({
                    message: "Xử lý thành công",
                    content: listJsonRespone
                })
        }
        else{
            const cinemaSystems = await CinemaSystem.find({_id: req.query.maHeThongRap})
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: cinemaSystems
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/LayThongTinCumRapTheoHeThong', async (req, res) => {
    try {
        if(!req.query.maHeThongRap){
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Mã hệ thống rạp không tồn tại !"
                })
        }
        else{
            const cinemaClusters = await CinemaCluster.find({ maHeThongRap: req.query.maHeThongRap})
            var listJsonRespone = new Array()
            cinemaClusters.forEach(e => {
                listJsonRespone.push(
                    {
                        maCumRap: e._id,
                        tenCumRap: e.tenCumRap,
                        diaChi: e.diaChi
                    }
                )
            })
            for (let index = 0; index < listJsonRespone.length; index++) {
                const danhSachRapById = await Cinema.find({ maCumRap: listJsonRespone[index].maCumRap })
                var listJsonRespone0 = new Array()
                danhSachRapById.forEach(p => {
                    listJsonRespone0.push({ maRap: p._id, tenRap: p.tenRap })
                })
                listJsonRespone[index].danhSachRap = listJsonRespone0
            }
            
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listJsonRespone
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})



module.exports = router