const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(80).sockets;
const uri = "mongodb+srv://kyle06:dante0604@chitchat-db-vqryt.mongodb.net/test?retryWrites=true&w=majority";
const cli = new mongo(uri, {useNewParser:true});
//mongodb+srv://kyle06:dante0604@chitchat-db-vqryt.mongodb.net/test?retryWrites=true&w=majority
// Connect to mongo
// const MongoClient = require(‘mongodb’).MongoClient;
// const uri = "mongodb+srv://kyle06:<password>@chitchat-db-vqryt.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
cli.connect(err => {

    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        //let chat = db.collection('chats');
        const chat = cli.db("chitchats").collection("chatbox");
        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insertOne({name: name, message: message}, function(){
                    socket.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});

