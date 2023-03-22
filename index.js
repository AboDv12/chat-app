/*
حمل من النود

1-express
2-socket.io
3-db-lcoal

*/



const express = require ('express');
const app = express();
const PORT = 3003;
const http = require('http').Server(app);
const io = require ('socket.io')(http);
const dbLocal = require("db-local");
const { Schema } = new dbLocal({ path: "./database" });

const singUp = Schema("singUp",{
  name:{type:String},
  pass:{type:String}
})
src = '/account.html'
app.get('/',(req,res)=>{
  res.sendFile(__dirname + src)
});
app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/login.html')
});

app.get('/main',(req,res)=>{
  res.sendFile(__dirname+'/home.html')
});
let users = {};
let password;
io.on("connection",socket=>{
  console.log(socket.id);
     socket.on('pass-check',pass=>{ 
       password=pass
     });
  socket.on('user-check',user=>{
  const name = user;
  console.log(name)
    if(!singUp.findOne({name:user})){
     console.log(name + password)
      const newUser = singUp.create({
        name:name,
        pass: password 
      }).save();
      let user = singUp.findOne({name:name});
      let userName = user.name
        socket.emit('account-done','/main');
        socket.broadcast.emit('user-account',userName);
        console.log(userName)
    }
    else{
      socket.emit('err-user',false);
      
    }
  })
 socket.on('tag-joined',tag=>{
  console.log(tag);
  users[socket.id]= tag
  socket.broadcast.emit('user-joined',users[socket.id]);
 })
  console.log("user joined ");
  socket.on('send-msg',msg=>{
    socket.broadcast.emit('msg',msg)
    socket.emit('msg2',msg)
  });
socket.on("disconnect",()=>{
  console.log('disconnected...')
})

})
http.listen(PORT,()=>{
  console.log('connected to express')
});
