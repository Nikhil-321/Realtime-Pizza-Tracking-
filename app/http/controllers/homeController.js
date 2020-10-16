
const Menu = require('../../models/menu')

function homeController(){

    return{

        index(req, res) {

            Menu.find().then(pizzas =>{
                res.render('index' , {pizzas : pizzas});
                
            })

            
            
        }

    }

}

module.exports = homeController;