var S3 = require('../../S3Retriever/s3.js');
var structureBuilder = require('./dataFileStructure.js');

import axios from 'axios';
import S3Connection from '../../S3Retriever/s3.js';
import Decompressor from './decompressor.js';

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

//TODO add catch for when zero elements are checked
$(document).ready(function () {
  var fileNameToRequest = [];
    $("#submitButton").click(function () {
      console.log(creds);
      $('.file-info-tile').each(function(index) {


        $(this).find('input[type=checkbox]').each(function(x) {
          console.log(x)
          console.log($(this).is(':checked'))
          console.log($(this).attr('name'))

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
          console.log(res)
          const decompressor = new Decompressor(res.data);
          let unzippedFile = decompressor.decompress();
          console.log(unzippedFile[0]);
        }).catch(function (err) {
          console.log(err)
        });
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

// //TEMP FUNCTION FOR TESTING, REMOVE LATER
// $(document).ready(function() {
//   $('.selection-pane').toggle();
//   var files = [ { Key:
//    'insights-stable-v2-20190302/1800flowers.com/2014/01/01/_SUCCESS',
//   LastModified: '2019-03-20T23:15:30.000Z',
//   Size: 0,
//   StorageClass: 'STANDARD' },
// { Key:
//    'insights-stable-v2-20190302/1800flowers.com/2014/01/01/part-00000-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz',
//   LastModified: '2019-03-03T16:01:09.000Z',
//   Size: 2624,
//   StorageClass: 'STANDARD' },
// { Key:
//    'insights-stable-v2-20190302/1800flowers.com/2014/01/01/part-00001-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz',
//   LastModified: '2019-03-03T16:01:09.000Z',
//   Size: 2516,
//   StorageClass: 'STANDARD' } ]
//   console.log("v6");
//   $.each(files, function(index, file) {
//     if (file.Size > 0) {
//       $('#file-selector').append($(structureBuilder.buildStructure(file)));
//       }
//     });
// });

var creds = {
  key: '',
  secret: ''
}

$(document).ready(function() {
  $(".auth-form").submit(function(e) {
    e.preventDefault();
    console.log('form submission')
    console.log(e)
    console.log($('#username-field').val())
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
