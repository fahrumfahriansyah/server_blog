const express = require('express')
const route = express.Router()
const Auth = require("../Controllers/ControllersAuth")
route.post("/Register", Auth.AuthRegister)

module.exports = route