var express = require("express");
var user_model = require("../models/user.js");
var handle = require("../helpers/handleString.js");
var post_model = require("../models/post.js")
var fs = require("fs");
var multer = require("multer");

var router = express.Router();

var storage = multer.diskStorage({
    destination:function(req,file,callback){
        var dir = "./public/images/post";

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null,dir);
    },
    filename: function(req,file,callback){
        callback(null,file.originalname);
    }
});

var upload_images = multer({storage:storage}).array('images',10);

router.post("/likeajax",function(req,res){
    var data = {
        id_post: req.body.id_post,
        id_user: req.body.id_user,
        like_date: new Date()
    }

    var LikePost = post_model.LikePost(data);
    LikePost.then(function(result){
        res.json({status_code: 200});
    }).catch(function(err){
        res.json({status_code: 500});
    })
});

router.delete("/deletelikeajax",function(req,res){
    var data = {
        id_post: req.body.id_post,
        id_user: req.body.id_user
    }

    var LikePost = post_model.DislikePost(data);
    LikePost.then(function(result){
        res.json({status_code: 200});
    }).catch(function(err){
        res.json({status_code: 500});
    })
});

router.post("/confirm",function(req,res){
    var data = {
        id_user_f: req.body.id_user_f,
        id_friend_list: req.body.id_friend_list
    }

    var addfriend = user_model.addfriend(data);
    addfriend.then(function(result){
        var dataa = {
            id_user_f: req.body.id_friend_list,
            id_friend_list: req.body.id_user_f
        }
        var addfriendd = user_model.addfriend(dataa);
        addfriendd.then(function(qq){
           var datadelete = {
            id_sender: req.body.id_friend_list,
            id_receiver: req.body.id_user_f
           }
           var deletenotice = user_model.removenotice(datadelete);
           deletenotice.then(function(ss){
            res.json({status_code:200});
           }).catch(function(err){
            res.json({status_code:500});
           })
        }).catch(function(err){
            res.json({status_code:500});
        })
    }).catch(function(err){
        res.json({status_code:500});
    })
});

router.delete("/delete",function(req,res){
    var data = {
        id_sender: req.body.id_friend_list,
        id_receiver:req.body.id_user_f
    }
    var removenotice = user_model.removenotice(data);
    removenotice.then(function(result){
        res.json({status_code:200});
    }).catch(function(err){
        res.json({status_code:500});
    })
});
// comment
router.post("/comment",function(req,res){
    var data = {
        content: req.body.comment,
        id_post: req.body.post_id,
        id_user: req.body.id_user,
        create_time_comment: new Date()
    }

    var comment = post_model.comment(data);
    comment.then(function(result){
        res.json({status_code:200});
    }).catch(function(err){
        res.json({status_code:500});
    })
});

// add friend
router.post("/addfriend",function(req,res){
    var data = {
        id_sender: req.body.id_user,
        id_receiver: req.body.id_friend,
        create_time_send: new Date()
    };

    var addfriend = user_model.requestaddfriend(data);
    addfriend.then(function(result){
        res.json({status_code:200});
    }).catch(function(err){
        res.json({status_code:500});
    })
});

router.get("/",function(req,res){
    if(req.session.username){
    var info = req.session.username;
    var user = user_model.searchEmail(info.email);
    user.then(function(result){
        var data_user = result[0];
        var searchidGeneral = user_model.searchidGeneral(data_user.id);
        searchidGeneral.then(function(test){
            var params = test[0];
            if(params == undefined){
                var general = user_model.addGeneral(data_user.id);   
                general.then(function(answer){
                    var count;
                    var count_like = post_model.CountLikePost();
                    count_like.then(function(row){
                        count = row;
                    }).catch(function(err){
                        console.log(err);
                    });

                    var likes =[];
                    var check_like = post_model.checkUserLike(data_user.id);
                    check_like.then(function(likee){
                        likes = likee;
                    }).catch(function(err){
                        console.log(err);
                    });

                    var comments = [];
                    var showcoment = post_model.showcommentpost();
                    showcoment.then(function(coment){
                        comments = coment;
                    }).catch(function(err){
                        console.log(err);
                    })

                    var listlikepost = [];
                    var listlike = post_model.listlikepost()
                    listlike.then(function(listlike){
                        listlikepost = listlike;
                    }).catch(function(err){
                        console.log(err);
                    })

                    var user_list = [];
                    var listuser = user_model.listuser();
                    listuser.then(function(userl){
                        user_list = userl;
                    }).catch(function(err){
                        console.log(err);
                    })

                    var f_list = [];
                    var friend_list = user_model.friend_list(data_user.id);
                    friend_list.then(function(fl){
                        f_list = fl;
                    }).catch(function(err){
                        console.log(err);
                    })

                    var notice_list = [];
                    var noticelist = user_model.listnotice();
                    noticelist.then(function(nl){
                        notice_list = nl;
                    }).catch(function(err){
                        console.log(err);
                    })
                    var post_all = post_model.findAllPost(data_user.id);
                    post_all.then(function(test){
                        res.render("info_user/index",{data:data_user,post:test,like:count,check:likes,show:comments,list_like:listlikepost,user:user_list,friend:f_list,notice:notice_list});
                    }).catch(function(err){
                        res.send(err);
                    })
                }).catch(function(err){
                    res.json({Error:err});
                });
            }
            else{
                var count;
                var count_like = post_model.CountLikePost();
                count_like.then(function(row){
                    count = row;
                }).catch(function(err){
                    console.log(err);
                });

                var likes =[];
                var check_like = post_model.checkUserLike(data_user.id);
                check_like.then(function(likee){
                    likes = likee;
                }).catch(function(err){
                    console.log(err);
                });

                var comments = [];
                var showcoment = post_model.showcommentpost();
                showcoment.then(function(coment){
                    comments = coment;
                }).catch(function(err){
                    console.log(err);
                })

                var listlikepost = [];
                var listlike = post_model.listlikepost()
                listlike.then(function(listlike){
                    listlikepost = listlike;
                }).catch(function(err){
                    console.log(err);
                })

                var user_list = [];
                var listuser = user_model.listuser();
                listuser.then(function(userl){
                    user_list = userl;
                }).catch(function(err){
                    console.log(err);
                })

                var f_list = [];
                var friend_list = user_model.friend_list(data_user.id);
                friend_list.then(function(fl){
                    f_list = fl;
                }).catch(function(err){
                    console.log(err);
                })

                var notice_list = [];
                var noticelist = user_model.listnotice();
                noticelist.then(function(nl){
                    notice_list = nl;
                }).catch(function(err){
                    console.log(err);
                })
                var post_all = post_model.findAllPost(data_user.id);
                post_all.then(function(test){
                    res.render("info_user/index",{data:data_user,post:test,like:count,check:likes,show:comments,list_like:listlikepost,user:user_list,friend:f_list,notice:notice_list});
                }).catch(function(err){
                    res.send(err);
                })
        }
        }).catch(function(err){
            res.json({Error:err});
        });
    }).catch(function(err){
        res.json({Error:err});
    });
}
    else{
        res.redirect("/login");
    }
});

router.get("/edit/:id",function(req,res){
    if(req.session.username){
    var id = req.params.id;
    var user = user_model.searchid(id);
    user.then(function(result){
        var data_user = result[0];
        var friend_list = user_model.friend_list(data_user.id);
        friend_list.then(function(fl){
            var noticelist = user_model.listnotice();
            noticelist.then(function(nl){
                res.render("info_user/edit",{data:data_user,friend:fl,notice:nl});
            }).catch(function(err){
                console.log(err);
            })
        }).catch(function(err){
            console.log(err);
        })
    }).catch(function(err){
        res.json({Error:err});
    });
}
    else{
        res.redirect("/login");
    }
});

router.put("/edit",function(req,res){
    if(req.session.username){
    var infor = req.body;
    if(infor.notice == "favorite"){ // Xử lý phần general infor updated
        var data = {
            education: infor.education,
            hobbies: infor.hobbies,
            interest: infor.interest,
            work: infor.work,
            id_user: infor.id
        }
        var general = user_model.updateGeneral(data);
        general.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500});
        });
    }
    else{ // Xử lý phần profile updated
    //update tất cả các thông tin bao gồm cả ảnh
    if(infor.image_name != ""){
    var path = './public/images/user/'+ req.body.id + req.body.image_name;
    var image    = req.body.image_data;
    var data     = image.split(',')[1];
    fs.writeFileSync(path,data,{encoding:'base64'});    
    var params = {
        gender: infor.gender,
        about: infor.about,
        location: infor.location,
        country: infor.country,
        display_name: infor.name,
        update_time: new Date(),
        id: infor.id,
        occupation: infor.occupation,
        avatar: infor.id + infor.image_name
    }
    var infor_update = user_model.updateuser(params);
    infor_update.then(function(result){
        res.json({status_code: 200});
    }).catch(function(err){
        res.json({status_code: 500});
    });
    }
    //update tất cả các thông tin ko có ảnh
    else{
        var params = {
            gender: infor.gender,
            about: infor.about,
            location: infor.location,
            country: infor.country,
            display_name: infor.name,
            update_time: new Date(),
            id: infor.id,
            occupation: infor.occupation,
        }
        var infor_update = user_model.updateusernoimage(params);
        infor_update.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500});
        }); 
    }
}
    }
    else{
        res.redirect("/login");
    }

});

router.get("/view/:id",function(req,res){
    if(req.session.username){
    var id = req.params.id;
    var user = user_model.searchid(id);
    user.then(function(result){
        var data_user = result[0];
        var friend_list = user_model.friend_list(data_user.id);
        friend_list.then(function(fl){
            var noticelist = user_model.listnotice();
            noticelist.then(function(nl){
                res.render("info_user/view",{data:data_user,friend:fl,notice:nl});
            }).catch(function(err){
                console.log(err);
            })
        }).catch(function(err){
            console.log(err);
        })
    }).catch(function(err){
        res.json({Error:err});
    });
}
    else{
        res.redirect("/login");
    }
});

// Thêm mới post
router.post("/",function(req,res){
    if(req.session.username){
    upload_images(req,res,function(err){
        var post = req.body;
        if(err){
            res.send("Error");
        }
        else{
            var arr = req.files;
            var image_data = " ";
            var video_data = " ";
            var music_data = " ";
            for (var i = 0; i < arr.length; i++){
                if(arr[i].mimetype == "image/png" || arr[i].mimetype == "image/jpg" || arr[i].mimetype == "image/jpeg"){
                 image_data += arr[i].originalname + ";";
            }
               else if(arr[i].mimetype == "video/webm" || arr[i].mimetype == "video/mp4"){
                     video_data += arr[i].originalname + ";";
                }

               else if(arr[i].mimetype == "audio/mpeg"){
                     music_data += arr[i].originalname + ";";
                }
        }
        var data = {
            content: post.content,
            images: image_data.trim(),
            video: video_data.trim(),
            music: music_data.trim(),
            id_user:post.id ,
            create_time_post: new Date(),
            update_time_post: new Date()
        }
        var addPost = post_model.addPost(data);
        addPost.then(function(result){
                        var data_like = {
                            id_post: result.insertId
                        }
                        var addlike = post_model.LikePost(data_like);
                        addlike.then(function(result){
                            console.log("Success");
                        }).catch(function(err){
                            console.log(err);
                        })
            var info = req.session.username;
            var user = user_model.searchEmail(info.email);
            user.then(function(result){
                var data_user = result[0];
                var count;
                var count_like = post_model.CountLikePost();
                count_like.then(function(row){
                    count = row;
                }).catch(function(err){
                    console.log(err);
                });

                var likes =[];
                var check_like = post_model.checkUserLike(data_user.id);
                check_like.then(function(likee){
                    likes = likee;
                }).catch(function(err){
                    console.log(err);
                });

                var comments = [];
                var showcoment = post_model.showcommentpost();
                showcoment.then(function(coment){
                    comments = coment;
                }).catch(function(err){
                    console.log(err);
                })

                var listlikepost = [];
                var listlike = post_model.listlikepost()
                listlike.then(function(listlike){
                    listlikepost = listlike;
                }).catch(function(err){
                    console.log(err);
                })

                var user_list = [];
                var listuser = user_model.listuser();
                listuser.then(function(userl){
                    user_list = userl;
                }).catch(function(err){
                    console.log(err);
                })

                var f_list = [];
                var friend_list = user_model.friend_list(data_user.id);
                friend_list.then(function(fl){
                    f_list = fl;
                }).catch(function(err){
                    console.log(err);
                })

                var notice_list = [];
                var noticelist = user_model.listnotice();
                noticelist.then(function(nl){
                    notice_list = nl;
                }).catch(function(err){
                    console.log(err);
                })
                var post_all = post_model.findAllPost(data_user.id);
                post_all.then(function(test){
                    res.render("info_user/index",{data:data_user,post:test,like:count,check:likes,show:comments,list_like:listlikepost,user:user_list,friend:f_list,notice:notice_list});
                }).catch(function(err){
                    res.send(err);
                })
            }).catch(function(err){
                res.json({Error:err});
            });
        }).catch(function(err){
            res.render(err);
        })
    }
});
    }
    else{
        res.redirect("/login");
    }
});
module.exports = router;