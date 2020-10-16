

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customer/cartController')
const restrict = require('../app/http/middlewares/restrict')
const auth = require('../app/http/middlewares/auth')
const orderController = require('../app/http/controllers/customer/orderController')
const  adminOrderController = require('../app/http/controllers/admin/adminOrderController')
const  statusController = require('../app/http/controllers/admin/statusController')

const admin = require('../app/http/middlewares/admin')

function initRoutes(app) {

   
    app.get('/' ,  homeController().index )
    
    app.get('/login' , restrict , authController().login)
    app.post('/login' , authController().postLogin)

    app.post('/logout' , authController().logOut)


  

    //customer routes

    app.post('/order' , auth , orderController().order )
    app.get('/customer/orders' , auth , orderController().index)
    app.get('/customer/orders/:id' , auth , orderController().show)

    // Admin Routes

    app.get('/admin/orders' , admin , adminOrderController().index)
    app.post('/admin/order/status' , admin , statusController().update)
    

    
    app.get('/register' , restrict , authController().register)
    app.post('/register' , authController().postRegister)

    app.get('/cart' , cartController().cart )

    app.post('/update-cart' , cartController().update)

    
}

module.exports = initRoutes;