(function(){
    var element = function(id){
        return document.getElementById(id);
    }

    //Get Element
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearBtn = element('clearbutt');
    var role = element('role_select');
    var room = element('room_select');

    //Get default status
    var statusDefault = status.textContent;
    
    var setStatus = function(s){
        //Set status
        status.textContent = s;

        if(s !== statusDefault){
            var delay = setTimeout(function(){
                setStatus(statusDefault)
            },4000);
        }
    }

    //connect to socket.io
    var socket = io.connect('https://guarded-bastion-83697.herokuapp.com/');
    socket.emit('room_selection',room.value);
    //check for connection
    if (socket != undefined){
        console.log("Connected to socket.io .....");

        socket.on('output',function(data){
            //console.log(data)
            if (data.length){
                console.log(data)
                for(var x = 0; x < data.length; x++){
                    //Build out msg div
                    var message = document.createElement('div');
                    var uname = document.createElement('div');
                    var timestamp = document.createElement('div');
                    timestamp.setAttribute('class','timestamp text-light');
                    message.setAttribute('class','chat-message rounded-bottom');
                    uname.setAttribute('class',`chat-head-${data[x].role} rounded-top`);
                    message.textContent = data[x].message;
                    uname.textContent = `(${data[x].role}) - ` + data[x].name;
                    timestamp.textContent = '06:04';
                    if (messages.scrollTop + messages.clientHeight == messages.scrollHeight){
                        messages.appendChild(uname);
                        messages.appendChild(message);
                        messages.appendChild(timestamp)
                        messages.scrollTop = messages.scrollHeight;
                    }else{
                        messages.appendChild(uname);
                        messages.appendChild(message);
                        messages.appendChild(timestamp)
                    }
                    // messages.insertBefore(message,messages.firstChild);
                }
                
            }
        });

       //Get status from server
       socket.on('status', function(data){
            // get message status
            setStatus(data);
       });

       //Handle input
       textarea.addEventListener('keydown',function(event){
           if (event.which === 13 && event.shiftKey == false){
            //emit to server input
            socket.emit('input',{name:username.value,message:textarea.value,role:role.value});
            textarea.value = ''
            event.preventDefault();
           }
       })

       room.addEventListener('change',function(event){
           location.reload();
       });


    }
})();