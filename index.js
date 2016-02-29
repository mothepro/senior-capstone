// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to Of Machine and Men\'s Capstone Project',
        howTo: {
            '1': {
                '1': 'Make a POST request to this URL with the body containing the following items',
                'followingItems': ['sender', 'reciever', 'subject', 'message'],
            },
            '2': 'An object with a score value is returned. between 0 and 1.\n0 being guaranteed not spam.\n1 being seen as definitely.'
        }
    });
});

// Spam Score
router.post('/', function(req, res) {
    try {
        var spamd = new Spamd(req.body.sender, req.body.reciever);

        // test email
        spamd.evaluate(req.body.subject, req.body.message, function (r, err) {
            if (err)
                throw err;

            res.json({ score: parseFloat(r.evaluation) / 5.0 });
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// attach router to app
app.use(router);

// init spam deamon
var Spamd = require("node-spamd");

// START THE SERVER
var port = process.env.PORT || 8080;        // set our port
app.listen(port);
console.log('API running on port ' + port);