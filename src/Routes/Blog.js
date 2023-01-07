const express = require('express')
const { body } = require('express-validator')
const route = express.Router()
const Blog = require("../Controllers/ControllersBlog")

route.post("/CreateBlog", [
    body("title").isLength({ min: 7 }).withMessage("huruf minimal 7").isUppercase().withMessage("huruf minamal besar"), body("body").isLength({ min: 12, max: 400 }).withMessage("min 12 max 400 huruf")
], Blog.CreateBlog)

route.get("/post", Blog.GetAllBlog)
route.get("/post/:byId", Blog.GetBlogById)
route.put("/post/:updateById", [
    body("title").isLength({ min: 7 }).withMessage("huruf minimal 7").isUppercase().withMessage("huruf minamal besar"), body("body").isLength({ min: 12, max: 400 }).withMessage("min 12 max 400 huruf")
], Blog.GetUpdateById)

route.delete("/post/:byId", Blog.deleteById)

module.exports = route