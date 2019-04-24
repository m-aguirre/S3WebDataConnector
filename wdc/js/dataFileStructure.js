
module.exports  = {

Structure: function (fileInfo) {

    var key = fileInfo.Key.split('/');

    this.name = key[1];
    this.part = key[5].split('-')[1];
    this.lastModified = fileInfo.LastModified.split('T')[0];

    return (
            `<div>
            <label>"Name: ${this.name}"</label>
            <label>"Part: ${this.part}"</label>
            <label>"Date: ${this.lastModified}"</label>
            </div>`
    )

  }
}
//
// var data = { Key:
//    'insights-stable-v2-20190302/1800flowers.com/2014/01/01/part-00000-2551eefb-78be-409d-a9f8-347e791cc0f5.c000.txt.gz',
//   LastModified: '2019-03-03T16:01:09.000Z',
//   Size: 2624,
//   StorageClass: 'STANDARD' }
//
// var s = module.exports.Structure(data);
//
// console.log(s);
