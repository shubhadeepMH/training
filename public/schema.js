const mongoose=require('mongoose')
const student=new mongoose.Schema({
    name:String,
    age:Number

})

const studentList= new mongoose.model('info',student)
module.exports=studentList;