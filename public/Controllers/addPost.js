const mongoose=require('mongoose')
const postSchema=require('../Schemas/postSchema')

let addPost=(req,res)=>{
    console.log(req.body)
    res.send(req.body)

}

module.exports=addPost

