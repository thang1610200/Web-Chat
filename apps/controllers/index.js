var express = require("express");
var hashpass = require("../helpers/hashpass");
var user_model = require("../models/user");
var router = express.Router();
var sms = require("../helpers/sms");

var text_OTP = "";
var saveee = {};
router.use("/home",require(__dirname + "/user.js"));
router.use("/chat",require(__dirname + "/chat.js"));

router.get("/login",function(req,res){
    res.render("login",{data:{}});
});

router.post("/login",function(req,res){
    var user = req.body;

    var user_login = user_model.searchEmail(user.email);
    if(user.email.trim().length == 0 || user.password.trim().length == 0){
        let err = {
            message : "Email or password is blank",
            error: true
        };
        res.render("login",{data:err});
    }
    else{
    user_login.then(function(result){
        var save = result[0];
        if(save && hashpass.compare_pass(user.password,save.pass)){
            req.session.username = user;
            res.redirect("/home");
        }
        else{
            let err = {
                message : "Email does not exist",
                error: true
            };

            res.render("login",{data:err});
        }
    }).catch(function(err){
        let error = {
            message : "Error",
            error: true
        };
        res.render("login",{data:error});
    });
    }
});

router.get("/register",function(req,res){
        res.render("register",{data:{}});
    });

router.post("/register",function(req,res){
        var user = req.body;

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // email
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g; // sđt

        var passs = hashpass.hashPass(user.password); // Mã hóa mật khẩu 

        if(user.password.trim().length == 0 || user.mobile_n.trim().length == 0 || user.mobile_n.trim().length == 0 ||
            user.fname.trim().length == 0 || user.lname.trim().length == 0 || user.bdate.trim().length == 0 || user.gender == undefined){
            var err = {
                message: "Empty fields",
                error: true
            }
            res.render("register",{data:err});
        }
        else{
        var semail = user_model.searchEmail(user.email);// tìm email đã có trong danh sách chưa!!
        semail.then(function(data){
            var save = data[0];
            if(!filter.test(user.email)){
                var err = {
                    message: "Invalid email",
                    error: true
                }
                res.render("register",{data:err});
            }
            else if(save){
                var err = {
                    message: "Email already exists",
                    error: true
                }
                 res.render("register",{data:err});
            }
            else if(!vnf_regex.test(user.mobile_n)){
                var err = {
                    message: "Invalid phone number",
                    error: true
                }
                res.render("register",{data:err});
            }
            else{
                var image;
                if(user.gender == "male"){
                    image = "nam.jpg";
                }
                else{
                    image = "nu.jpg";
                }
                var adduser = {
                    email: user.email,
                    pass: passs,
                    first_name:user.fname,
                    last_name: user.lname,
                    birthday: user.bdate,
                    create_time: new Date(),
                    update_time: new Date(),
                    sdt: user.mobile_n,
                    gender: user.gender,
                    display_name: user.fname + " " + user.lname,
                    image: image
                }
                saveee = adduser;// save thông tin cần insert
               res.redirect("/code");
            }
        }).catch(function(err){
            var erro = {
                message: "Error",
                error: true
            }
            //console.log(err);
            res.render("register",{data:erro});
        });
    }
    });

router.get("/code",function(req,res){
    var from = "UTE";
    var to = "84" + saveee.sdt.slice(1);
    var text = sms.getRandomInt().toString();
    text_OTP = text;
    console.log(text_OTP);
    //sms.sms(from,to,text);
    res.render("code",{data:{}});
});

router.post("/code",function(req,res){
    var code_verify = req.body;

    if(text_OTP == code_verify.code){
            var result = user_model.addUser(saveee);
           //  Thông báo kết quả khi thêm vào CSDL success hay ko
            result.then(function(data){
              var searchid = user_model.searchEmail(saveee.email);
              searchid.then(function(text){
                    var texxt = text[0]; 
                    var data_friend = {
                        id_user_f : texxt.id,
                        id_friend_list : texxt.id
                    }
                    var addfriend = user_model.addfriend(data_friend);
                    addfriend.then(function(result){
                        res.redirect("/login");
                    }).catch(function(err){
                        console.log(err);
                    })
              }).catch(function(err){
                console.log(err);
              })
            }).catch(function(err){
                var erro = {
                    message: "Error",
                    error: true
                }
                res.render("code",{data:erro});
            });
    }
});

router.get("/resetpass",function(req,res){
    res.render("reset_pass",{data:{}});
});

router.post("/resetpass",function(req,res){
    var email = req.body.email;
    var sdt = req.body.mobile_n;
    var newpass = req.body.password;
    if(email.trim().length == 0 || sdt.trim().length == 0 || newpass.trim().length == 0){
        var err = {
            message: "Empty fields",
            error: true
        }
        res.render("reset_pass",{data:err});
    }
    else{
        var infor = {
            email: email,
            sdt: sdt
        }
        var search = user_model.searchemailsdt(infor);
        search.then(function(result){
            var rs = result[0];
            if(rs == undefined){
                var err = {
                    message: "Email or SDT don't exists",
                    error: true
                }
                 res.render("reset_pass",{data:err});
            }
            else{
            var memory = {
                email: email,
                sdt: sdt,
                pass: hashpass.hashPass(newpass),
                update: new Date()
            }
            var update = user_model.resetpass(memory);
            update.then(function(ss){
                res.redirect("/login");
            }).catch(function(err){
                console.log(err);
            })
        }
        }).catch(function(err){
            console.log(err);
        });
    }
});

router.get("/logout",function(req,res){
    if(req.session.username){
        req.session.username = null;
        res.redirect("/login");
    }
    else{
        res.redirect("/login");
    }
});
module.exports = router;