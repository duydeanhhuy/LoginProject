import db from '../models/index.js'
import bcrypt from 'bcryptjs'
let getHomePage = async (req, res) => {
    try{
        let data = await db.User.findAll({
            raw:true
        });
        console.log('----------------------')
        console.log(data)
        console.log(`----------------------`)
    }catch(e){
        console.log(e)
    }
}
let getHome = (req, res) => {
  return res.render(`homePage.ejs`)
}

let postRegister = async (req,res) => {
    try{
        console.log(`check req: `,req.body)
        let data = req.body
        let salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(data.password,salt)
        let userRegister =  await db.User.create({
            username: data.username,
            email: data.email,
            password: hashPassword
        })
        return res.status(200).json({
            errCode: 0,
            errMessage: `Created`,
            
        })
    }catch(e){
        return res.status(500).json({
            message:`Error`
        })
    }
}
let loginUser = async (req,res) => {
    try{
        const user = await db.User.findOne({
            where : {email: req.body.email}
        })
        if(!user){
            return res.status(404).json({
                errCode: 1,
                errMessage: `Wrong email or email doesn't exist`
            })
        }
        let validPassword = bcrypt.compareSync(req.body.password, user.password);
        if(user && validPassword === true){
            return res.status(200).json({
                errCode: 0,
                errMessage: `You're correct~~`
            })
        }else{
            return res.status(200).json({
                errCode:1,
                errMessage:'Wrong Password'
            })
        }
    }catch(e){
        res.status(500).json(e)
    }
}
module.exports = {
  getHomePage: getHomePage,
  getHome: getHome,
  postRegister:postRegister,
  loginUser:loginUser
}
