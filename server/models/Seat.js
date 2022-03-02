const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SeatSchema = new Schema({
    giaVe: {
        type: Number
    },
    maRap:{
        type: Schema.Types.ObjectId,
        ref:'cinemas'
    }
})

module.exports = mongoose.model('seats', SeatSchema)