require('dotenv').config({path: '../.env'});
var AWS = require('aws-sdk');
var iam = new AWS.IAM({apiVersion: '2012-10-17'});

var policy = {
   "Version":"2012-10-17",
   "Statement":[
      {
         "Sid":"statement1",
         "Effect":"Allow",
         "Action":[
            "s3:CreateBucket",
            "s3:ListAllMyBuckets",
            "s3:GetBucketLocation"
         ],
         "Resource":[
            "arn:aws:s3:::*"
         ]
       }
    ]
}

var policyParams = {
  PolicyDocument: JSON.stringify(policy),
  PolicyName: 'listPolicy'
};

iam.createPolicy(policyParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});


//TODO move this function to s3.js once proper permissions are obtained


// var params = {};
//  s3.listBuckets(params, function(err, data) {
//    if (err) console.log(err, err.stack); // an error occurred
//    else     console.log(data);           // successful response
//    /*
//    data = {
//     Buckets: [
//        {
//       CreationDate: <Date Representation>,
//       Name: "examplebucket"
//      },
//        {
//       CreationDate: <Date Representation>,
//       Name: "examplebucket2"
//      },
//        {
//       CreationDate: <Date Representation>,
//       Name: "examplebucket3"
//      }
//     ],
//     Owner: {
//      DisplayName: "own-display-name",
//      ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31"
//     }
//    }
//    */
//  });
