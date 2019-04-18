(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//import { getWDCSchema } from '../../S3Retriever/s3.js';
//var x = require('../../S3Retriever/s3.js');
//var q = getWDCSchema();
//console.log(q);
var x = getText();
console.log(x);

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

$(document).ready(function() {
  var fileNames = ["exampleJanuary.tsv", "exampleFebruary.tsv"];
  $.each(fileNames, function(index, name) {
    $('#data-file-selector').append($("<option></option>")
                            .attr("value", name)
                            .text(name)
                          );
  });
});

},{}]},{},[1]);
