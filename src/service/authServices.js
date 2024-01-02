
import db from "../models/index.js";
import bcrypt from 'bcryptjs'
let jwt = require('jsonwebtoken');
const getHomePageServices = () => {
    return new Promise (async (resolve,reject) => {
        try{
            let data = await db.User.findAll({
                raw:true
            });
            console.log('----------------------')
            console.log(data)
            console.log(`----------------------`)
            resolve(data)
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}
const checkExist = async (userEmail) => {
    return new Promise( async (resolve, reject) => {
    try {
        let user = await db.User.findOne({
            where: {email: userEmail}
        })
        if(user){
            resolve(true)
        }else{
            resolve(false)
        }
    } catch(e) {
      reject(e)
    }
  })

}
const hashPasswordUser = (password) => {
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(password,salt)
    return hashPassword;
}
const postRegisterServices = (userRegister) => {
    return new Promise (async (resolve,reject)=>{
        try{
            
            let isExist = await checkExist(userRegister.email)
            if(isExist === true){
                resolve({
                    errCode: 1,
                    errMessage: `This email is already valid, Please try another email`
                })
            }else{
                console.log(`check user: `,userRegister)
                let hashPassword = await hashPasswordUser(userRegister.password)
                let user = await db.User.create({
                    email: userRegister.email,
                    password: hashPassword,
                    username: userRegister.username,
                    admin: userRegister.admin
                })
                resolve({
                    errCode: 0,
                    errMessage: `Created~~~`
                })
            }
        }catch(e){
            reject(e)
        }
    })
}
let refreshTokenArr = []
const LoginServices =  (email,password,res) => {
    return new Promise (async (resolve,reject)=>{
        try{
            // check email exist
            let userData = {}
            let isExist = await checkExist(email)
            if(!isExist){
                resolve({
                    errCode: 1,
                    errMessage: `Email doesn's exist,Pls try another email`
                })
            }else if(isExist){
                let user = await db.User.findOne({
                    where: {email: email}
                })
                if(user){
                    // compare password 
                    let check = await bcrypt.compareSync(password,user.password)
                    if(check === true){
                        let accessToken = generateAccessToken(user)
                        let refreshToken = generateRefreshToken(user)
                        refreshTokenArr.push(refreshToken)
                        res.cookie("refreshToken",refreshToken,{
                            httpOnly: true,
                            secure: false,
                            path: '/',
                            sameSite: 'strict'
                        }) 
                        userData.errCode = 0,
                        userData.errMessage = `Let's login ~~~`;
                        
                        delete user.password
                        userData.user = {
                            userInfo: user,
                            accessToken: accessToken
                        }
                        
                    }else{
                        userData.errCode = 1,
                        userData.errMessage = `Wrong password ~~~`
                    }
                }else{
                    userData.errCode = 2,
                    userData.errMessage = `User not found`
                }
            }
            resolve(userData)
        }catch(e){
            reject(e)
        }
    })
    
}
const generateAccessToken =(user)=>{
    return jwt.sign({
                        id: user.id,
                        admin: user.admin
                    },
                    process.env.JWT_ACCESS_TOKEN,
                    {expiresIn: "30s"}
            )
        
}
const generateRefreshToken =(user)=>{
    return jwt.sign({
                        id: user.id,
                        admin: user.admin
                    },
                    process.env.JWT_REFRESH_TOKEN,
                    {expiresIn: "365d"}
            )
}
const reFreshTokenServices = (refreshToken,res) => {
    return new Promise (async (resolve,reject)=>{
        try{
            let userData = {}
            if(!refreshToken){
                resolve({
                    errCode: 1,
                    errMessage: `You're not authenticated~~~`
                })
            }else if(!refreshTokenArr.includes(refreshToken)){
                resolve({
                    errCode: 1,
                    errMessage: `Refresh token is not valid`  
                })
            }
            jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN, (err,user)=>{
                if(err){
                    console.log(`got err: `,err)
                }
                refreshTokenArr = refreshTokenArr.filter(token => token !== refreshToken)

                let newAccessToken = generateAccessToken(user)
                let newRefreshAccessToken = generateRefreshToken(user)
                refreshTokenArr.push(newRefreshAccessToken)
                res.cookie("refreshToken",newRefreshAccessToken,{
                    httpOnly: true,
                    secure: false,
                    path:'/',
                    sameSite: 'strict'
                })
                userData.errCode = 0,
                userData.accessToken = newAccessToken
            })
            resolve(userData)
        }catch(e){
            reject(e)
        }
    })
    
}
const logOutServices = (req,res)=>{
    res.clearCookie("refreshToken")
    refreshTokenArr = refreshTokenArr.filter(token => token !== req.cookies.refreshToken)
    return {message: `Logged out successfully ~~~`}
}
module.exports = {
  getHomePageServices: getHomePageServices,
  postRegisterServices:postRegisterServices,
  LoginServices: LoginServices,
  reFreshTokenServices:reFreshTokenServices,
  logOutServices:logOutServices
}
