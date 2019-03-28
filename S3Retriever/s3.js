require('dotenv').config({path: '../.env'});
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.aws_region})

var credentials = process.env;

//`s3://jumpshot-data-samples/insights-stable-v2-20190302/`

//`https://console.aws.amazon.com/s3/buckets/jumpshot-data-samples/insights-stable-v2-20190302/?region=us-west-2&tab=overview`

//s3://jumpshot-data-samples/

//insights-stable-v2-20190302

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket : 'jumpshot-data-samples',
  Prefix: 'insights-stable-v2-20190302'
};

// Call S3 to obtain a list of the objects in the bucket
s3.listObjects(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});

var file = s3.getObject(
  { Bucket: 'jumpshot-data-samples',
  Prefix: 'insights-stable-v2-20190302'
}, function(error, data) {
  
}
)
