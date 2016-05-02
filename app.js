'use strict'

var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var autoIncre = require('mongoose-auto-increment');


var app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));


/* static server */
app.use('/public', express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* connect to MongoDb */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ltsdb');
var db = mongoose.connection;

/* auto increment initialize */
autoIncre.initialize(db);

/* create new schema for login */
var schema1 = new mongoose.Schema({
    _id: String,
    fName: String,
    lname: String,
    gender: String,
    password: String
});

var userModels = mongoose.model('userModels', schema1);

/* create new schema for album */
var schema2 = new mongoose.Schema({
    usr: String,   // store user info
    folderName: String,
    dateCreated: String
});

schema2.plugin(autoIncre.plugin, 'albumModels');
var albumModels = mongoose.model('albumModels', schema2);

/* create new schema for gallery */
var schema3 = new mongoose.Schema({
    info: String,  // store user and album info
    img: String,
    text: String
});

schema3.plugin(autoIncre.plugin, 'galleryModels');
var galleryModels = mongoose.model('galleryModels', schema3);



/* request and response handlers */
app.get('/',function(req, res) {
    res.sendFile(path.join(__dirname + '/views/HomePage.html'));
});


/* homepage login */
app.post('/logIn', function(req, res) {
    var usr = req.body.email;
    var pswd = req.body.pswd;

    userModels.findOne({'_id': usr}, function(err, obj) {
        if (obj.password === pswd) {
            res.cookie(usr, usr);
            res.redirect('/album');
        } else {
            res.sendFile(path.join(__dirname + '/views/HomePage.html'));
        }
    });
});

/* homepage registration */
app.post('/registration', function(req, res) {
    var usr = req.body.email;

    new userModels ({
        _id: req.body.email,
        fname: req.body.firstName,
        lname: req.body.last,
        gender: req.body.gender,
        password: req.body.pswd1
    }).save(function(err, doc) {
        if(err) {
            throw err;
        } else {
            res.cookie(usr, usr);
            res.redirect('/album');
        }
    });
});

/* render album */
app.get('/album', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/Album.html'));
})

/* auto loading album */
app.get('/albums', function(req, res) {
    var usr = req.headers.cookie;

    albumModels.find({'usr': usr}, function(err, objs) {
        if (err) {
            throw err;
        } else {
            res.json(objs);
        }
    });
});

/* create album */
app.post('/albums', function(req, res, next){
    var usr = req.headers.cookie;

    var folderName = req.body.folderName;
    var dateCreated = req.body.dateCreated;

    new albumModels ({
        usr: usr,
        folderName: folderName,
        dateCreated: dateCreated
    }).save(function(err, doc) {
        if(err) {
            throw err;
        } else {
            next();
        }
    });
});


/* load gallery */
app.get('/renderGallery', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/Gallery.html'));
});

app.get('/gallery', function(req, res){
    var usr = req.headers.cookie;

    var find = function(id, callback) {
        galleryModels.find({'info': id}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback(result);
            }
        });
    }

    var send = function(objs) {
        res.json(objs);
    }

    find(usr, send);
});

app.post('/gallery', function(req, res, next){
    var usr = req.headers.cookie;
    var img = req.body.img_B64;
    var txt = req.body.txt;

    new galleryModels({
        info: usr,
        img: img,
        text: txt
    }).save(function(err, doc) {
        if(err) {
            throw err;
        } else {
            next();
        }
    });
});


app.listen(8080);