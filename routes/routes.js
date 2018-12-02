// Dependencies
const router = require("express").Router();
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

// Bring in all models
const db = require("../models");

// Routes 

// Home page 
router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Scrape route - will scrape ETHNews trending articles
router.get("/scrape", function (req, res) {
    // request eth news html via axios
    axios.get("http://www.fasterskier.com").then((response) => {
        // Load eth news html into cheerio
        let $ = cheerio.load(response.data);
        // Grab all article thumbnails 
        $(".article-thumbnail__info").each(function (i, element) {
            // Creat result object & use scrape results to declare properties
            let result = {};

            result.headline = $(this)
                .children("h2").text();
            result.summary = $(this)
                .find(".article-thumbnail__info__summary").text();
            result.link = $(this)
                .find(".article-thumbnail__info__summary").children().attr("href");

            // Create new Article (for each) to store using result object from above
            db.Article.create(result)
                .then(function (createdArticles) {
                    console.log(createdArticles);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send();
    })
        .catch((err) => {
            res.json(err);
            console.log(err);
        });
});
// Will get all stocks (news snippets/articles) from the database
router.get("/articles", (req, res) => {
    db.Article.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});
// Route for grabbing specific stock by id to & doing stuff with associated comments
router.route("/articles/:id")
    .get((req, res) => { })
    .post((req, res) => { })
// delete?


// Export router
module.exports = router;