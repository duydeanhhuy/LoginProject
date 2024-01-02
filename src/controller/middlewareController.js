let jwt = require('jsonwebtoken')

// verifyToken xác nhận xem token đó có phải người đó hk
const verifyToken = (req, res, next) => {
  const token = req.headers.token
  console.log(`check token: `, req.headers.token)
  // if(!token){
  //   return res.status(404).json({
  //     status: 'ERR',
  //     message: 'The access_token is required'
  //   })
  // }
  if (token) {
    // Bearer 123456 => Bearer123456
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(200).json({errMessage:`Token is not valid`})
      }
      req.user = user
      console.log(`check user:`, user)
      next()
    })
  }else {
    res.status(200).json({message: `You're not authenticated`})
  }
}

const verifyTokenAndAdminAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.admin) {
      // chỉ có thể tự mình xóa bản thân (và đồng thời mih cũng không phải admin) hoặc bạn là admin thì mới xóa đc người khác
      //                                  admin hk thể tự xóa bản thân ( cũng ddhieu lắm)
      next()
    }else {
      res.status(200).json(`You're not allowed to delete other`)
    }
  })
}
module.exports = {
  verifyToken: verifyToken,
  verifyTokenAndAdminAuth: verifyTokenAndAdminAuth

}
