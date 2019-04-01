require('dotenv').config({path: '../.env'});
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.aws_region})
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

var credentials = process.env

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
    console.log("Error ", err);
  } else {
  //  console.log("Success", data);
  }
});

var file = s3.getObject(
  { Bucket: 'jumpshot-data-samples',
    Key: 'insights-stable-v2-20190302/1800flowers.com/2014/01/02/part-00000-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz'
}, function(err, data) {
    if (err) {
      console.log("Error ", err)
    } else {
      console.log('Data Retrieved: ')
      console.log(data)
      zlib.gunzip(data.Body, function (err, result) {
              if (err) {
                  console.log(err);
              } else {
                  var extractedData = result;
                  console.log(result.toString('utf8').split("\u0001"))
              }
      });
    }
  }
);
