import express from 'express'
import homeController from '../controller/homeController'
import userController from '../controller/userController'
import middlewareController from '../controller/middlewareController'
import { reqRefreshToken } from '../controller/homeController.js'
let router = express.Router()

let initWebRouters = (app) => {
  router.get('/', homeController.getHomePage)
  router.post(`/api/register`, homeController.postRegister)
  router.post(`/api/login`, homeController.loginUser)
  router.post(`/api/logout`, homeController.logoutUser)
  router.get(`/get-user`, middlewareController.verifyToken, userController.getAllUser) // người muốn login thực hiện cái 

  router.delete(`/delete-user/:id`, middlewareController.verifyTokenAndAdminAuth, userController.deleteUser)
  router.put(`/edit-user/:id`, userController.editUser)

  router.post(`/refreshToken`, homeController.reqRefreshToken)
  return app.use('/', router) // app của chúng ta sẽ bắt đầu = dấu / và phải sử dụng tất cả các file router cta khai báo

}

module.exports = initWebRouters
