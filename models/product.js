var mysql =  require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test"
} );

con.connect(function(err){
    if (err) throw err;
    console.log("Connected");
    var product = "create table if not exists product (pname varchar(20), pcode int not null primary key,pprice int,pcategory varchar(20));"
    con.query(product,function(err, result){
        if (err) throw err;
        console.log("Product Table created!")
    }); 
});

module.exports = con;