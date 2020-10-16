
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController(){

    return{
        login(req , res){
            res.render('auth/login')
        },

        register(req , res){
            res.render('auth/register')
        },
        async postRegister(req ,res){

            const {name , email , password} = req.body;

        // Validation

            if(!name || !email || !password){

                req.flash('error' , 'All fields are required')
                req.flash('name' , name)
                req.flash('email' , email)

                return res.redirect('/register')   
            }

            // Check if email exists

            User.exists({email : email} , (err , result) => {

                if(result){
                req.flash('error' , 'Email already exists')
                req.flash('name' , name)
                req.flash('email' , email)
                return res.redirect('/register')
                }
                
            })


            // Hash Password    

            const hashPassword = await bcrypt.hash(password , 10)


            // Create a User

            const user = new User({
                
                name : name,
                email : email,
                password : hashPassword
                
            })

            user.save().then(() =>{

                    //Login

                    return res.redirect('/')

            }).catch(err =>{
                req.flash('error' , 'Something went wrong')
                req.flash('name' , name)
                req.flash('email' , email)
                
                return res.redirect('/register')
            })

            
        },


        // Whenever we call passport authenticate we recieve a callback function which we need to call at last.

        postLogin(req , res , next){
            passport.authenticate('local' , (err , user ,info) =>{

                const{email , password} = req.body

                if(!email || !password){
                    req.flash('error' , 'All fields are required')
                    return res.redirect('/login')
                }

                if(err){
                    req.flash('error' , info.message)

                    return next(err)
                }

                if(!user){
                    req.flash('error' , info.message)

                    return res.redirect('/login')

                }

                req.logIn(user , (err) => {

                    if(err){
                        req.flash('error' , info.message)
                        return next(err)
                    }

                    res.redirect('/')
                })
            })(req , res , next)
        },


        logOut(req , res){
            req.logOut();

            return res.redirect('/login')
        }

        
    }
}

module.exports = authController