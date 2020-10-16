    require('dotenv').config()
    const express = require('express')
    const app = express();
    const ejs = require('ejs');
    const path = require('path');
    const mongoose = require('mongoose');
    const expressLayout = require('express-ejs-layouts')
    const PORT = process.env.PORT || 3300
    const session = require('express-session');
    const flash = require('express-flash');
    const MongoDbStore = require('connect-mongo')(session)
    const passport = require('passport')
    const Emitter = require('events')


    app.use(express.static('public'))

    app.use(express.urlencoded({extended : false}))

    app.use(express.json());


    

  

    // Database Connection

    const url = process.env.MONGO_URI || 'mongodb://localhost/pizza';
    mongoose.connect(url , {useNewUrlParser: true , useCreateIndex: true, useUnifiedTopology: true, useFindAndModify : true});
    const connection = mongoose.connection;
    connection.once('open' , () => {
        console.log('Datebase Connected');
    }).catch( err => {
        console.log('Connected Failed');
    });

    



        // Session Storing in MongoDb

      let mongoStore = new MongoDbStore({
          mongooseConnection : connection,
          collection : 'session'

      })


      // Event Emitter

        const eventEmitter = new Emitter()
        app.set('eventEmitter' , eventEmitter)
      

       // Session config
        
       app.use(session({
            secret: process.env.COOKIE_SECRET,
            store : mongoStore,
            resave : false,
            saveUninitialized : false,
            cookie : { maxAge : 1000*60*60*24} // 24 hours
    
        }))




        // Passport Config (Always remember passport config comes after session config)
    
    const passportInit = require('./app/config/passport');
const { Server } = require('http');

    passportInit(passport)
    app.use(passport.initialize());
    app.use(passport.session());

        app.use(flash());


        // Global Middleware

        app.use((req , res , next) => {

            res.locals.session = req.session;
            res.locals.user = req.user;
            next();
        })
      
        

    //Set Template engine
    app.use(expressLayout);
    app.set('views' , path.join(__dirname , '/resources/views'))
    app.set('view engine', 'ejs');




    //Assets


    require('./routes/web')(app)


   const server =  app.listen(PORT, () =>{
        console.log(`Server is listening on port ${PORT}`)
    })



    //Socket

    const io  = require('socket.io')(server)

    io.on('connection' , (socket) =>{


        socket.on('orderId' , (roomName) =>{

            socket.join(roomName)
        })

    })

    eventEmitter.on('updatedStatus' , (data) =>{

        io.to(`order_${data.id}`).emit('statusUpdated' , data)
    })

    eventEmitter.on('orderPlaced' , (data) =>{
        io.to('adminRoom').emit('orderPlaced' , data)
    })

    