const { validationResult } = require('express-validator');
const path = require("path")
const fs = require("fs")
const { Error } = require('mongoose');
const BlogPost = require("../models/blog")
exports.CreateBlog = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        removeImage(req.file.path)
        const err = new Error("input value tidak sesuai")
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }
    if (!req.file) {
        const err = new Error("image tidak ada")
        err.errorStatus = 402
        throw err
    }
    const title = req.body.title
    const body = req.body.body
    const image = req.file.path



    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: { uid: "1", name: "Testing" },
    })
    Posting.save().then((result) => {
        res.status(201).json({
            message: "Create blog post succses",
            data: result
        })
    }).catch(err => console.log("error conttroloer blog \n\n" + err))



}

// menambahkan getAllblogpost
exports.GetAllBlog = async (req, res, next) => {
    const currentPage = req.query.page || 1
    const toPage = req.query.toPage || 3
    let totalAllData;
    await BlogPost.find().countDocuments()
        .then((result) => {
            totalAllData = result
            //?LOGIKA NYA JIKA SI SKIP HASILNYA 5 DARI PEMJULMAHAN MAKA AKAN DILONGKAP SEBANYAK SI NILAI DARI SKIP CONTOH NILAI SKIP 2 SEDANGKAN DATA ADA 5 MAKA AKAN DI MULAI DARI 3
            return BlogPost.find().skip((parseInt(currentPage) - 1) * parseInt(toPage))
                .limit(toPage)
        }).then((result) => {
            res.status(200).json({
                message: "data berhasil di ambil",
                data: result,
                dataAll: totalAllData,
                toPage: toPage,
                page: currentPage
            })
        })
        .catch((err) => {
            next(err)
        })

}

// menambahan getAllById berdasarkan id

exports.GetBlogById = async (req, res, next) => {
    const params = req.params.byId
    await BlogPost.findById(params).then(result => {
        if (!result) {
            const error = new Error("data tidak di temukan")
            error.errorStatus = 404
            throw error
        }
        res.status(200).json({
            message: "data by id berhasil",
            data: result
        })
    }).catch((err) => {
        next(err)
    })

}
exports.GetUpdateById = (req, res, next) => {
    // hal ini sama seperti mengcreate data ada validator dan pecncegahan error

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error("input value tidak sesuai")
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }
    if (!req.file) {
        const err = new Error("image tidak ada")
        err.errorStatus = 404
        throw err
    }
    const title = req.body.title
    const body = req.body.body
    const image = req.file.path
    const params = req.params.updateById
    console.log(req.file)


    BlogPost.findById(params)
        .then((result) => {
            if (!result) {
                const err = new Error()
                err.errorStatus = 404
                throw err
            }
            removeImage(result.image)
            result.title = title
            result.body = body
            result.image = image
            return result.save()
        }).then(result => {
            console.log(result)
            res.status(200).json({
                message: "data berhasil di update",
                data: result
            })

        })
        .catch((err) => {
            next(err)
        })



}


exports.deleteById = async (req, res, next) => {
    const params = req.params.byId
    await BlogPost.findById(params)
        .then((result) => {
            if (!result) {
                const error = new Error("data tidak ditemukan")
                error.errorStatus = 404
                throw error
            }
            removeImage(result.image)
            console.log(result._id)
            return BlogPost.findByIdAndRemove(result._id)

        }).then(result => {
            res.status(200).json({
                message: "succes full",
                data: result
            })
        })
}

removeImage = (filePathImg) => {
    filePathImg = path.join(__dirname, "../..", filePathImg)
    console.log(filePathImg)
    fs.unlink(filePathImg, err => console.log(err))
}
