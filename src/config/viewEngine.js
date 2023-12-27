import express from 'express'
let configViewEngine = (app) => {
  app.use(express.static('./src/public')) // cấu hình cho hiểu là chỉ có thể lấy 
  // ảnh trên file public
  app.set('view engine', 'ejs')
  app.set('views', './src/views')
}

module.exports = configViewEngine
