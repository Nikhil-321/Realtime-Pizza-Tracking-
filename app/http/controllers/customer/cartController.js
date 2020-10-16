const { update, create } = require("../../../models/menu");

function cartController(){

    return{
    cart(req ,res){
        res.render('customer/cart')
    },

    update(req , res){

        // let cart = {
        //     items : {
        //         itemId : {item : pizzaObject , qty: 0}
        //     },
        //     totalQty : 0,
        //     totalPrice : 0
        // }



    // Checking if there is cart stored in session if not add basic empty structure of cart

        if(!req.session.cart){
            req.session.cart = {
                items : {},
                totalQty : 0, 
                totalPrice : 0
            }

            
        }

        let cart = req.session.cart

        if(!cart.items[req.body._id]){

            cart.items[req.body._id] = {
                item  : req.body,
                qty : 1
            },
            cart.totalQty = cart.totalQty + 1 ;
            cart.totalPrice = cart.totalPrice + req.body.price;

        }

        

        else{

            cart.items[req.body._id].qty = cart.items[req.body._id].qty +1;
            cart.totalQty = cart.totalQty + 1;
            cart.totalPrice = cart.totalPrice + req.body.price;
        }

        console.log(cart.totalQty)

        

      

       

        return res.json({totalQuantity : cart.totalQty})
    }
}
}

module.exports = cartController;    