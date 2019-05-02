const express = require('express')
const app = express()
const port = 3000
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
  res.send('Response')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
