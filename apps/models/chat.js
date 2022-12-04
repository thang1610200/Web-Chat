var connect = require("../common/ConnectionDB.js");
var q = require("q");

var conn = connect.getConnection();

function addgroupchat(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("INSERT INTO chat SET ?",data,function(err,result){
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

function showchat(data){
    if(data){
        var defer = q.defer();
        var query = conn.query("SELECT * FROM chat WHERE sender = ? OR receiver = ?",[data.sender,data.receiver],function(err,result){
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
    addgroupchat: addgroupchat,
    showchat: showchat
}