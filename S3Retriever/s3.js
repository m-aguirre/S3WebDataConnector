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
                  var schema = generateSchema();
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
              for (i = 0; i < dataOutput.length; i++) {
                console.log(dataOutput[i]);
              }
      });
    }
  }
);

/*
Hardcoded schema for temporary POC use
*/
var generateSchema = function() {

  var schema = ['date',
  'unk',
  'guid',
  'domain',
  'page_type',
  'default?',
  'url',
  'unk2',
  'device_type',
  'city',
  'state',
  'zip',
  'country',
  'gender',
  'age_range',
  'browser',
  'unk3',
  'change_type',
  'unk4' ];

  schema = [];

  for (i = 1; i <= nCols; i++) {
    schema.push(i);
  }

  return schema;
}


module.exports = {
  getWDCSchema: function () {
    return 'this is a schema'
  },

  generateWDCSchema: function (nCols) {
    schema = [];
    for (i = 1; i <= nCols; i++) {
      schema.push(i);
    }
    return schema;
  }
};
