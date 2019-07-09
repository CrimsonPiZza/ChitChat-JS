const mongo = require('mongodb').MongoClient;
const uri = "mongodb+srv://kyle06:dante0604@chitchat-db-vqryt.mongodb.net/test?retryWrites=true&w=majority";
const cli = new mongo(uri, {useNewParser:true});

cli.connect(err =>{
    if(err){
        throw err;
    }
    console.log('MongoDB connected...');
    const chat = cli.db("chitchats").collection("chatbox");
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        if(err){
            throw err;
        }
        console.log(res)
    });
})