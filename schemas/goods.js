const mongoose = require("mongoose");


const goodsSchemas = new mongoose.Schema({
    goodsId: {
        type: Number,
        requried: true,
        unique: true
    },
    content: {
        type: String,
        requried: true,
    },
    author: {
        type: String,
        requried: true,
    },
    title: {
        type: String,
        requried: true,
        unique: true
    },
    password: {
        type: String,
        requried: true,
        unique: true
    },
    status: {
        type: String,
        requried: true
    }
})

module.exports = mongoose.model("Goods", goodsSchemas);