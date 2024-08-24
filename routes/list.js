const router = require("express").Router()
const User = require("../Models/user")
const List = require("../Models/list");
const list = require("../Models/list");

router.post("/addTask",async (req,res) => {
    try{
        const {tittle , body , email } = req.body ; 
        const existinguser = await User.findOne({email: email });
        if(!existinguser)
        {
           return res.status(400).json({message: "sign in to continue  "}) ; 
        }
        const list = new List({tittle: tittle , body: body,user: existinguser}) ; 

        await list.save().then(() => res.status(200).json({list})) ; 
        existinguser.list.push(list) ; 
        await existinguser.save()

    }
    catch(err){
        console.log("error occuse  "+ err)
    }
})


router.put("/updateTask/:id",async (req,res) =>{ 
    try{
        const {tittle , body , email } = req.body ; 
        const user = await  User.findOne({email : email} ) ; 
        if(!user)
        {
            return res.status(400).json({mesage : "not able to update"}) ;
        }
        await List.findByIdAndUpdate(req.params.id , {tittle , body }) ;
        res.status(200).json({mesage : "update succesfully "}) ;
        // await List.save().then(() => { res.status(200).json({message: "task update completed"})})
        

    }
    catch(err) {console.log(err)}
})


router.delete("/deleteTask/:id",async (req,res) =>{ 
    try{
        const {email} = req.body ; 
        const userexist = await User.findOneAndUpdate({email : email},{$pull: {list: req.params.id}}) ; 
        if(userexist)
        {
            await List.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({message: "task deleted"})) ; 
        }
    }
    catch(err) {console.log(err)}
})

router.get("/getallTask/:id",async (req,res) =>{

    const list = await List.find({user: req.params.id}).sort({createdAt: -1}) ; 
    if(list.length != 0 )
    {
        res.status(200).json(({list : list})) ;
    }
    else{
        res.status(200).json(({message : "no task "})) ;
    }
})

module.exports = router ; 