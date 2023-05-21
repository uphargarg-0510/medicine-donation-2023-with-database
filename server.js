// // var express = require("express");
// // var app = express();
// // const mongoose = require('mongoose');

// // const db="mongodb+srv://uphargarg:uphargarg@cluster0.aap0r9i.mongodb.net/medicinedonation?retryWrites=true&w=majority";

// // function chkconneciton(){
// //     mongoose.connect(db).then(()=>{
// //         console.log('Connected successfully');
// //     }).catch((err) =>{
// //         console.log(err);
// //     })
// // } 

// // chkconneciton();


// const express = require("express");
// const app = express();
// // const fileupload = require("express-fileupload");
// const MongoClient = require("mongodb").MongoClient;

// // app.use(fileupload());

// // const mongoURI = "mongodb+srv://uphargarg:uphargarg@cluster0.aap0r9i.mongodb.net/medicinedonation?retryWrites=true&w=majority";
// const mongoURI="mongodb+srv://uphargarg:uphargarg@cluster0.aap0r9i.mongodb.net/donation2023?retryWrites=true&w=majority"
// const dbName = "donation2023";
// const collectionName = "users";

// // app.listen(2004, function () {
// //     console.log("Server started");
// // });

// MongoClient.connect(mongoURI,function (err, client) {
    
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Connected to MongoDB");
//         const db = client.db(dbName);

//         app.listen(2004, function () {
//           console.log("Server started");
//         });

//         app.use(express.static("public"));

//         app.get("/", function (req, res) {
//             const fullpath = process.cwd() + "/public/index.html";
//             res.sendFile(fullpath);
//         });

//         app.get("/signup", function (req, res) {
//             const data = {
//                 email: req.query.txtEmail,
//                 password: req.query.txtPass,
//                 userType: req.query.utype,
//                 status: 1,
//             };

//             db.collection(collectionName).insertOne(data, function (err, result) {
//                 console.log(req.query.txtEmail + " " + req.query.txtPass + " " + req.query.utype);
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     res.send("Sign up successful");
//                 }
//             });

//             // Nodemailer code here
//         });

//         app.get("/login", function (req, res) {
//             const email = req.query.loginEmail;
//             const password = req.query.loginPassword;

//             db.collection(collectionName).findOne({ email: email, password: password, status: 1 }, function (err, result) {
//                 console.log(email + " " + password);
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     res.send(result);
//                 }
//             });
//         });

//         app.get("/settings", function (req, res) {
//             const email = req.query.txtUEmail;
//             const password = req.query.txtUPass;
//             const newPass = req.query.txtNewPass;

//             db.collection(collectionName).findOne({ email: email, password: password }, function (err, result) {
//                 if (err) {
//                     res.send(err);
//                 } else if (result) {
//                     db.collection(collectionName).updateOne({ email: email }, { $set: { password: newPass } }, function (err, result) {
//                         if (err) {
//                             res.send(err);
//                         } else {
//                             res.send("Updated successfully");
//                         }
//                     });
//                 } else {
//                     res.send("Invalid user");
//                 }
//             });
//         });

//         // Other routes and code go here
//     }
// });


var express = require("express");
var app = express();
var mysql = require("mysql");

var fileupload = require("express-fileupload");

app.use(fileupload());
var dbconfigurationobject = {
    host: "localhost",
    user: "root",
    password: "",
    database: "donation2022",
}

var dbref = mysql.createConnection(dbconfigurationobject);

dbref.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connected");
    }
})

app.listen(2004, function () {
    console.log("server started");
})

app.use(express.static("public"));
// app.use(express.urlencoded('extended:true'));
app.get("/", function (req, res) {
    var fullpath = process.cwd() + "/public/index.html";
    res.sendFile(fullpath);
})

app.get("/signup", function (req, res) {

    var dataarr = [req.query.txtEmail, req.query.txtPass, req.query.utype];
    dbref.query("insert into users values(?,?,?,1)", dataarr, function (err, result) {
        console.log(req.query.txtEmail + " " + req.query.txtPass + " " + req.query.utype);
        if (err) {+
            console.log(err);
        }
        else {
            res.send("sign up successfully");
        }
    })

    const nodemailer = require("nodemailer");
    //rjbhirnihazqnrvf

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "uphargarg982@gmail.com",
            pass: "rjbhirnihazqnrvf",
        },
    });

    const options = {
        from: "uphargarg982@gmail.com",
        to: req.query.txtEmail,
        subject: "Medicine Donation",
        text: "Welcome to Medicine donation Family",
    };

    transporter.sendMail(options, function (err, info) {
        if (err) { console.log(err); }
        else { console.log("Sent " + info.response) }
    });

})

app.get("/login", function (req, res) {

    dbref.query("select * from users where email=? and pwd=? and status=1", [req.query.loginEmail, req.query.loginPassword], function (err, result) {
        console.log(req.query.loginEmail + " " + req.query.loginPassword);
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })

})

app.get("/settings", function (req, res) {
    // var dataarr=[req.query.txtUEmail,req.query.txtUPass,req.query.];
    dbref.query("select * from users where email=? and pwd=?", [req.query.txtUEmail, req.query.txtUPass], function (err, result) {
        if (err)
            res.send(err);
        else
            if (result.length == 1) {
                dbref.query("update users set pwd=? where email =?", [req.query.txtNewPass, req.query.txtUEmail], function (err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else
                        res.send("updated successfully");
                })
            }
            else {
                res.send("Invalid Users");
            }
    })
})


app.use(express.urlencoded('extended:true'));
app.post("/donorprofile", function (req, res) {
    console.log(req.body);
    console.log(req.body.txtDonorFname);
    //res.send("idhr aaya??");


    console.log(req.files);

    var Idname = req.body.txtDonorEmail + "-" + req.files.DonorId.name;
    var Iddes = process.cwd() + "/public/uploads/" + Idname;
    req.files.DonorId.mv(Iddes, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("bdhai ho...!!");
        }
    })

    var Imgname = req.body.txtDonorEmail + "-" + req.files.DonorImg.name;
    var imgdes = process.cwd() + "/public/uploads/" + Imgname;
    req.files.DonorImg.mv(imgdes, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("bdhai ho...!!");
        }
    })

    var donordata = [req.body.txtDonorEmail, req.body.txtDonorFname, req.body.txtDonorLname, req.body.txtDonorMobileNumber, req.body.txtDonorAddress, req.body.txtDonorCity, req.body.txtDonorState, req.body.txtDonorCityZip, req.body.txtDonorSelectId, req.body.txtDonorContactTime, Idname, Imgname]


    dbref.query("insert into dprofile value(?,?,?,?,?,?,?,?,?,?,?,?)", donordata, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("inserted");
        }
    })
})

app.get("/search-fill", function (req, res) {
    dbref.query("select * from dprofile where email=?", [req.query.txtDonorEmail], function (err, result) {
        console.log(req.query.txtDonorEmail);
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

app.post("/availmedicine", function (req, res) {
    console.log(req.body);
    var Img = req.body.txtDonorEmail + "-" + req.files.MedicineImg.name;
    var imgdes = process.cwd() + "/public/uploads/" + Img;
    req.files.MedicineImg.mv(imgdes, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("bdhai ho...!!");
        }
    })

    var donordata = [req.body.txtDonorEmail, req.body.txtDonorMedicine, req.body.txtDonorPacking, req.body.txtDonorQuantity, req.body.txtDonorExpiryDate, req.body.txtDonorCompanyName, Img, req.body.Description]


    dbref.query("insert into medicines value(?,?,?,?,?,?,?,?,curdate())", donordata, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("inserted");
        }
    })
})

app.post("/profile-update", function (req, res) {
     console.log("-------------------------");
    // console.log(req.files.DonorId.name);
    // console.log("-------------------------");
    var Idname,Imgname;
    if(req.files==null)//DonorId == null && req.files.DonorImg == null)
    {
       Idname = req.body.hdn1;
       Imgname = req.body.hdn2;
    }
    else if (req.files.DonorId!= null && req.files.DonorImg!=null) {
        Idname = req.body.txtDonorEmail + "-" + req.files.DonorId.name;
        var des = process.cwd() + "/public/uploads/" + Idname;
        req.files.DonorId.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })

        Imgname = req.body.txtDonorEmail + "-" + req.files.DonorImg.name;
        var des = process.cwd() + "/public/uploads/" + Imgname;
        req.files.DonorImg.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })
    }
    else if(req.files.DonorId != null && req.files.DonorImg == null)
    {
        console.log("mai idhr if mai hu"+req.files.DonorId.name);
        Idname = req.body.txtDonorEmail + "-" + req.files.DonorId.name;
        var des = process.cwd() + "/public/uploads/" + Idname;
        req.files.DonorId.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })

        Imgname = req.body.hdn2;
    }
    else if(req.files.DonorId == null && req.files.DonorImg != null)
    {
        

        Idname = req.body.hdn1;

        console.log("mai idhr 2nd if mai hu"+req.files.DonorImg.name);
        Imgname = req.body.txtDonorEmail + "-" + req.files.DonorImg.name;
        var des = process.cwd() + "/public/uploads/" + Imgname;
        req.files.DonorImg.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })
    }
    
    
        

    // form wale name and order should be same as table's colms
    var donordata = [req.body.txtDonorFname, req.body.txtDonorLname, req.body.txtDonorMobileNumber, req.body.txtDonorAddress, req.body.txtDonorCity, req.body.txtDonorState, req.body.txtDonorCityZip, req.body.txtDonorSelectId, req.body.txtDonorContactTime, Idname, Imgname,req.body.txtDonorEmail]
    dbref.query("update dprofile set name=?,lname=?, mobile=?,address=?, city=? , state=?, zip=? ,prooftype=?,timings=?,proofpic=?,profilepic=?where email=?", donordata, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send("Inserted Successfully");
    })
})

app.get("/fetchAllRecords",function(req,res){
    dbref.query("select * from users",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

app.get("/fetchAllDonorRecords",function(req,res){
    // console.log("donor k sare record dekhne aaya hu");
        
    dbref.query("select * from dprofile",function(err,result){
        console.log("donor k sare record dekhne aaya hu");
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

app.get("/block-status",function(req,res){
    dbref.query("update users set status=0 where email=?",[req.query.email],function(err,result){
        // console.log("update krne aa gya mai");
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("User Blocked");
        }
    })
})


app.get("/resume-status",function(req,res){
    dbref.query("update users set status=1 where email=?",[req.query.email],function(err,result){
        // console.log("update krne aa gya mai");
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("User Un-Blocked");
        }
    })
})

app.get("/delete-donor",function(req,res){
    dbref.query("delete from dprofile where email=?",[req.query.email],function(err,result){
        if(err)
            res.send(err);
        else
            res.send(result);
})
})

app.post("/Needyprofile",function(req,res){
    console.log(req.body);
    console.log(req.body.txtNeedyFname);
    //res.send("idhr aaya??");


    console.log(req.files);

    var Idname = req.body.txtNeedyEmail + "-" + req.files.NeedyId.name;
    var Iddes = process.cwd() + "/public/uploads/" + Idname;
    req.files.NeedyId.mv(Iddes, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("bdhai ho...!!");
        }
    })

    var Imgname = req.body.txtNeedyEmail + "-" + req.files.NeedyImg.name;
    var imgdes = process.cwd() + "/public/uploads/" + Imgname;
    req.files.NeedyImg.mv(imgdes, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("bdhai ho...!!");
        }
    })

    var Needydata = [req.body.txtNeedyEmail, req.body.txtNeedyFname, req.body.txtNeedyLname, req.body.txtNeedyMobileNumber, req.body.txtNeedyAddress, req.body.txtNeedyCity, req.body.txtNeedyState, req.body.txtNeedyCityZip, req.body.txtNeedySelectId, req.body.txtNeedyContactTime, Idname, Imgname]


    dbref.query("insert into nprofile value(?,?,?,?,?,?,?,?,?,?,?,?)", Needydata, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("inserted");
        }
    })
})

app.post("/Needy-profile-update", function (req, res) {
    // console.log("-------------------------");
    // console.log(req.files.NeedyId.name);
    // console.log("-------------------------");
    var Idname,Imgname;
    if(req.files==null)//NeedyId == null && req.files.NeedyImg == null)
    {
       Idname = req.body.hdn1;
       Imgname = req.body.hdn2;
    }
    else if (req.files.NeedyId!= null && req.files.NeedyImg!=null) {
        Idname = req.body.txtNeedyEmail + "-" + req.files.NeedyId.name;
        var des = process.cwd() + "/public/uploads/" + Idname;
        req.files.NeedyId.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })

        Imgname = req.body.txtNeedyEmail + "-" + req.files.NeedyImg.name;
        var des = process.cwd() + "/public/uploads/" + Imgname;
        req.files.NeedyImg.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })
    }
    else if(req.files.NeedyId != null && req.files.NeedyImg == null)
    {
        console.log("mai idhr if mai hu"+req.files.NeedyId.name);
        Idname = req.body.txtNeedyEmail + "-" + req.files.NeedyId.name;
        var des = process.cwd() + "/public/uploads/" + Idname;
        req.files.NeedyId.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })

        Imgname = req.body.hdn2;
    }
    else if(req.files.NeedyId == null && req.files.NeedyImg != null)
    {
        

        Idname = req.body.hdn1;

        console.log("mai idhr 2nd if mai hu"+req.files.NeedyImg.name);
        Imgname = req.body.txtNeedyEmail + "-" + req.files.NeedyImg.name;
        var des = process.cwd() + "/public/uploads/" + Imgname;
        req.files.NeedyImg.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })
    }
    
        

    // form wale name and order should be same as table's colms
    var Needydata = [req.body.txtNeedyFname, req.body.txtNeedyLname, req.body.txtNeedyMobileNumber, req.body.txtNeedyAddress, req.body.txtNeedyCity, req.body.txtNeedyState, req.body.txtNeedyCityZip, req.body.txtNeedySelectId, req.body.txtNeedyContactTime, Idname, Imgname,req.body.txtNeedyEmail]
    dbref.query("update nprofile set name=?,lname=?, mobile=?,address=?, city=? , state=?, zip=? ,prooftype=?,timings=?,proofpic=?,profilepic=?where email=?", Needydata, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send("Inserted Successfully");
    })
})

app.get("/needy-search-fill", function (req, res) {
    dbref.query("select * from nprofile where email=?", [req.query.txtNeedyEmail], function (err, result) {
        console.log(req.query.txtNeedyEmail);
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

app.get("/fetchcity",function(req,res){
    dbref.query("select distinct city from dprofile",function(err,resultcity){
        console.log(resultcity);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultcity);
            res.send(resultcity);
        }
    })
})

app.get("/fetchmed",function(req,res){
    dbref.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.email where dprofile.city=?",[req.query.city],function(err,resultmed){
        console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    })
})

app.get("/fetchdonor",function(req,res){
    // dbref.query("select * from dprofile inner join medicines on dprofile.email=medicines.emailid where dprofile.city=? and medicines.medicine=?",[req.query.city,req.query.med],function(err,response){
    //     if(err)
    //     {
    //         res.send(err);
    //     }
    //     else
    //     {
    //         res.send(response);
    //     }
    // })

    dbref.query("select dprofile.* , medicines.* from dprofile join medicines on dprofile.email=medicines.emailid where dprofile.city=? and medicine=?",[req.query.city,req.query.med],function(err,response){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(response);
        }
    })
})

app.get("/fetchdetails",function(req,res){
    dbref.query("select dprofile.* , medicines.* from dprofile join medicines on dprofile.email=medicines.emailid where email=?",[req.query.email],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send(result);
        }
    })
})

app.get("/fetchAllmeds",function(req,res){
    dbref.query("select * from medicines where emailid=?",[req.query.email],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result)
        }
    })
})

app.get("/delete-med",function(req,res){
    dbref.query("delete from medicines where medicine=?",[req.query.med],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})