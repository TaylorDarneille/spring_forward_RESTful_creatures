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

app.listen(8000, ()=>{
    console.log('DINO CRUD TIME 🦖')
})