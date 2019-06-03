import axios from 'axios';
import S3Connection from '../../S3Retriever/s3.js';
import Decompressor from './decompressor.js';
//var Promise = require('promise');
var Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();
var S3 = require('../../S3Retriever/s3.js');
var structureBuilder = require('./dataFileStructure.js');

var dataFromS3 = ['empty'];

var feedJson = [ {
"0": "20140101",
"1": "222253",
"2": "57fbde4915cdba5fad8997d297b44fd6",
"3": "1800flowers.com",
"4": "TEST TEST",
id: 0},
{
"0": "20140101",
"1": "072541",
"2": "2ff4f3883bf39c55989499e291f948c8",
"3": "1800flowers.com",
"4": "Product page",
 id: 1 },
{
"0": "20140101",
"1": "144128",
"2": "4a1f123060def68997e3266cbbd4888a",
"3": "1800flowers.com",
"4": "Product page",
id: 2 },
{
"0": "20140101",
"1": "220710",
"2": "2afd4bd95c09afeba81ff2db6003dbc1",
"3": "1800flowers.com",
'4': "Product page" ,
id: 3}];

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

// cols = []
// cols.push({
//   id: "id",
//   dataType: tableau.dataTypeEnum.string
// });
// for (let i = 0; i < 5; i++) {
//   let obj = {
//     id: i.toString(),
//     dataType: tableau.dataTypeEnum.string
//   };
//   cols.push(obj)
// }
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

    // var cols = [
    //   {
    //    id: "id",
    //    dataType: tableau.dataTypeEnum.string
    //  }, {
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
    // }];

    // var tableSchema = {
    //   id: 'feedPrototype',
    //   alias: 'Jumpshot sample feed',
    //   columns: cols
    // }
    //
    var cols = []
    cols.push({
      id: "id",
      dataType: tableau.dataTypeEnum.string
    });
    for (let i = 0; i < 5; i++) {
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
    var tableData = feedJson;
     table.appendRows(tableData);
     doneCallback();
  };


  //TODO remove
  myConnector.getFileNames = function() {
    var fileNames = S3.getS3FileList();
    console.log(fileNames);
    return fileNames
  }
    tableau.registerConnector(myConnector);

})();
/*
Formats data retrieved from S3 into JSON data that can be handled by tableau
@param array of arrays
*/
const formatData = (data) => {
  let dataCollection = []
  for (let i = 0; i < 4 ; i++) { // data.length
    let obj = {id: i}
    for (let j = 0; j < 5; j++) { //data[i].length
      obj[j.toString()] = data[i][j]
    }
    dataCollection.push(obj);
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
          console.log(formattedData);
          console.log(feedJson);

          tableau.connectionName = "Jumpshot Dynamic Feed";
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
