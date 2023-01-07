exports.AuthRegister = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const regis = {
        message: "Register Succes",
        data: {
            id: 1,
            name: name,
            email: email,
            password: password
        }
    }
    res.status(201).json(regis)
}