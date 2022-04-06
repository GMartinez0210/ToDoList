// jshint esversion:6

const express = require("express")
const body_parser = require("body-parser")
const _ = require("lodash")
const mongoose = require("mongoose")

const date = require(__dirname + "/date.js")

const app = express()

app.use(express.static("public"))

app.use(body_parser.urlencoded({extended: true}))

// we set the use of ejs
app.set("view engine", "ejs")

const active_icon = "active-icon"

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})

let day = date.getDate()

const itemSchema = {
    name: {
        type: String,
        required: true
    }
}

const Item = mongoose.model("item", itemSchema)

const item1 = new Item({
    name: "Welcome to your to do list!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemSchema]
} 

const List = mongoose.model("list", listSchema)


app.get("/:listName", function(req, res) {
    const listName = _.capitalize(req.params.listName)

    List.findOne({name: listName}, function(err, foundList) {
        if (err) console.log(err)
        else {
            if (!foundList) {
            // Creating a new List
            const list = new List({
                name: listName,
                items: defaultItems
            })
            
            list.save()
            res.redirect("/" + listName)
            }
            else {
                // Showing an existing list
                res.render("list", {
                    title: foundList.name,
                    new_items: foundList.items,
                    active_home: "",
                    active_work: ""
                })
            }
        }
        
    })
})

app.get("/", function(req, res) {

    Item.find(function(err, items){
        if (err) console.log(err)
        else {
            if (items.length === 0) {
                Item.insertMany(defaultItems, function(err){
                    if (err) console.log(err)
                    else console.log("Successfully! Default items inserted")
                })
                res.redirect("/")
            }
            else res.render("list", {
                    title: "Today",
                    new_items: items,
                    active_home: active_icon,
                    active_work: ""
                })
        } 
    })
})

/* 
app.get("/:lists", function(req, res) {
    const lists = _.lowerCase(req.params.list)

    if(lists == "work") {
        Work.find({}, function(err, works){
            if (err) console.log(err)
            else res.render("list", {
                title: "Work",
                new_items: works,
                active_home: "",
                active_work: active_icon
            })
        })
    }
    else if(lists == "home") {
        let day = date.getDate()

        Item.find(function(err, items){
            if (err) console.log(err)
            else {
                if (items.length === 0) {
                    Item.insertMany(defaultItems, function(err){
                        if (err) console.log(err)
                        else console.log("Successfully! Default items inserted")
                    })
                    res.redirect("/home")
                }
                else res.render("list", {
                        title: day,
                        new_items: items,
                        active_home: active_icon,
                        active_work: ""
                    })
            } 
        })
    }
})
 */
/* app.get("/", function(req, res) {
    res.redirect("/home")
}) */

app.post("/", function(req, res) {
    let new_item = req.body.new_item
    let listName = req.body.list

    let item = new Item({
        name: new_item
    })

    console.log(listName)
    console.log(date.getDate());

    if(listName == "Today") {
        item.save()
        res.redirect("/")
    }
    else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item)
            foundList.save()
            res.redirect("/"+ listName)
        })
    }
})

app.post("/delete", function(req, res){
    let deleted_item = req.body.checkbox
    let listName = req.body.listName

    if (listName == "Today") {
        Item.findByIdAndRemove(deleted_item, function(err){
            if (err) console.log(err)
            else console.log("Successfully! Item deleted");
        })

        res.redirect("/")
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleted_item}}},function(err, foundList) {
            if (err) console.log(err)
            else console.log("Successfully! Item deleted");
        })
        res.redirect("/"+listName)
    }

    
})

app.get("/About", function(req, res) {
    res.render("about")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000")
})
