require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = express()

app.use(express.json())

const secret = process.env.secretkey


//  DUMMY DATABASE
const users = []

//  signup / register route

app.post('/register' , (req,res)=>{
    const{email , password} = req.body

    // if Post request is made without email or password
    //  (when we use html , this issue is handled on the page itself but for now we are making or own logic)

    if(!email || !password){
        res.send("email or password required")
        // we can send status code also and json message as response but for simplicity sake i am sending just a response message 
    }


    // checking if user is already registered with the given email
    if(users.some(user=>user.email === email)){
        res.send("user already registeres")
    }

    // hashing password to store in DB

    const hashPassword = bcrypt.hashSync(password , 10)
    users.push({email  , password :hashPassword})
    
    res.send("user register successfully")

})


// Login Route

app.post('/login' , (req,res)=>{
    const { email, password } = req.body;

    if (!email || !password) {
      res.send("email or password required")
    }
  
    const user = users.find(user => user.email === email);
  
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.send("invalid email or password")
    }

    const jwtToken = jwt.sign({ email }, secret, { expiresIn: '1h' });
  return res.status(200)
})


// routes to be authorized with JWT

app.get('/random' , (req,res)=>{
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({ message: 'required token' });
    }

    jwt.verify(accessToken,secret , (err, access) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      return res.status(200).json({ message: "you are accessed to use this route" });
    });
  });
  



app.listen(3000, ()=>{
    console.log("sever is running");
})