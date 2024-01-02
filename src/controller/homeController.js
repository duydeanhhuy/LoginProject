import authServices from '../service/authServices.js'
let jwt = require('jsonwebtoken');
let getHomePage = async (req, res) => {
    let data = await authServices.getHomePageServices()
    return res.status(200).json(data)
}

let refreshTokenArr = []
let postRegister = async (req,res) => {
    let userRegister = req.body
    let data = await authServices.postRegisterServices(userRegister)
    return res.status(200).json(data)
}
let loginUser = async (req,res) => {
    let email = req.body.email
    let password = req.body.password
    let response = await authServices.LoginServices(email,password,res)
    res.status(200).json(response)
}
let reqRefreshToken = async (req,res) => {
    // Take refresh token from user
    let refreshToken = req.cookies.refreshToken
    console.log('refresh_token', refreshToken)
    let data = await authServices.reFreshTokenServices(refreshToken,res)
    return res.status(200).json(data)
}
const logoutUser = async (req, res)=>{
    let data = await authServices.logOutServices(req,res)
    return res.status(200).json(data)
}
module.exports = {
  getHomePage: getHomePage,
  postRegister:postRegister,
  loginUser:loginUser,
  reqRefreshToken: reqRefreshToken,
  logoutUser: logoutUser
}
