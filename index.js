var express = require("express");
var app = express();

var mysql = require("mysql");
const PORT = 3000;
const bodyparser = require("body-parser");

var User = require('./models/user');
var Product = require('./models/product');


var urlencodedParser = bodyparser.urlencoded({ extended: false });
var jsonparser=bodyparser.json();



app.get("/", (req, res) => {
    console.log("Hellooooo")
    res.send("Hello World");
});
app.get("/signup", (req, res) => {
    console.log("Sign up Get works")
    res.sendFile(__dirname+"/"+"templates/signup.html");
});
app.get("/signin", (req, res) => {
    console.log("Sign in Get works")
    res.sendFile(__dirname+"/"+"templates/signin.html");
});

app.get("/product/create",(req, res) => {
    console.log("create product get");
    res.sendFile(__dirname+"/"+"templates/create_product.html");
})


//register
app.post('/register', urlencodedParser, function (req, res) {
    console.log("Post work")
    const newuser={
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        cpswd: req.body.cpswd
    };
    console.log(newuser);
  
  var sql = "select * from user where email= ?";
  User.query(sql,[newuser.email],function(err,user,fields){
    if(err) throw err;
    console.log(user[0]);
    if(user[0]){
        return res.status(500).json({ auth : false, message :"Email exits"});
    } 

    var sql ="insert into user set ?";
    User.query(sql, newuser, (err,doc)=>{
        if(err) {
            console.log(err);
            return res.status(500).json({ error: true, message: "Signup failed"});
        }
    });
            return res.status(200).json({succes:true,message: "User Signup is success"});
    
    
    
});

  
 })

app.listen(PORT, () => console.log("server started on port 3000"));

 //login
 app.post('/login',urlencodedParser,function(req,res){

    

    console.log("Signin Post work");


    var sql = "SELECT * FROM user WHERE email='"+req.body.email+"';";
    console.log(sql);
    User.query(sql,function(err,profile){
        console.log(profile[0]);
        console.log(profile[0].email);
        console.log(profile[0].password);
        if(err) throw err;
        if(!profile[0].email) {
                return res.status(500).send("User not exist");
        } else if (req.body.password == profile[0].password && req.body.email==profile[0].email){
                return res.status(200).send("User signin is success");
        } else {
                return res.status(500).send("Log in failed, please check your credentials");
            }
            
        

    });

});


//create product
app.post('/product/creates', urlencodedParser, function (req, res) {
    console.log("Product create Post work")
    var newprod= {
        pname: req.body.pname,
        pcode: req.body.pcode,
        pprice: req.body.pprice,
        pcategory: req.body.pcategory
    };
    var sql = "select * from product where pcode=?"

    Product.query(sql,[newprod.pcode],function(err,prod){
        if(prod[0].pcode){
            return res.status(500).json({error:true,message:"Product already exist"});
        }
        var sql = "insert into product set ?"
        Product.query(sql,newprod,(err,doc)=>{
            if(err){
                return res.status(500).json({error:true,message:"Product add failed "});
            }
            else{
                return res.status(200).json({success:true,message:"Product added successfully "});
                console.log(newprod);
            }
        });
    });
});

// list product
app.get("/product/list",(req, res) => {
    Product.find({},function(err,collection){
        if(err){
            return res.status(500).json({error:true,message:"Product listing failed"});
        }
        else{
            return res.status(200).json({success:true,message:"Product listing  successfully",data:collection});
        }
    });
})


//list by id
app.get("/product/list/:id", (req, res) =>{
    var sql = "select * from product where pcode='"+req.params.id+"';";
    Product.query(sql, function(err, result){
        if (err){
            return res.status(500).json({error: true, message:"single product listing failed"});
        } else{
            return res.status(200).json({error: true, message:"single product listed successfully",data: result[0]});
           
        }
    });
});

//delete product
app.delete("/product/list/:id/delete",(req, res) =>{
        sql = "delete from product where pcode="+req.params.id+";";
        console.log(sql);
    Product.query(sql,(err, result) =>{
        if(err){
            return res.status(500).json({error: true, message:"Product deletion failed"});
        } else {
        
            return res.status(200).json({success: true, message:"Product deleted successfully",data: result[0]});
               
        }
    })
    
});


//product update
app.put("/product/list/:pcode/:pname/:pprice",function (req, res){
    console.log("Update work");
    var sql = "update product set pname='"+req.params.pname+"',pprice="+req.params.pprice+" where pcode="+req.params.pcode;
    console.log(sql);
    Product.query(sql,function(err, result){
        if (err){
            return res.status(500).json({error:true, message:"Product editing failed"});
        } else {
            return res.status(200).json({success: true, message: "Product editedcsuccessfully"});
        }
    })
})



app.listen(process.env.PORT, () => console.log("server started on port 3000"));
