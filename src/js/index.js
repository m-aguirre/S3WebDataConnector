import axios from 'axios';
import S3Connection from '../../S3Retriever/s3.js';
import Decompressor from './decompressor.js';
//var Promise = require('promise');
var Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();
var S3 = require('../../S3Retriever/s3.js');
var structureBuilder = require('./dataFileStructure.js');

var dataFromS3 = ['empty'];

// var feedJson = [ {
// "0": "TEST",
// "1": "222253",
// "2": "57fbde4915cdba5fad8997d297b44fd6",
// "3": "1800flowers.com",
// "4": "TEST TEST",
// id: 0},
// {
// "0": "20140101",
// "1": "TEST",
// "2": "2ff4f3883bf39c55989499e291f948c8",
// "3": "1800flowers.com",
// "4": "Product page",
//  id: 1 },
// {
// "0": "TEST",
// "1": "144128",
// "2": "4a1f123060def68997e3266cbbd4888a",
// "3": "1800flowers.com",
// "4": "Product page",
// id: 2 },
// {
// "0": "20140101",
// "1": "220710",
// "2": "TEST",
// "3": "1800flowers.com",
// '4': "Product page" ,
// id: 3}];

var feedJson = [
{
0: "20140101",
1: "222338",
2: "57fbde4915cdba5fad8997d297b44fd6",
3: "1800flowers.com",
4: "Product page",
5: "Default",
6: "http://m.ww11.1800flowers.com/product.do?baseCode=91333&dataset=10147&cm_cid=d10147",
7: "TEST TEST",
8: "Mobile",
9: "Fort Myers",
10: "Florida",
11: "33908",
12: "US",
13: "M",
14: "55-64",
15: "CHROME",
16: "1388615018741",
17: "REGULAR",
18: "5eeb",
id: 0
}
]


var feed = [];
//console.log(Object.keys(feedJson[0]).length);
// var cols = [ {
//   id: "0",
//   dataType: tableau.dataTypeEnum.string
// },{
//   id: "1",
//   dataType: tableau.dataTypeEnum.string
// }, {
//   id: "2",
//   dataType: tableau.dataTypeEnum.string
// }, {
//   id: "3",
//   dataType: tableau.dataTypeEnum.string
// }, {
//   id: "4",
//   dataType: tableau.dataTypeEnum.string
// }, {
//   id: "id",
//   dataType: tableau.dataTypeEnum.string
// }];
// console.log('testing ---');
// console.log(feedJson);
// console.log(cols);

(function () {
  var myConnector = tableau.makeConnector();

  // var cols = [{
  //    id: "id",
  //    dataType: tableau.dataTypeEnum.string
  //  }]
  // for (let i = 1; i < 5; i++) {
  //   let obj = {
  //     id: i,
  //     dataType: tableau.dataTypeEnum.string
  //   };
  //   cols.push(obj)
  // }

  myConnector.getSchema = function(schemaCallback) {

    var cols = []
    cols.push({
      id: "id",
      dataType: tableau.dataTypeEnum.string
    });
    for (let i = 0; i < Object.keys(feedJson[0]).length - 1; i++) {
      let obj = {
        id: i.toString(),
        dataType: tableau.dataTypeEnum.string
      };
      cols.push(obj)
    }

    var tableSchema = {
      id: 'feedPrototype',
      alias: 'Jumpshot sample-feed',
      columns: cols
    }
    schemaCallback([tableSchema]);
  }

  myConnector.getData = function(table, doneCallback) {
     var tableData = JSON.parse(tableau.connectionData);
     table.appendRows(tableData);
     doneCallback();
  };

  tableau.registerConnector(myConnector);

})();
/*
Formats data retrieved from S3 into JSON data that can be handled by tableau
@param array of arrays
*/
const formatData = (data) => {
  let dataCollection = []
  for (let i = 0; i < data.length ; i++) { // data.length 4
    let obj = {id: i}
    for (let j = 0; j < data[i].length; j++) { //data[i].length 5
      obj[j.toString()] = data[i][j]
    }
    dataCollection.push(obj);
    feedJson.push(obj);
  }
  return dataCollection
}

//TODO add catch for when zero elements are checked
$(document).ready(function () {
  var fileNameToRequest = [];
    $("#submitButton").click(function () {
      $('.file-info-tile').each(function(index) {
        $(this).find('input[type=checkbox]').each(function(x) {
          if ($(this).is(':checked')) {
            fileNameToRequest.push($(this).attr('name'));
          }
        })
      });
        // tableau.connectionName = "JS Data Feed";
        // tableau.submit();
        /*
        TODO s3 functionality is not passed to proxy server;
          move proxy server logic into main repo after deployment
        */
        var s3 = new S3Connection(creds.key, creds.secret)
        axios.get('https://jumpshot-proxy.herokuapp.com/getfiles', {
          params: {
            s3: s3,
            fileName: fileNameToRequest[0],
            un: creds.key,
            pw: creds.secret
          }
        }).then(function (res) {
          console.log('Response Data: ')
          var formattedData = formatData(res.data);
          feedJson = formattedData;
          console.log(feedJson);
          console.log(feed);
          tableau.connectionData = JSON.stringify(formattedData);
          tableau.connectionName = "Jumpshot Dynamic-Feed";
          tableau.submit();
          //const decompressor = new Decompressor(res.data);
          //let unzippedFile = decompressor.decompress();
          //console.log(unzippedFile[0]);
        }).catch(function (err) {
          console.log(err)
        });
    });
});


var creds = {
  key: '',
  secret: ''
}

//TODO add catch for invalid logins
$(document).ready(function() {
  $(".auth-form").submit(function(e) {
    e.preventDefault();
    let user = $('#username-field').val();
    let pass = $('#password-field').val();
    //var s3 = new S3Connection($('#username-field').val(), $('#password-field').val());
    axios.get('https://jumpshot-proxy.herokuapp.com/auth', {
      params: {
        un : user,
        pw: pass
      }
    }).then(function (res) {
      creds.key = user;
      creds.secret = pass;

      $('.selection-pane').toggle();
      $.each(res.data, function(index, file) {
//        console.log(file);
        if (file.Size > 0) {
          $('#file-selector').append($(structureBuilder.buildStructure(file)));
          }
        });
    }).catch(function (err) {
      console.log(err)
    });
    //console.log(s3.bucketParams)
    //var f = s3.getS3FileList();
    //console.log(f)
    return false;
  });
  $('.file-info-tile').click(function(){
    $(":checkbox:eq(0)", this).attr("checked", "checked");
  });
});
