const mongoose = require("mongoose")
const Schema = mongoose.Schema({
    title: {
        type: "string",
        required: true
    },
    body: {
        type: "string",
        required: true
    },
    image: {
        type: "string",
        required: true
    },
    author: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("BlogPost", Schema)