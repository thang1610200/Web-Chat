var connect = require("../common/ConnectionDB");
var q = require("q");

var conn = connect.getConnection();

function addUser(user){
    if(user){
        var defer = q.defer();

        var query = conn.query("INSERT INTO user SET ?",user,function(err,result){
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

function addGeneral(user){
    if(user){
        var defer = q.defer();

        var query = conn.query("INSERT INTO infor SET id_user = ?",user,function(err,result){
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

function searchEmail(email){
    if(email){
        var defer = q.defer();

        var query = conn.query('SELECT * FROM user WHERE ?',{email:email},function(err,result){
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

function searchid(id){
    if(id){
        var defer = q.defer();

        var query = conn.query('SELECT * FROM user INNER JOIN infor ON user.id = infor.id_user WHERE user.id = ?',id,function(err,result){
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

//update infor
function updateuser(data){
    if(data){
        var defer = q.defer();

        var query = conn.query("UPDATE user SET gender = ?, about = ?, location = ?, country = ?, display_name = ?, update_time = ?, image = ?, occupation = ? WHERE id = ?",
        [data.gender,data.about,data.location,data.country,data.display_name,data.update_time,data.avatar,data.occupation,data.id],function(err,result){
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

// update infor No images
function updateusernoimage(data){
    if(data){
        var defer = q.defer();

        var query = conn.query("UPDATE user SET gender = ?, about = ?, location = ?, country = ?, display_name = ?, update_time = ?, occupation = ? WHERE id = ?",
        [data.gender,data.about,data.location,data.country,data.display_name,data.update_time,data.occupation,data.id],function(err,result){
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

//update table infor
function updateGeneral(data){
    if(data){
        var defer = q.defer();
        var query = conn.query('UPDATE infor SET education = ?, hobbies = ?, other_interest = ?, work = ? WHERE id_user = ?',
        [data.education,data.hobbies,data.interest,data.work,data.id_user],function(err,result){
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

// search id_user co trong table infor chua
function searchidGeneral(id){
    if(id){
        var defer = q.defer();

        var query = conn.query('SELECT * FROM infor WHERE ?',{id_user:id},function(err,result){
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

// liet ke danh sach cac user
function listuser(){
    var defer = q.defer();
    var query = conn.query("SELECT * FROM user",function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}

//Them ban be
function addfriend(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("INSERT INTO friend SET ?",data,function(err,result){
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

//danh sach ban be cuar user .....
function friend_list(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("SELECT * FROM friend INNER JOIN user ON friend.id_friend_list = user.id WHERE id_user_f =  ?",data,function(err,result){
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

// gửi 1 yêu cầu add friend
function requestaddfriend(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("INSERT INTO notice_add SET ?",data,function(err,result){
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

//danh sách các yêu cầu
function listnotice(){
    var defer = q.defer();
    var query = conn.query("SELECT * FROM notice_add INNER JOIN user ON notice_add.id_sender = user.id",function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }
    });
    return defer.promise;
}

// xóa danh sách notice
function removenotice(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("DELETE FROM notice_add WHERE id_sender = ? AND id_receiver = ?",[data.id_sender,data.id_receiver],function(err,result){
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

//reset pass
function resetpass(data){
    if(data){
        var defer = q.defer();
        var query = conn.query('UPDATE user SET pass = ?, update_time = ? WHERE email = ? and sdt = ?',
        [data.pass,data.update,data.email,data.sdt],function(err,result){
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

// kiểm tra email và sdt có tồn tại ko
function searchemailsdt(data){
    if(data){
        var defer = q.defer();

        var query = conn.query('SELECT * FROM user WHERE email = ? and sdt = ?',[data.email,data.sdt],function(err,result){
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
module.exports = {
    addUser:addUser,
    searchEmail: searchEmail,
    searchid: searchid,
    updateuser: updateuser,
    updateusernoimage: updateusernoimage,
    updateGeneral: updateGeneral,
    addGeneral: addGeneral,
    searchidGeneral: searchidGeneral,
    listuser: listuser,
    addfriend: addfriend,
    friend_list: friend_list,
    requestaddfriend: requestaddfriend,
    listnotice: listnotice,
    removenotice: removenotice,
    resetpass: resetpass,
    searchemailsdt: searchemailsdt
};