import axios from 'axios';
import S3Connection from '../../S3Retriever/s3.js';
import Decompressor from './decompressor.js';
//var Promise = require('promise');
var Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();
var S3 = require('../../S3Retriever/s3.js');
var structureBuilder = require('./dataFileStructure.js');

var dataFromS3 = ['empty'];


var dataAsJson = [ { id: 0,
start: 'Feb 25, 2019',
conversions: 15172,
end: 'Feb 25, 2019',
percent: 1 },
{ id: 1,
start: 'Feb 26, 2019',
conversions: 10990,
end: 'Feb 26, 2019',
percent: 1 },
{ id: 2,
start: 'Feb 27, 2019',
conversions: 9824,
end: 'Feb 27, 2019',
percent: 1 },
{ id: 3,
start: 'Feb 28, 2019',
conversions: 10454,
end: 'Feb 28, 2019',
percent: 1 },
{ id: 4,
start: 'Mar 1, 2019',
conversions: 12698,
end: 'Mar 1, 2019',
percent: 1 },
{ id: 5,
start: 'Mar 2, 2019',
conversions: 12191,
end: 'Mar 2, 2019',
percent: 1 },
{ id: 6,
start: 'Mar 3, 2019',
conversions: 13483,
end: 'Mar 3, 2019',
percent: 1 } ];

// var feedJson = [
// {a: "20140101", b: "222253", c: "57fbde4915cdba5fad8997d297b44fd6", d: "1800flowers.com", e: "Product page", id: 1},
// {a: "20140101", b: "072541", b: "2ff4f3883bf39c55989499e291f948c8", d: "1800flowers.com", e: "Product page", id: 2},
// {a: "20140101", b: "144128", c: "4a1f123060def68997e3266cbbd4888a", d: "1800flowers.com", e: "Product page", id: 3}
// ]

var feedJson = [ { id: 0,
"1": "20140101",
"2": "222253",
"3": "57fbde4915cdba5fad8997d297b44fd6",
"4": "1800flowers.com"},
{ id: 1,
"1": "20140101",
"2": "072541",
"3": "2ff4f3883bf39c55989499e291f948c8",
"4": "1800flowers.com" },
{ id: 2,
"1": "20140101",
"2": "144128",
"3": "4a1f123060def68997e3266cbbd4888a",
"4": "1800flowers.com" },
{ id: 3,
"1": "20140101",
"2": "220710",
"3": "2afd4bd95c09afeba81ff2db6003dbc1",
"4": "1800flowers.com" } ];




  var myConnector = tableau.makeConnector();

  // var cols = []
  // for (let i = 0; i < 5; i++) {
  //   let obj = {
  //     id: i,
  //     dataType: tableau.dataTypeEnum.string
  //   };
  //   cols.push(obj)
  // }
  // console.log(cols)
  myConnector.getSchema = function(schemaCallback) {


    // var cols = [{
    //   id: 'id',
    //   dataType: tableau.dataTypeEnum.string
    // }, {
    //   id: 'start',
    //   alias: 'start-date',
    //   dataType: tableau.dataTypeEnum.string
    // }, {
    //   id: 'conversions',
    //   alias: 'conversions',
    //   dataType: tableau.dataTypeEnum.string
    // }, {
    //   id: 'end',
    //   alias: 'end-date',
    //   dataType: tableau.dataTypeEnum.string
    // } , {
    //   id: 'percent',
    //   alias: 'percentage',
    //   dataType: tableau.dataTypeEnum.string
    // }];


    var cols = [{
      id: "id",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "1",
      dataType: tableau.dataTypeEnum.string
    },{
      id: "2",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "3",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "4",
      dataType: tableau.dataTypeEnum.string
    }];

    var tableSchema = {
      id: 'feedPrototype',
      alias: 'Jumpshot sample feed',
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



/*
Formats data retrieved from S3 into JSON data that can be handled by tableau
@param array of arrays
*/
const formatData = (data) => {
  let dataCollection = []
  for (let i = 0; i < data.length; i++) {
    let obj = {id: i}
    for (let j = 0; j < 5; j++) { //data[i].length
      obj[j.toString()] = data[i][j]
    }
    dataCollection.push(obj);
  }
  dataFromS3 = dataCollection;
  console.log(dataFromS3);
}

//TODO add catch for when zero elements are checked
$(document).ready(function () {
  console.log('v1')
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
          console.log(res.data)
          formatData(res.data);
          (function () {
            var fileNames = ["exampleJanuary.tsv", "exampleFebruary.tsv"];

            var myConnector = tableau.makeConnector();

            myConnector.getSchema = function(schemaCallback) {

              // var cols = []
              //   for (let i = 0; i < 19; i++) {
              //     let obj = {
              //       id: i.toString(),
              //       dataType: tableau.dataTypeEnum.string
              //     };
              //     cols.push(obj)
              //   }

              // var cols = [{
              //   id: 'id',
              //   dataType: tableau.dataTypeEnum.string
              // }, {
              //   id: 'start',
              //   alias: 'start-date',
              //   dataType: tableau.dataTypeEnum.string
              // }, {
              //   id: 'conversions',
              //   alias: 'conversions',
              //   dataType: tableau.dataTypeEnum.string
              // }, {
              //   id: 'end',
              //   alias: 'end-date',
              //   dataType: tableau.dataTypeEnum.string
              // } , {
              //   id: 'percent',
              //   alias: 'percentage',
              //   dataType: tableau.dataTypeEnum.string
              // }];

              var cols = [{
                id: "id",
                dataType: tableau.dataTypeEnum.string
              }, {
                id: "1",
                dataType: tableau.dataTypeEnum.string
              },{
                id: "2",
                dataType: tableau.dataTypeEnum.string
              }, {
                id: "3",
                dataType: tableau.dataTypeEnum.string
              }, {
                id: "4",
                dataType: tableau.dataTypeEnum.string
              }];

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


          tableau.connectionName = "Jumpshot Sample Feed";
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
      console.log(res)
      console.log(res.data)
      creds.key = user;
      creds.secret = pass;

      $('.selection-pane').toggle();
      $.each(res.data, function(index, file) {
        console.log(file);
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
