var express = require("express");
var user_model = require("../models/user.js");
var chat_model = require("../models/chat.js");

var router = express.Router();

router.post("/addchat",function(req,res){
    var data = {
        sender: req.body.sender,
        receiver:req.body.receiver,
        message: req.body.message
    }

    var addchat = chat_model.addgroupchat(data);
    addchat.then(function(result){
        res.json({status_code:200});
    }).catch(function(err){
        res.json({status_code:500});
    })
});

router.get("/:id",function(req,res){
    if(req.session.username){
    var user = user_model.searchid(req.params.id);
    user.then(function(result){
        var data_user = result[0];
        var friend_chat = user_model.friend_list(data_user.id);
        friend_chat.then(function(friend){
            var data = {
                sender: data_user.id,
                receiver: data_user.id
            }
            var showchat = chat_model.showchat(data);
            showchat.then(function(show){
                var noticelist = user_model.listnotice();
                noticelist.then(function(nl){
                    res.render("info_user/chat",{data:data_user,friend:friend,message:show,notice:nl});  
                }).catch(function(err){
                    console.log(err);
                })
            }).catch(function(err){
                console.log(err);
            })  
        }).catch(function(err){
            console.log(err);
        })
    }).catch(function(err){
        console.log(err);
    })
}
else{
    res.redirect("/login");
}
});

router.get("/video/:room",function(req,res){
    if(req.session.username){
    res.render('info_user/room',{roomId:req.params.room});
    }
    else{
        res.redirect("/login");
    }
})
module.exports = router;