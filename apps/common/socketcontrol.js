module.exports = function(io){
    io.sockets.on("connection",function(socket){
        console.log("Logged in user");

        //bắt sự kiện gửi tin nhắn từ phía client
        socket.on("send-message",function(message,stt,image){
            var data = {
                sender: "me",
                message: message,
                stt: stt,
                image: image
            }
    
            socket.emit("update-message",data); // khởi tạo sự kiện update-message
    
            var data = {
                sender: "you",
                message: message,
                stt: stt,
                image: image
            }
    
            socket.broadcast.emit("update-message",data); // khởi tạo sự kiện update-message cho tất cả User khác
        });


        // bắt sự kiện call - video
        socket.on("send-video",function(id,sender){
            var data = {
                id : id,
                sender: sender
            }
            socket.broadcast.emit("receive-video",data);
        });

        // bắt sự kiện join room call video
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).emit('user-connected', userId)
        })
    });
}