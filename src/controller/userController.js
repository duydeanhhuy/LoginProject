import db from "../models"
import userServices from '../service/userServices.js'
const getAllUser =  async (req,res) => {
    let data = await userServices.getAllUserServices()
    return res.status(200).json(data)
}
const deleteUser = async (req,res) => {
    let id = req.params.id
    let data = await userServices.deleteUserServices(id)
    return res.status(200).json(data)
}
const editUser = async (req,res)=> {
    try{
        // seek user
        let user = await db.User.findOne({
            where: {id: req.params.id}
        })
        if(!user){
            return res.status(200).json({
                errCode: 1,
                errMessage: `User doesn't exist~`
            })
        }else if(user){
            console.log(`check req.body.email: `,req.body.email)
            user.email = req.body.email
            user.username = req.body.username
            console.log(`check user1: `,user)
            await user.save()
            return res.status(200).json({
                errCode: 0,
                errMessage: `Edited~~`,
                userEdit: user
            })
        }
    }catch(e){
        return res.status(500).json(e)
    }
}
module.exports = {
    getAllUser: getAllUser,
    deleteUser:deleteUser,
    editUser: editUser
}