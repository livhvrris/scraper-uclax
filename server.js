var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");

var Promise = require("bluebird");
mongoose.Promise = Promise;

var exphbs = require("express-handlebars");


var app = express();

  app.use(logger("dev"));
  app.use(bodyParser.urlencoded({extended: false}));

  app.engine("handlebars", exphbs({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");

  app.use(express.static(process.cwd() + "/public"));


mongoose.connect("mongodb://localhost/nytarticlescrape");


var db = mongoose.connection;

  db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });

  db.once("open", function() {
    console.log("Mongoose connection successful.");
  });


// Routes
// ======
app.get("/", function(req, res) {

  Article.find({}).populate('note').exec(function(error, doc) {

    var hbsObject = {
      article: doc
    };

    console.log(hbsObject);
    res.render("index", hbsObject);

  });
});


app.get("/scrape", function(req, res) {

  request("http://www.nytimes.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $("article h2").each(function(i, element) {

      var result = {};
        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");


      var entry = new Article(result);
        entry.save(function(err, doc) {

          if (err) {
            console.log(err);
          }

          else {
            console.log(doc);
          }

      });

    });
  });

  res.send("Scrape Complete");

});


app.get("/articles", function(req, res) {

  Article.find({}, function(error, doc) {

    if (error) {
      console.log(error);
    }

    else {
      res.json(doc);
    }

  });
});


app.get("/articles/:id", function(req, res) {

  Article.findOne({ "_id": req.params.id })

  .populate("note")

  .exec(function(error, doc) {

    if (error) {
      console.log(error);
    }

    else {
      res.json(doc);
    }

  });
});



app.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);

  newNote.save(function(error, doc) {

    if (error) {
      console.log(error);
    }

    else {

      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })

      .exec(function(err, doc) {

        if (err) {
          console.log(err);
        }

        else {
          res.send(doc);
        }
        
      });
    }
  });
});


app.delete("/notes/:id", function(req, res) {

  Note.remove({"_id": req.params.id})

  .exec(function(err, doc) {

    if (err) {
      console.log(err);
    }

    else {
      res.send(doc);
    }
    
  });
})


app.listen(3000, function() {
  console.log("App running on port 3000!");
});
