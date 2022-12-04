var bcrypt = require("bcrypt");
var config = require("config");

function hashPass(pass){ // hàm dùng để mã hóa mật khẩu
    var SaltRound = config.get("salt"); //key mã hóa

    var Salt = bcrypt.genSaltSync(SaltRound);
    var hash = bcrypt.hashSync(pass,Salt);

    return hash;

}

function compare_pass(pass,hash){   // dùng để kiểm tra khi login có đúng mật khẩu của email đó không
    return bcrypt.compareSync(pass,hash);
}

module.exports = {
    hashPass: hashPass,
    compare_pass: compare_pass
}