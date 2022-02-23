// import packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs')
const methodOverride = require('method-override')

// create an instance of express
const app = express()

// MIDDLEWARES
// tell express to use ejs as the view engine
app.set('view engine', 'ejs')
// tell express that we're using ejs layouts
app.use(ejsLayouts)
// method override configuration
app.use(methodOverride('_method'))
// body-parser middleware
// this allows us to access form data via req.body
app.use(express.urlencoded({extended: false}))

// controller middleware

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
    // grabbing the queried name from the url
    let nameFilter = req.query.nameFilter
    // if there IS a query,
    if(nameFilter){
        // filter out all dinos who don't have the queried name
        dinoData = dinoData.filter(dino=>{
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
    }

    res.render('index.ejs', {myDinos: dinoData})
})
// new route (renders the new dino form)
app.get('/dinosaurs/new', (req, res)=>{
    res.render('new.ejs')
})
// edit form route (renders edit form)
app.get('/dinosaurs/edit/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx param
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]

    res.render('edit.ejs', {dino: targetDino, dinoId: dinoIndex})
})

// PUT ROUTE
app.put('/dinosaurs/:idx', (req, res)=>{
    // read in our existing dino data
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // replace dino fields with field from form
    dinoData[req.params.idx].name = req.body.name
    dinoData[req.params.idx].type = req.body.type
    // write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // once the dinosaur has been editted, do a get request to the index route
    res.redirect('/dinosaurs')
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

app.delete('/dinosaurs/:idx', (req, res)=>{
    // read in our dinos from our json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // remove the delete dino from dinoData
    dinoData.splice(req.params.idx, 1)
    // write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    res.redirect('/dinosaurs')
})

app.listen(8000, ()=>{
    console.log('DINO CRUD TIME 🦖')
})