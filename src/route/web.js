import express from 'express'
import homeController from '../controller/homeController'
import userController from '../controller/userController'

let router = express.Router()

let initWebRouters = (app) => {
  router.get('/', homeController.getHomePage)
  router.get(`/home`, homeController.getHome)
  router.post(`/api/register`, homeController.postRegister)
  router.post(`/api/login`, homeController.loginUser)

  router.get(`/get-user`, userController.getAllUser)
  router.delete(`/delete-user/:id`, userController.deleteUser)
  return app.use('/', router) // app của chúng ta sẽ bắt đầu = dấu / và phải sử dụng tất cả các file router cta khai báo

}

module.exports = initWebRouters
