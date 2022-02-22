// import packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs') 

// create an instance of express
const app = express()

// MIDDLEWARES
// tell express to use ejs as the view engine
app.set('view engine', 'ejs')
// tell express that we're using ejs layouts
app.use(ejsLayouts)
// body-parser middleware
// this allows us to access form data via req.body
app.use(express.urlencoded({extended: false}))

// ROUTES
// home
app.get('/', (req, res)=>{
    res.send('Hello Dinos')
})
// index ie list all the dinos!
app.get('/dinosaurs', (req, res)=>{
    // read in the array from dinosaurs.json
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    res.render('index.ejs', {myDinos: dinoData})
})
// new route (renders the new dino form)
app.get('/dinosaurs/new', (req, res)=>{
    res.render('new.ejs')
})
// show ie show all info about a single dino
// : indicates that the following is a url param(eter)
app.get('/dinosaurs/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx param
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('show.ejs', {dino: targetDino})
})
// post a new dino
app.post('/dinosaurs', (req, res)=>{
    // read in our dino data from the json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // add the new dino to the dinoData array
    dinoData.push(req.body)
    // save the dinosaurs to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // redirect back to the index route
    // res.redirect takes the url pattern for the get route that you
    // want to run next
    res.redirect('/dinosaurs')
})

app.listen(8000, ()=>{
    console.log('DINO CRUD TIME 🦖')
})