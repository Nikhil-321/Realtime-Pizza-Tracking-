import axios from 'axios';
import Noty from 'noty';
import moment from 'moment'
import {initAdmin} from './admin'

let addToCart = document.querySelectorAll('.add-to-cart');

let cartCounter = document.querySelector('#cart-counter');


function updateCart(pizza){
    axios.post('/update-cart' , pizza).then(res => {
        console.log(res)
        cartCounter.innerText = res.data.totalQuantity
        

        new Noty({
            type: 'success',
            timeout : 1000,
            progressBar : false,
            text: 'Item added to the cart'
        }).show();

    }).catch(err =>{

        new Noty({
            type: 'failure',
            timeout : 1000,
            progressBar : false,
            text: 'Something went wrong'
        }).show();
    })
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click' , (e) =>{
        let pizza = JSON.parse(btn.dataset.pizza)
        console.log(pizza)

        updateCart(pizza)
        
    })
})


const alertMsg = document.getElementById('alert');

    if(alertMsg){

        setTimeout(() => {
            alertMsg.remove()
        } , 2000)
    }

    



    // Status Update

    let statuses = document.querySelectorAll('.status_line')
    
    let hiddenInput = document.querySelector('#hiddenInput')

    let order = hiddenInput ? hiddenInput.value : null
    order = JSON.parse(order)

    let time = document.createElement('small')

    
    

    function updateStatus(order){

        
        let stepCompleted = true;

        statuses.forEach((status) =>{

            status.classList.remove('step-conmpleted')
            status.classList.remove('current-step')

        })

        statuses.forEach((status) =>{
            let dataProp = status.dataset.status
            
            if(stepCompleted){

                status.classList.add('step-completed')
            }

            if(dataProp === order.status ){
                stepCompleted = false;

                if(status.nextElementSibling){

                    time.innerHTML = moment(order.updatedAt).format('hh:mm A')

                    status.append(time)

                    status.nextElementSibling.classList.add('current-step')
                }

               

            }
        })


    }

    updateStatus(order)

    // Socket

    const socket = io()
    

    if(order){
        socket.emit('orderId' , `order_${order._id}`)
    }



    socket.on('statusUpdated' , (data) =>{
        let updatedOrder = {...order}
        updatedOrder.updatedAt = moment().format()
        updatedOrder.status = data.status
        updateStatus(updatedOrder)
        new Noty({
            type: 'success',
            timeout : 1000,
            progressBar : false,
            text: 'Status Updated'
        }).show();
       
    })

    let AdminArea = window.location.pathname

    initAdmin(socket)
    console.log(AdminArea)

    if(AdminArea.includes('admin')){
        socket.emit('orderId' , 'adminRoom')
    }

 