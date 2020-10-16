
const Order = require('../../../models/order')

function statusController(){
    return{

        async update(req , res){

            const order = await Order.updateOne({_id : req.body.orderId} , {status : req.body.status} , (err , data) =>{


                if(err){
                    return res.redirect('/admin/orders')
                }

                // Event Emit

                const eventEmitter = req.app.get('eventEmitter')

                eventEmitter.emit('updatedStatus' , {id : req.body.orderId , status : req.body.status} )

                return res.redirect('/admin/orders')

               

            })
        }
    }
}

module.exports = statusController