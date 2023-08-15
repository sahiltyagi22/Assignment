const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const cheerio = require('cheerio')


//  Assuming a DB with user and product model 
const { User, Product } = require('./models'); 


const app = express()
app.use(express.json())

require('/.config/passport')(passport)

//  authentication middleware

const authentication  = passport.authenticate('jwt', { session: false })

// Here we can have our API routes for register and login and other routes



//  flipkart-url route
app.post('/flipkart',authentication,  async(req,res)=>{

    const {url} = req.body
    const user = req.user



    //  or We can use this same logic to authenticate user on the flipkart url route
    
    // const accessToken = req.headers.authorization;
    // if (!accessToken) {
    //   return res.status(401).json({ message: 'required token' });
    // }
    // jwt.verify(accessToken,secret , (err, access) => {
    //   if (err) {
    //     return res.status(401).json({ message: 'Invalid token' });
    //   }
    //   return res.status(200).json({ message: "you are accessed to use this route" });
    // });

    


    // checking if thew url already exists or not

    const existingProduct = await Product.findOne({
        where: { userId: user.id, url },
      });
    
      if (existingProduct) {
        return res.json({ message: 'URL already exists for the user' });
      }
    
      try {
        const response = await axios.get(flipkartUrl);
        const html = response.data;
    
        const $ = cheerio.load(html);
    
        const title = $('titleID').text();
        const price = $('priceID').text();
        const Description = $('descriptionID')
        const revRat = $('review and rating ID')
        const review = $('reviewID')
        const mediaCount = $('mediaCountID')
    
        const newProduct = await Product.create({
          userId: user.id,
          url,
          title,
          price,
          Description,
          revRat,
          review,
          mediaCount
        });
    
        return res.status(201).json({ message: 'Data saved successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Error scraping data from the URL' });
      }


})