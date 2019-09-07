// Make connection , this socket differ from than in app.j
// this one run in browser
var socket = io.connect('http://localhost:4000');

const roomContainer = document.getElementById('room-container')

if(roomContainer){
    socket.on('room-created', room => {
        const roomElement = document.createElement('div')
        roomElement.innerText = room
        const roomLink = document.createElement('a')
        roomLink.href = `/${room}`
        roomLink.innerText = 'join'
        roomContainer.append(roomElement)
        roomContainer.append(roomLink)
      })
}
else{
    var handle = document.getElementById('handle');

    var objDiv = document.getElementById("chat-window");
    var online = document.getElementById('online')
    var message = document.getElementById('message');
    var btn = document.getElementById('send');
    var output = document.getElementById('output');
    var feedback = document.getElementById('feedback');
    
    appendMessage('you joined') // to see first to current-user only
    objDiv.scrollTop = objDiv.scrollHeight; // will add to every adding of data to scroll it
    
    // console.log(handle.value);
    
    socket.emit('new-user',roomName,handle.value) // to send name of user then add to name to object basic on socket.id
    socket.on('user-connected',data => {
        appendMessage(`${data} joined`) // to make appear in other users 'not current'
        objDiv.scrollTop = objDiv.scrollHeight;
    })
    
    // when press enter send msg
    message.addEventListener('keyup',event => {
        if(event.keyCode === 13){
            var msg = message.value // here we add instructions to user who only click the button before we send socket
            message.value='' // to remove data in msg from sender only 
            appendMessage(`You: ${msg}`) // i put this here because when i put in chat event below not listen because it broadcast
            objDiv.scrollTop = objDiv.scrollHeight;
            socket.emit('chat',{ // send event to server which we back to all users except current user
                message:msg ,
                handle:handle.value,
                roomName:roomName
            })
        }
    })
    
    // when click send on button
    btn.addEventListener('click',()=> { // see if arrow
        var msg = message.value // here we add instructions to user who only click the button before we send socket
        message.value='' // to remove data in msg from sender only 
        appendMessage(`You: ${msg}`) // i put this here because when i put in chat event below not listen because it broadcast
        objDiv.scrollTop = objDiv.scrollHeight;
        socket.emit('chat',{ // send event to server which we back to all users except current user
            message:msg ,
            handle:handle.value,
            roomName:roomName
        })
    }); // you can send from server data as emit not broad cast then remove all instruction above socket.emit
    
    // when typing on message
    message.addEventListener('keypress',()=>{
        socket.emit('typing',roomName,handle.value);
    })
    
    socket.on('typing',data => {
        feedback.innerHTML = '<p><em> ' + data + ' is typing now..' + '</em></p>';
        objDiv.scrollTop = objDiv.scrollHeight;
    })
    
    socket.on('chat',(data,name) => {
        feedback.innerHTML = '';// i need after i send msg this feed back gone from all users 
        output.innerHTML += '<p><strong>' + data.handle + '</strong>: ' + data.message;
        objDiv.scrollTop = objDiv.scrollHeight;
    });
    
    
    socket.on('user-disconnect',name =>{
        console.log(name);
        appendMessage(`${name} disconnected`)
        objDiv.scrollTop = objDiv.scrollHeight;
    
    })
    
    
    function appendMessage(message) {
        var output = document.getElementById('output');
        output.innerHTML += '<p><strong>' + message + '</strong></p>'
      }
    
      socket.on('logout',data => {
        var output = document.getElementById('output');
        output.innerHTML += '<p><strong>' + `${data} disconnected` +'</strong></p>'
        objDiv.scrollTop = objDiv.scrollHeight;
    })
    // }
    
    
}
// if(document.getElementById('room-container'))
// {
//     const roomContainer = document.getElementById('room-container')
// socket.on('room-created', room => {
//     const roomElement = document.createElement('div')
//     roomElement.innerText = room
//     const roomLink = document.createElement('a')
//     roomLink.href = `/${room}`
//     roomLink.innerText = 'join'
//     roomContainer.append(roomElement)
//     roomContainer.append(roomLink)
//   })
// }
// else{
 