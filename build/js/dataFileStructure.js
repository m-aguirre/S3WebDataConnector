"use strict";

module.exports = {
  buildStructure: function buildStructure(fileInfo) {
    var key = fileInfo.Key.split('/');
    this.fileKey = fileInfo.Key;
    this.name = key[1];
    this.part = key[5].split('-')[1];
    this.lastModified = fileInfo.LastModified.split('T')[0];
    return "<div class='file-info-tile'>\n            <input type=\"checkbox\" name=\"".concat(this.fileKey, "\"\n            <label for=\"").concat(this.fileKey, "\">\n              <div>\n                <ul>\n                  <li>Name: ").concat(this.name, "</li>\n                  <li>Part: ").concat(this.part, "</li>\n                  <li>Date: ").concat(this.lastModified, "</li>\n                </ul>\n              </div>\n            </label>\n\n            </div>");
  } //
  // var data = { Key:
  //    'insights-stable-v2-20190302/1800flowers.com/2014/01/01/part-00000-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz',
  //   LastModified: '2019-03-03T16:01:09.000Z',
  //   Size: 2624,
  //   StorageClass: 'STANDARD' }
  //
  // var s = module.exports.Structure(data);
  //
  // console.log(s);

};