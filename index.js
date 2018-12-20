const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const Product = require('./models/Product')
const nunjucks = require('nunjucks')
const mongoose = require('mongoose')
const upload = require('./middleware/upload')
mongoURL = 'mongodb://admin:admin12@ds135653.mlab.com:35653/philadelphia'

app.use(express.static(__dirname + "/public"));
app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((err, req, res, next)=>{
    console.log(err)
    res.status(501).render("error.html")
})
// app.use(function(req, res){
//     res.status(404);
//     res.render('error.html');
// });   

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

mongoose.connect(mongoURL, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connect')
    })
    .catch(err => {
        console.log('disconnected database.', err)
    })


app.get('/', async(req, res) =>{
    const product = await Product.find({})
    // console.log(product)
    res.render('index.html', { product })
})
app.get('/addProd', (req, res) =>{
    // console.log(product)
    res.render('addProd.html')
})

app.post('/addProd', upload.single('image'), async(req, res) =>{ //
    
    const product = new Product({
        name: req.body.name,
        cost: req.body.cost,
        description:req.body.description,
        imageSrc: req.file ? req.file.path : ''
      })
   
      try {
        await product.save()
        res.status(201).json("ok")
      } catch (e) {
       res.status(501).json("bad")
      }
    
    
})

app.get("/httpHeader", (req,res)=>{
    console.log(req.headers)
    res.render('addProd.html')
})

app.get("/*", (req,res)=>{
    res.render('error.html');
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


