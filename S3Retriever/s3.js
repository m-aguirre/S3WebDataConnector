//require('dotenv').config({path: '../.env'});
var AWS = require('aws-sdk');
//AWS.config.update({region: process.env.aws_region})
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

//var credentials = process.env

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket : 'jumpshot-data-samples',
  Prefix: 'insights-stable-v2-20190302'
};

var dataOutput = [];
var nCols = 0;


class S3Connection {
  constructor(accessKey, secretKey) {
    const AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    // AWS.config.accessKeyId = accessKey;
    // AWS.config.secretAccessKey = secretKey;
    AWS.config.region = "eu-west-1";
    // this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
    this.s3 = new AWS.S3({apiVersion: '2006-03-01', accessKeyId: accessKey, secretAccessKey: secretKey});
    this.bucketParams = {
      Bucket : 'jumpshot-data-samples',
      Prefix: 'insights-stable-v2-20190302'
    }
    this.records = [];
  }

  //TODO possibly remove s3 param
  getS3FileList() {
    // Call S3 to obtain a list of the objects in the bucket
    this.s3.listObjects(this.bucketParams, function(err, data) {
      if (err) {
        console.log("Error ", err);
      } else {
        console.log("get S3 Files Success");
        //temoporarily limited list of records - TODO remove later
        for (var i = 0; i < 4; i++) {
          this.records.push(data.Contents[i]);
        }
        console.log(records);
      }
    });

    return this.records;
  }
}
export default S3Connection;
