// requiring needed modules
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const dd = require(path.join(__dirname, '/date.js'));
const _ = require('lodash');

// setting up the environment
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
mongoose.connect('mongodb+srv://<user name>:<password>@listcluster.lhfjc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todoDB');

// DataBase Management
const todoSehema = new mongoose.Schema({
    work: String
});

const List = new mongoose.Schema({
    name: String,
    branch: [todoSehema]
});

const list = mongoose.model("list", List);
const item = mongoose.model("item", todoSehema);
const itemwork = mongoose.model("itemwork", todoSehema);

// initialdata
const item1 = new item({
    work: "Welcome to Aradhya's Todo List"
});

const item2 = new item({
    work: "Hit the + button to add a item"
});

const item3 = new item({
    work: "<-- Hit this to delete this"
});

const defaultItems = [item1, item2, item3];

// get requests
app.get("/:params", (req, res) => {
    const paramdata = _.capitalize(req.params.params);
    list.findOne({ name: paramdata }, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            if (!docs) {
                console.log("Does'nt Exist");
                const li = new list({
                    name: paramdata,
                    branch: defaultItems
                });
                li.save();
                res.render('index', { d: paramdata, items: defaultItems });
            } else {
                // console.log("Exist");
                res.render('index', { d: docs.name, items: docs.branch });
            }
        }
    });
});

app.get("/", (req, res) => {
    // finding the data from the database
    item.find((err, docs) => {
        if (err) {
            console.log(err);
        } else if (docs.length == 0) {
            item.insertMany(defaultItems, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("initial data logged" + defaultItems);
                }
            });
            res.redirect("/");
        } else {
            console.log("All data found\n");
            res.render('index', { d: "", items: docs });
        }
    });
});

// post requests
app.post("/", (req, res) => {
    const temp = new item({ work: req.body.in });
    temp.save();
    res.redirect("/");
});


app.post("/delete/delete", (req, res) => {
    console.log(req.body.checkbox);
    item.deleteOne({ _id: req.body.checkbox }, (err) => {
        if (err) {
            console.log(err);
        }
    })
    res.redirect("/");
});

app.post("/:params", (req, res) => {
    list.findOne({ name: req.params.params }, (err, docs) => {
        docs.branch.push({ work: req.body.in });
        docs.save();
    });
    res.redirect("/" + req.params.params);
});

app.post("/:param/delete", (req, res) => {
    console.log(req.body.checkbox);
    console.log(req.body.listname);
    list.findOneAndUpdate({ name: req.body.listname }, { $pull: { branch:{_id:req.body.checkbox} } }, (err) => {
        if (!err) {
            res.redirect("/" + req.params.param);
        }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

// listening to port localhost:3000
app.listen(3000 || port, () => {
    console.log("Server has started");
});

// closing mongo server
// mongoose.connection.close();
