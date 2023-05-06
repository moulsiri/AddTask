var express = require('express');
var router = express.Router();
const xlsx=require('xlsx');
const fs = require('fs');


const Users=require('./users');
const Tasks=require('./task');
/* GET home page. */


router.get('/',async function(req, res, next) {
  let data=await Users.find();
  res.render('index', { title: 'Express',users:data });
  // res.send("hello")
});

router.post('/addUser',async function(req,res,next){
  try{
    let phoneNo=/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    let isValidPhone=phoneNo.test(req.body.mobile);
    if(!isValidPhone){
      return res.send("phone no. is not valid");
    }
    let new_data=await Users.create(req.body);
    res.redirect('/')


  }catch(err){
    return res.send(err.message);

  }
  
})
router.post('/addTask',async function(req,res){
  try{
    console.log(req.body)
    let type=req.body["panding"]?"panding":"done";
    console.log(type)
    let add=await Tasks.create({
      name:req.body.name,
      user:req.body.user,
      type:type
    })
    res.redirect('/')


  }catch(err){
res.send(err)
  }
})
router.get('/export',async function(req,res){
  try{
    let userData=await Users.find();
    let taskData=await Tasks.find().populate('user');
    let users=userData.map(elm=>{
      return {
        name:elm.name,
        email:elm.email,
        mobile:elm.mobile
      }
    })
    let tasks=taskData.map((elm)=>{
      return {
        task_name:elm.name,
        task_type:elm.type,
        user_name:elm.user.name
      }
    })
    const worksheet2 = xlsx.utils.json_to_sheet(tasks);
    const worksheet1 = xlsx.utils.json_to_sheet(users);
    const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet1, 'Users');
xlsx.utils.book_append_sheet(workbook,worksheet2, 'Tasks');

// Write workbook to file
const filename = 'data.xlsx';
const directory = './exports';
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}
xlsx.writeFile(workbook, `${directory}/${filename}`);
res.redirect("/")

  }catch(err){

    res.send(err)
  }
})


module.exports = router;
