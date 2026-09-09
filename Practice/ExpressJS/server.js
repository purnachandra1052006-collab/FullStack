const express = require('express');

const server = express();

server.get('/home',(req,res)=>{
    res.send("Home Page");
});

server.get('/about',(req,res)=>{
    res.send("About Page");
});

server.get('/contact',(req,res)=>{
    res.send("Contact me!")
});

server.listen(3000, ()=>{
    console.log("The Server is working");
});