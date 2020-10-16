
const Order = require('../../../models/order')
const moment = require('moment')

function orderController(){
    return{

        order(req , res){
        
            // Validate Request

            const { phone , address } = req.body;

            if(!phone || !address) { 
                req.flash('error' , 'All fields are required');
                    return res.redirect('/cart')
            }  
            
            
            const order = new Order({

                customerId : req.user._id,
                items : req.session.cart.items,
                phone : phone,
                address : address
            })


            order.save().then(result => {
                Order.populate(result , {path : 'customerId'} , (err , placedOrder) =>{

                    req.flash('success' , 'Order Placed Successfully')

            req.session.cart = ""

            //Event Emit
            
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderPlaced' , result )


            return res.redirect('/customer/orders')

                })

            

            }).catch(err =>{
                req.flash('error' , 'Something went wrong')
            })


        },


        async index(req , res){

            const orders =  await Order.find({customerId : req.user._id} , null , {sort : {'createdAt' : -1} })

            res.header('Cache-Control' , 'no-cache ,private , no-store , must-revalidate , max-stale=0, post-check=0, pre-check=0')
            // Special Note(Must Read Carefully) :  res.header is sent to control cache and so that when we click on back button after placing order it does not show alert of "Order Placed Successfully"
                
            res.render('customer/order' , {orders : orders , moment : moment})
        },

        async show(req , res){

            const order = await Order.findById(req.params.id)

            //User Authorize

            if(req.user._id.toString() === order.customerId.toString()){     // Now we cannot compare both ids like this as mongodb store them as object so we have converted them to string

                res.render('customer/status' , {order : order})
            }else{
                res.redirect('/')
            }



        }

        
    }
}

module.exports = orderController