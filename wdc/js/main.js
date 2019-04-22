
var S3 = require('../../S3Retriever/s3.js');


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

$(document).ready(function () {
  var bucketNames = ['jumpshot-data-samples'];
  $.each(bucketNames, function(index, name) {
    $('#bucket-selector').append($("<option></option>")
                         .attr("value", name)
                         .text(name)
                        );
    });
});

$(document).ready(function() {
  var fileNames = ["exampleJanuary.tsv", "exampleFebruary.tsv"];
  $.each(fileNames, function(index, name) {
    $('#file-selector').append($("<option></option>")
                            .attr("value", name)
                            .text(name)
                          );
    });
});
