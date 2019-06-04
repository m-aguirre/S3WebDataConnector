var zlib = require('browserify-zlib');

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
            }
    });
    return this.unzippedFile;
  }
}

export default Decompressor;
