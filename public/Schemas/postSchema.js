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
    likes:{
        type:Number,
        default:0,
    },
    comments:{
        type:[String],
        default:[]
    },
    category:String,
    board:String,
    uniqueId:String

})

const postSchema= new mongoose.model('post',post)
module.exports=postSchema;