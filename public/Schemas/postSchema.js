const mongoose=require('mongoose')
const post=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    fileUrl:String,
    reports:{
        type:Number,
        default:0,
    },
    comments:{
        type:[String],
        default:[]
    },
    adminPost:{
        type:Boolean,
        default:false
    },
    category:String,
    board:String,
    uniqueId:String,
    date:{
        type:Date,
        default:Date.now()
    },
    
   


})

const postSchema= new mongoose.model('post',post)
module.exports=postSchema;