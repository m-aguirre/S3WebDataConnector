var zlib = require('browserify-zlib');


//
// zlib.gunzip(data.Body, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             var schema = module.exports.generateSchema();
//             dataOutput.push(schema);
//             var dataArray = result.toString('utf8').split('\n');
//             for (i = 0; i < dataArray.length; i++) {
//               dataArray[i] = dataArray[i].split('\u0001');
//               //console.log(dataArray[i]);
//               if (nCols === 0) {
//                 nCols = dataArray[i].length;
//               }
//               if (dataArray[i][0] === '') {
//                 continue;
//               } else {
//                 dataOutput.push(dataArray[i]);
//               }
//             }
//             //console.log(dataArray);
//         }
//         // for (i = 0; i < dataOutput.length; i++) {
//         //   console.log(dataOutput[i]);
//         // }
// });

class Decompressor {
  constructor(data) {
    this.data = data
    this.unzippedFile = [];
  }

  decompress() {
    console.log("UNZIPPING")
    console.log(this.data);
    zlib.gunzip(this.data.Body, function (err, result) {
            if (err) {
                console.log('FAIL');
                console.log(err);
            } else {
                console.log('SUCCESS')
                var dataArray = result.toString('utf8').split('\n');
                for (i = 0; i < dataArray.length; i++) {
                  dataArray[i] = dataArray[i].split('\u0001');
                  console.log(dataArray[i]);
                  if (dataArray[i][0] === '') {
                    continue;
                  } else {
                    this.unzippedFile.push(dataArray[i]);
                  }
                }
                //console.log(dataArray);
            }
            // for (i = 0; i < dataOutput.length; i++) {
            //   console.log(dataOutput[i]);
            // }
    });
    return this.unzippedFile;
  }
}

export default Decompressor;
