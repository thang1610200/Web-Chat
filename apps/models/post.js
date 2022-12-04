var connect = require("../common/ConnectionDB.js");
var q = require("q");

var conn = connect.getConnection();

function addPost(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("INSERT INTO post SET ?",data,function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function findAllPost(data){
    var defer = q.defer();
    var query = conn.query("SELECT *,concat(images,video,music) as resource FROM post INNER JOIN user ON post.id_user = user.id INNER JOIN friend ON friend.id_friend_list = user.id WHERE id_user_f = " + data + " ORDER BY create_time_post DESC",function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}

function LikePost(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("INSERT INTO like_post SET ?",data,function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function DislikePost(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("DELETE FROM like_post WHERE id_post = ? AND id_user = ?;",[data.id_post,data.id_user],function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function CountLikePost(){
        var defer = q.defer();
        var query = conn.query("SELECT id_post,count(id_user) as count FROM like_post GROUP BY id_post",function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
}

function checkUserLike(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("SELECT * FROM like_post WHERE id_user = ?;",data,function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function listlikepost(){
    var defer = q.defer();
    var query = conn.query("SELECT * FROM like_post INNER JOIN user ON like_post.id_user = user.id",function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise; 
}

function comment(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("INSERT INTO comment SET ?",data,function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function showcommentpost(){
        var defer = q.defer();
        var query = conn.query("SELECT * FROM comment INNER JOIN user ON comment.id_user = user.id",function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
}
module.exports = {
    addPost: addPost,
    findAllPost: findAllPost,
    LikePost: LikePost,
    CountLikePost: CountLikePost,
    DislikePost: DislikePost,
    checkUserLike: checkUserLike,
    comment: comment,
    showcommentpost: showcommentpost,
    listlikepost:listlikepost
}