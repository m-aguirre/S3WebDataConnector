var S3 = require('../../S3Retriever/s3.js');
var structureBuilder = require('./dataFileStructure.js');

import S3Connection from '../../S3Retriever/s3.js';

(function () {
  var fileNames = ["exampleJanuary.tsv", "exampleFebruary.tsv"];

  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function(schemaCallback) {

    var cols = [{
      id: 'id',
      dataType: tableau.dataTypeEnum.string
    }, {
      id: 'start',
      alias: 'start-date',
      dataType: tableau.dataTypeEnum.string
    }, {
      id: 'conversions',
      alias: 'conversions',
      dataType: tableau.dataTypeEnum.string
    }, {
      id: 'end',
      alias: 'end-date',
      dataType: tableau.dataTypeEnum.string
    } , {
      id: 'percent',
      alias: 'percentage',
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
    var tableData = dataAsJson;
     table.appendRows(tableData);
     doneCallback();
  };

  myConnector.getFileNames = function() {
    var fileNames = S3.getS3FileList();
    console.log(fileNames);
    return fileNames
  }
    tableau.registerConnector(myConnector);
  // var retriever = require('../S3Retriever/s3.js');
  //
  // getSchema = function() {
  //   retriever.getWDCSchema();
  // }

})();

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "JS Data Feed";
        tableau.submit();
    });
});

// $(document).ready(function () {
//   var bucketNames = ['jumpshot-data-samples'];
//   $.each(bucketNames, function(index, name) {
//     $('#bucket-selector').append($("<option></option>")
//                          .attr("value", name)
//                          .text(name)
//                         );
//     });
// });

$(document).ready(function() {
  var files = [ { Key:
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
  console.log("v4");
  $.each(files, function(index, file) {
    if (file.Size > 0) {
      $('#file-selector').append($(structureBuilder.buildStructure(file)));
      }
    });
});

$(document).ready(function() {
  $(".auth-form").submit(function(e) {
    e.preventDefault();
    console.log('form submission')
    console.log(e)
    console.log($('#username-field').val())

    var s3 = new S3Connection($('#username-field').val(), $('#password-field').val())
    console.log(s3.bucketParams)
    return false;
  });
});
