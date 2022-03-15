const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    tenPhim: {
        type: String,
        required: true,
        unique: true
    },
    biDanh: {
        type: String
    },
    trailer: {
        type: String,
        required: true
    },
    hinhAnh: {
        type: String,
        required: true
    },
    moTa: {
        type: String,
        required: true
    },
    ngayKhoiChieu: {
        type: Date
    },
    danhGia: {
        type: Number
    }
})

module.exports = mongoose.model('movies', MovieSchema)