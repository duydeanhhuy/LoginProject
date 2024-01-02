import db from "../models/index.js"
const getAllUserServices = () =>{
    return new Promise (async (resolve,reject)=> {
        try{
            let allUser = await db.User.findAll({
                attributes:{
                        exclude: ['password']
                    }
                ,
                raw: true
            })
            console.log(`check allUser:`,allUser)
            resolve({
                errCode:0,
                listUser: allUser
            })
        }catch(e){
            reject(e)
        }
    })
}
const deleteUserServices = (userId)=>{
    return new Promise (async (resolve,reject)=>{
        try{
            let userData = {}
            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(!user){
                userData.errCode = 1
                userData.errMessage = `This user doesn't exist~`
            }else{
                await user.destroy();
                userData.errCode = 0
                userData.errMessage = `Deleted successfully~`
            }
            resolve(userData)
        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    getAllUserServices: getAllUserServices,
    deleteUserServices: deleteUserServices
}