//require('dotenv').config({path: '../.env'});
var AWS = require('aws-sdk');
//AWS.config.update({region: process.env.aws_region})
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

//var credentials = process.env

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket : 'jumpshot-data-samples',
  Prefix: 'insights-stable-v2-20190302'
};

var dataOutput = [];
var nCols = 0;

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
                  var schema = module.exports.generateSchema();
                  dataOutput.push(schema);
                  var dataArray = result.toString('utf8').split('\n');
                  for (i = 0; i < dataArray.length; i++) {
                    dataArray[i] = dataArray[i].split('\u0001');
                    //console.log(dataArray[i]);
                    if (nCols === 0) {
                      nCols = dataArray[i].length;
                    }
                    if (dataArray[i][0] === '') {
                      continue;
                    } else {
                      dataOutput.push(dataArray[i]);
                    }
                  }
                  //console.log(dataArray);
              }
              // for (i = 0; i < dataOutput.length; i++) {
              //   console.log(dataOutput[i]);
              // }
      });
    }
  }
);


module.exports = {

  generateSchema: function (nCols) {
    schema = [];
    for (i = 1; i <= nCols; i++) {
      schema.push(i);
    }
    return schema;
  },

  getS3FileList: function(s3) {
    // Call S3 to obtain a list of the objects in the bucket
    var records = [];
    // s3.listObjects(bucketParams, function(err, data) {
    //   if (err) {
    //     console.log("Error ", err);
    //   } else {
    //     //console.log("Success", data);
    //     //temoporarily limited list of records - TODO remove later
    //     for (var i = 0; i < 3; i++) {
    //       records.push(data.Contents[i]);
    //     }
    //     console.log(records);
    //   }
    // });
    //TEMP HARD CODED DATA - REMOVE LATER
    // NOTE: objects have had Etag param removed
    records = [ { Key:
     'insights-stable-v2-20190302/1800flowers.com/2014/01/01/_SUCCESS',
    LastModified: '2019-03-20T23:15:30.000Z',
    Size: 0,
    StorageClass: 'STANDARD' },
  { Key:
     'insights-stable-v2-20190302/1800flowers.com/2014/01/01/part-00000-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz',
    LastModified: '2019-03-03T16:01:09.000Z',
    Size: 2624,
    StorageClass: 'STANDARD' },
  { Key:
     'insights-stable-v2-20190302/1800flowers.com/2014/01/01/part-00001-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz',
    LastModified: '2019-03-03T16:01:09.000Z',
    Size: 2516,
    StorageClass: 'STANDARD' } ]

    return records;
  }

};
//TODO add s3 param back into function call
var records = module.exports.getS3FileList();
