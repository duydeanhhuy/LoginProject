let jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.headers.token
  console.log(`check token: `, req.headers.token)
  if (token) {
    // Bearer 123456 => Bearer123456
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(200).json({errMessage: `Token is not valid`})
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
