import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    userInfo: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/adminLogin", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user && user.userInfo === 'Admin'){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else if(user && user.userInfo === 'Partner'){
            res.send({ message: "User is registered as Partner"})
        }else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/adminRegister", (req, res)=> {
    const { name, email, password, userInfo} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user && user.userInfo === "Admin"){
            res.send({message: "User already registerd"})
        } else if(user && user.userInfo === "Partner"){
            res.send({message: "User already registerd as Partner"})
        }
        else{
            const user = new User({
                name,
                email,
                password,
                userInfo
            })
            user.save(err => { 
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.post("/partnerLogin", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user && user.userInfo === 'Partner'){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else if(user && user.userInfo === 'Admin'){
            res.send({ message: "User is registered as Admin"})
        }else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/partnerRegister", (req, res)=> {
    const { name, email, password, userInfo} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user && user.userInfo === "Partner"){
            res.send({message: "User already registerd"})
        } else if(user && user.userInfo === "Admin"){
            res.send({message: "User already registerd as Admin"})
        }
        else{
            const user = new User({
                name,
                email,
                password,
                userInfo
            })
            user.save(err => { 
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 


app.listen(9002,() => {
    console.log("BE started at port 9002")
})