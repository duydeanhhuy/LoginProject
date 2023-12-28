import db from "../models"
const getAllUser =  async (req,res) => {
    try{
        const user = await db.User.findAll({
            raw: true
        });
        if(user){
            return res.status(200).json({
            errCode: 0,
            errMessage: `All User`,
            listUser: user
        })
        }
        
    }catch(e){
        return res.status(500).json(e)
    }
}
const deleteUser = async (req,res) => {
    try{
        let user = await db.User.findOne({
            where: {id: req.params.id}
        })
        console.log(`check user id: `, req.params)
        if(user){
            await user.destroy();
            return res.status(200).json({
                errCode: 0,
                errMessage: `Deleted~~`
            })
        }else{
            return res.status(404).json({
                errCode: 1,
                errMessage: `User not found or doesn't exist !!!`
            })
        }
    }catch(e){
        return res.status(500).json({
            errCode:2,
            errMessage:`Error~~~`
        })
    }
}
module.exports = {
    getAllUser: getAllUser,
    deleteUser:deleteUser
}