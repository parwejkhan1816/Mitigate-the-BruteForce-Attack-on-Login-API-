const router = require("express").Router() ; 
const User = require("./../Models/user")
const bcrypt = require("bcryptjs") 

router.post("/register", async (req,res) =>{
    try{
        const  {email, username , password} = req.body ; 
        const hashPassword = bcrypt.hashSync(password)
        const user = new User({email , username , password: hashPassword}) ; 
        await user.save().then(()=> res.status(200).json({user: user}) ) ;
        
    }catch(error){
        res.status(400).json({message: "User already existed"}) ; 
    }
})

router.post("/Signin", async (req,res) =>{
    try{
       const user = await User.findOne({email: req.body.email}) ; 
       if(!user)
       {
        res.status(400).json({message: "please sign up first"}) ; 
       }

       const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password) ; 
       if(!isPasswordCorrect)
       {
        res.status(400).json({message: "enter correct details "}) ; 
       }

       const {password, ...others} = user._doc ;
        res.status(200).json({others}) ;   
    }catch(error){
        res.status(400).json({message: "User already existed"}) ; 
    }
})

module.exports = router  ;