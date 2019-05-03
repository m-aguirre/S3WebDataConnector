const express = require('express')
const app = express()
var cors = require('cors')
const port = 3000

app.use(cors())

require('dotenv').config({path: '.env'});
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.aws_region});

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket : 'jumpshot-data-samples',
  Prefix: 'insights-stable-v2-20190302'
};


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/', (req, res) => {
    var records = [];
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
      console.log('LIST CALLED')
      if (err) {
        console.log("Error ", err);
      } else {
        console.log("get S3 Files Success");
        //temoporarily limited list of records - TODO remove later
        for (var i = 0; i < 4; i++) {
          records.push(data.Contents[i]);
        }
        console.log(records);
      }
    });
  res.send(records)
});


app.get('/auth', (req, res) => {
    console.log('auth called')
    var records = [];
    // Call S3 to obtain a list of the objects in the bucket
    // s3.listObjects(bucketParams, function(err, data) {
    //   console.log('LIST CALLED')
    //   if (err) {
    //     console.log("Error ", err);
    //   } else {
    //     console.log("get S3 Files Success");
    //     //temoporarily limited list of records - TODO remove later
    //     for (var i = 0; i < 4; i++) {
    //       records.push(data.Contents[i]);
    //     }
    //     console.log(records);
    //   }
    // });
    console.log(req.params.un)
  //res.send(records)
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
