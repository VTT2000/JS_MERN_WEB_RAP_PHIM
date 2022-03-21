const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const MovieSchedule = require('../models/MovieSchedule')
const BookTicket = require('../models/BookTicket')
const User = require('../models/User');
const verifyTokenAdmin = require('../middleware/auth1')
const verifyToken = require('../models/auth0')

//-------------------------------------------------
router.get('/LayDanhSachPhongVe', async (req, res) => {
    if (!req.query.MaLichChieu) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing MaLichChieu"
            })
    }

    try {
        var list0 = new Object()
        const lichChieu = await MovieSchedule.findOne({ _id: req.query.MaLichChieu })
            .populate({
                path: 'movie'
            })
            .populate({
                path: 'cinema',
                populate: {
                    path: 'maCumRap',
                    populate: {
                        path: 'maHeThongRap'
                    }
                }
            })
        list0.maLichChieu = lichChieu._id
        list0.tenCumRap = lichChieu.cinema.maCumRap.tenCumRap
        list0.tenRap = lichChieu.cinema.tenRap
        list0.diaChi = lichChieu.cinema.maCumRap.diaChi
        list0.tenPhim = lichChieu.movie.tenPhim
        list0.hinhAnh = lichChieu.movie.hinhAnh
        list0.ngayChieu = lichChieu.ngayChieuGioChieu.substring(0, 10).replaceAll("-", "/")
        list0.gioChieu = lichChieu.ngayChieuGioChieu.substring(11, 16)
        var list1 = new Array()
        const danhSachSeats = await BookTicket.find({ maLichChieu: req.query.MaLichChieu })
            .populate({
                path: 'maNguoiDung'
            })
            .populate({
                path: 'maLichChieu',
                populate: {
                    path: 'cinema',
                    populate: {
                        path: 'maCumRap',
                        populate: {
                            path: 'maHeThongRap'
                        }
                    }
                }
            })
        for (let x = 0; x < danhSachSeats.length; x++) {
            const show = danhSachSeats[x]
            for (let y = 0; y < danhSachSeats[x].danhSachVe.length; y++) {
                list1.push({
                    maGhe: show.danhSachVe[y].maGhe,
                    tenGhe: null,
                    maRap: show.maLichChieu.cinema._id,
                    loaiGhe: null,
                    stt: null,
                    giaVe: show.danhSachVe[y].giaVe,
                    daDat: true,
                    taiKhoanNguoiDat: show.maNguoiDung.taiKhoan
                })
            }
        }

        var result = new Object()
        result.thongTinPhim = list0
        result.danhSachGhe = list1

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



router.post('/DatVe', verifyToken, async (req, res) => {
    const {
        maLichChieu,
        danhSachVe,
        taiKhoanNguoiDung
    } = req.body

    if (!maLichChieu || !danhSachVe || !taiKhoanNguoiDung) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing maLichChieu and/ or danhSachVe, maRap and/ or taiKhoanNguoiDung"
            })
    }

    try {
        const userId = await User.find({ taiKhoan: taiKhoanNguoiDung })
        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "taiKhoanNguoiDung không tồn tại"
                })
        }
        const movieScheduleId = await MovieSchedule.find({ _id: maLichChieu })
        if (!movieScheduleId) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "maLichChieu không tồn tại"
                })
        }
        const bookTicketId = await BookTicket.findOne({
            maLichChieu: maLichChieu,
            maNguoiDung: userId._id
        })
        if (!bookTicketId) {
            const newBookTicket = new BookTicket({
                maLichChieu: maLichChieu,
                maNguoiDung: userId._id,
                danhSachVe: danhSachVe
            })
            await newBookTicket.save()
        }
        else {
            var newArray = new Array()
            newArray = bookTicketId.danhSachVe
            for (let x = 0; x < danhSachVe.length; x++) {
                if (!bookTicketId.danhSachVe.indexOf(danhSachVe[x])) {
                    newArray.push(danhSachVe[x])
                }
            }
            var upBookTicket = BookTicket.findOneAndUpdate(
                { _id: bookTicketId._id },
                {
                    maLichChieu: bookTicketId._id,
                    maNguoiDung: userId._id,
                    danhSachVe: newArray
                },
                { new: true }
            )
            if (!upBookTicket) {
                return res
                    .status(401)
                    .json({
                        message: "Xử lý thất bại",
                        content: "Đặt vé không thành công (error up)"
                    })
            }
            else {
                return res
                    .status(200)
                    .json({
                        message: "Xử lý thành công",
                        content: "Đặt vé thành công"
                    })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})
router.post('/TaoLichChieu', verifyTokenAdmin, async (req, res) => {
    const {
        maPhim,
        ngayChieuGioChieu,
        maRap,
        giaVe
    } = req.body

    if (!maPhim || !ngayChieuGioChieu || !maRap || !giaVe) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing maPhim and/ or ngayChieuGioChieu, maRap and/ or giaVe"
            })
    }

    try {
        const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4} ([0-1]?[0-9]|2?[0-3]):([0-5]\d):([0-5]\d)$/
        if (ngayChieuGioChieu.match(regex) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy hh:mm:ss!"
                })
        }
        var ngayMMddYYYYhhmmss = ngayChieuGioChieu.substring(3, 6) + ngayChieuGioChieu.substring(0, 3) + ngayChieuGioChieu.substring(6, 10)
            + "T" + ngayChieuGioChieu.substring(11, 19)

        var between0 = parseInt(ngayMMddYYYYhhmmss.substring(11, 13), 0)
        var start0 = ngayMMddYYYYhhmmss.substring(0, 11) + (between0 - 2) + ngayMMddYYYYhhmmss.substring(13, 19)
        var end0 = ngayMMddYYYYhhmmss.substring(0, 11) + (between0 + 2) + ngayMMddYYYYhhmmss.substring(13, 19)

        const existMovieSchedule = await MovieSchedule.find({
            maRap: maRap,
            ngayChieuGioChieu: {
                $gte: start0,
                $lte: end0
            }
        })

        if (existMovieSchedule) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Lịch chiếu đã bị trùng"
                })
        }
        const newMovieSchedule = new MovieSchedule({
            movie: maPhim,
            ngayChieuGioChieu: ngayMMddYYYYhhmmss,
            giaVe,
            cinema: maRap
        })
        newMovieSchedule.save()

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: "Thêm lịch chiếu thành công"
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})


module.exports = router