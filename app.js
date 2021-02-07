
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});


const Article = mongoose.model("Article", articleSchema);


///////////// Requests targeting ALL Articles //////////////////
// Chained route handler
app.route("/articles")
.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
.post(function(req, res) {
    // Create an article with the "title" and "content" input from Postman
  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });
  // Save the article to the mongo database
  // The function callback is used because Postman is waiting to receive response back
  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added a new article.")
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});


//////////// Requests Targeting a Specific Article /////////////////
app.route("/articles/:articleTitle")
.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})
// Updates/replaces entire article. Missing values will be empty
.put(function(req, res) {
//  Article.update(    // Decprecated .update() replaced with .replaceOne()
  Article.replaceOne(
    {title: req.params.articleTitle},  // Conditions
    {title: req.body.title, content: req.body.content},  // Updates
    // {overwrite: true},    // Not needed with .replaceOne()
    function(err) {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})
// Only updates the specified values and leaves the others the same
.patch(function(req, res) {
  // Article.update(    // Deprecated method update()
  Article.updateOne(
    {title: req.params.articleTitle},    // Conditions
    {$set: req.body},    // Updates
    function(err) {
      if (!err) {
        res.send("Successfully patched article.")
      } else {
        res.send(err);
      }
    }
  );
})
.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("Successfully deleted article.")
      } else {
        res.send(err);
      }
    }
  );
});




app.listen(3000, function() {
  console.log("Server running on port 3000");
});


























//
