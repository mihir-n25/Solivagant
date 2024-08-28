const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
    secret:"mysupersecretstring",
    resave: false,
     saveUninitialized:true,
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res) =>{
    let{ name="aonymous" } = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");
    req.flash("error","user not register");
    res.redirect("/hello");
});

app.get("/hello",(req,res) => {
    res.locals.messages = req.flash("success");
    res.render("page.ejs", {name:req.session.name});
});

// app.get("/reqcount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a reequest ${req.session.count} times`);
// });

// app.get("/test",(req,res) => {
//     res.send("test successfull");
// })

app.listen(3000, () =>{
    console.log("server is listening to 3000");
});