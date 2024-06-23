const mongoose=require('mongoose')
const post=new mongoose.Schema({
    name:{
        type: String,
    },
    userEmail:{
        type:String,
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
    hashTags:{
        type:[String],
    },
    likes:{
        type:[String],
        default:[]
    },
    comments:{
        type:[String],
        default:[]
    },
    views:{
        type:[String],
        default:[]
    },
    shares:{
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
    trending:{
        type:Boolean,
        default:false,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    
   


})

const postSchema= new mongoose.model('post',post)
module.exports=postSchema;