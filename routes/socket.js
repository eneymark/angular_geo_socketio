/*
 * Serve content over a socket
 */
var _sockets = {};
var _connections = {};
module.exports = function (socket) {

  socket.on('user:connected', function(data) {
    if(data) {
      _connections[socket.id] = {socket:socket.id, coords:data.coords, name:data.name, role:data.role};
      _sockets[socket.id] = socket;
      socket.broadcast.emit("new:guy", {coords:data.coords, socket:socket.id, name:data.name, role:data.role});
    }

  });
  socket.on("sent:message", function(data){
    var friend = _sockets[data.socket];
    if(friend) {
      _sockets[data.socket].emit("new:message", {message:data.message, name:data.name, from:data.from});  
    } 
  });

  socket.on("send:coords", function(data){
  	socket.broadcast.emit('new:coords', {coords:data, socket:socket.id});
    socket.emit("all:coords", {all:_connections});
  });

  };
