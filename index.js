const express = require("express")
const app = express() 
require("./Conn/conn") ;
const User = require("./Models/user") ; 
// const  auth = require("./routes/auth")
// const  list = require("./routes/list")
app.use(express.json()) ;

app.get("/",(req,res) =>{
    console.log("app testeing")  ;
    res.status(200).send("hello todo") ; 
})

app.get("/get",async (req,res) =>{
    const { email} = req.body ;

    const user = await User.findOne({email:email}) ; 
    console.log("user data is :" , user) ;
    res.status(200).send(user) ; 
})

app.post("/register", async (req,res) =>{
    try{
        const  {email , password} = req.body ; 
        const x = await User.findOne({email}) ; 

        if(x){
           return res.status(400).send("user already exist")  ; 
        }

        const user = new User({email:email , password:password}) ; 
        await user.save() ; 
        console.log(user) ; 
        return res.status(200).json({message :"r Ok"})  ; 
    }catch(err){
        throw err  ; 
    }
})

app.post("/login", async (req,res) =>{

    try{
        const {email , password} = req.body ; 

        const user = await User.findOne({email : email}) ;
        if(!user){
           return res.status(400).json({error : "user not found"}) ; 
        } 
        const now  = new Date()
        const releasetime = user.releaseTime;
        if(releasetime > now){
            const timeLeft = Math.ceil((releasetime.getTime() - now.getTime()) / 1000) ;
            return res.status(429).json({message: "Too many attempts try again " ,
                bachahuaTime: timeLeft + "seconds"
            }) ;
        }
        else{
    

    
            //check password match or not 
            const userPassword = user.password  ; 
            if(password != userPassword){
                user.loginAttempt += 1 ; 
                if(user.loginAttempt >= 3){
                    user.loginAttempt = 0  ;
                    user.releaseTime = new Date(now.getTime() + 10 * 1000);
                    await user.save() ;
                    return res.status(429).json({message: "maximum attempt reached "}) ;  
                }
                await user.save(); 
                return res.status(429).json({error: "Wrong password "}) ; 
            }else{
                user.loginAttempt = 0 ; 
                await user.save() ;
                return res.status(200).json({message: "succesfull login "}) ; 
            }
        }
        res.status(200).json({message : "ok"}) ; 
    }catch(err){
        console.log("login err : " , err) ; 
        res.status(500) ; 
    }

   
})


// app.use("/api/v1",auth) ; 
// app.use("/api/v2",list) ;

app.listen(1000,() =>{
    console.log("server started at 1000")
})