var mysql =  require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test"
} );
console.log("Hiii");

con.connect(function(err){
    if (err) throw err;
    console.log("Connected");
    var user = "create table if not exists user (name varchar(20), email varchar(20) not null primary key,phone varchar(20),password varchar(20) not null, cpswd varchar(20) not null);"
    con.query(user,function(err, result){
        if (err) throw err;
        console.log("Table created!")
    }); 
});

module.exports = con;