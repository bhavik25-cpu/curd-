const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const moment = require('moment/moment');
const app = express()
app.use('/uploads', express.static('uploads'));
const multer = require('multer');
const path =require('path');



router.post('/create', async (req, res) => {
    const { error } = validate(req.body);
    console.log(error, "messageeeeeeeeeeee")
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        user = new User({
            name: req.body.name,
            address: req.body.address,
            customerphoto: req.body.customerphoto,
            mobilenumber: req.body.mobilenumber,
            email: req.body.email,
            date:new Date()
        });
        await user.save();
        res.send({status:true , msg: "Data insert success"});
    }
});



router.post('/fetch', async (req, res) => {
    let query = {}
    if(req.body.date){
        let date = moment(req.body.date).toDate()
        console.log(date ,"ssssssssssssssssssssssssssss")
        query["date"] = { $gte : date}

    }
    if(req.body.id){
        query["_id"] = mongoose.Types.ObjectId(req.body.id)
   }
    let user = await User.find(query);
    console.log(user, "usssssssssssssser")

        return res.status(200).send(user)
});





router.post('/upload', async (req, res) => {
    let filepath 
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            filepath = path.join(__dirname, `../uploads/${file.originalname}`)
            cb(null, path.join(__dirname,`../uploads`));
        },
        filename: function (req, file, cb) {
            cb(null, "file.originalname");
        }
    })
    let upload = multer({ storage: storage , limits: { fileSize: 5 * 1000 * 1000}}).single('image');        
    
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.send("file size is more then 5 mb");
                        }
                        console.log(filepath)
                        console.log(req.body._id,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

                        let user = await User.updateOne({_id : mongoose.Types.ObjectId(req.body._id)},{$set: {customerphoto: filepath}} );
                        res.send("file upload successfully");
                    });
});


// delete user id
router.delete("/:id", async (req, res) => {
    try{
        const _id =req.params.id;
        const deleteData = await User.findByIdAndDelete(_id); 
        
        if(!_id){
            res.status(404).send();
        }
        else{
            res.send(deleteData);
        }
    }
    catch(err){
        res.status(500).send(err);
    }
});



router.patch("/create/:id", async (req, res) => {
    try{
        const _id =req.params.id;
        const updateData = await User.findByIdAndUpdate(
            _id, 
            req.body, 
            {
                useFindAndModify: false,
                new: true
            }
        ); 
        
        res.send(updateData);
    }
    catch(err){
        res.status(500).send(err);
    }
});


module.exports = router;