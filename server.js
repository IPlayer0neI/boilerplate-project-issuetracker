'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const myDb        = require('./mongooseConnect.js');
const ObjectID    = require('mongodb').ObjectID;
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
  console.log(req.method + " " + req.path + " - " + req.ip );
next()
});
app.route("/api/issues/:project")

  .put(function(req, res, next){
   console.log(req.body)
     if(req.body._id){
      req.body = Object.keys(req.body).reduce(function(obj, key){
        if(req.body[key]) obj[key] = req.body[key];
        return obj;
      }, {});
        if(!ObjectID.isValid(req.body._id)){
          console.log("could not update")
          res.json({ error: 'could not update', '_id': req.body._id })
      }else{
        next();
      }
    }else{
      res.json({error: "missing _id"});
    };
   })

   .delete(function(req, res, next){
    if(req.body._id){
      next();
    }else{
      res.json({error: "missing _id"});
    };
   })
   
//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
myDb((Issues) => {
 
  apiRoutes(app, Issues)

})
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
