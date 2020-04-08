// Make connection , this socket differ from than in app.j, this one run in browser , other run in the server
var socket = io.connect('https://dry-cliffs-11237.herokuapp.com');
// var socket = io.connect('http://localhost:9999');

var handle = document.getElementById('handle'); // hidden input
var objDiv = document.getElementById("chat-window");
var message = document.getElementById('message');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

appendMessage('you joined') // to see first to current-user only
objDiv.scrollTop = objDiv.scrollHeight; // will add to every adding of data to scroll it


socket.emit('new-user', roomName, handle.value) // Send userName & roomName

socket.on('user-connected', data => {
    appendMessage(`${data} joined`) // to make appear in other users 'not current' , because it's broadcast
    objDiv.scrollTop = objDiv.scrollHeight;
})

// when press enter send msg
message.addEventListener('keyup', event => {
    if (message.value !== '') {
        if (event.keyCode === 13) {
            var msg = message.value // here we add instructions to user who only click the button before we send socket
            message.value = '' // to remove data in msg from sender only 
            appendMessage(`You: ${msg}`) // i put this here because when i put in chat event below not listen because it broadcast from server
            objDiv.scrollTop = objDiv.scrollHeight;
            socket.emit('chat', { // send event to server which we back to all users except current user
                message: msg,
                handle: handle.value,
                roomName: roomName
            })
        }
    }
})

// when click send on button
btn.addEventListener('click', () => { 
    if(message.value !== ''){
        var msg = message.value // here we add instructions to user who only click the button before we send socket
        message.value = '' // to remove data in msg from sender only 
        appendMessage(`You: ${msg}`) // i put this here because when i put in chat event below not listen because it broadcast
        objDiv.scrollTop = objDiv.scrollHeight;
        socket.emit('chat', { // send event to server which we back to all users except current user
            message: msg,
            handle: handle.value,
            roomName: roomName
        })
    }
});

// when typing on message
message.addEventListener('keypress', () => {
    socket.emit('typing', roomName, handle.value);
})

socket.on('typing', userName => {
    feedback.innerHTML = '<p><em> ' + userName + ' is typing now..' + '</em></p>';
    objDiv.scrollTop = objDiv.scrollHeight;
})

socket.on('chat', (data) => {
    feedback.innerHTML = '';// i need after i send msg this feed back gone from all users 
    output.innerHTML += '<p><strong>' + data.handle + '</strong>: ' + data.message;
    objDiv.scrollTop = objDiv.scrollHeight;
});


socket.on('logout', userName => {
    appendMessage(`${userName} disconnected`)
    objDiv.scrollTop = objDiv.scrollHeight;

})


function appendMessage(message) {
    var output = document.getElementById('output');
    output.innerHTML += '<p><strong>' + message + '</strong></p>'
}

