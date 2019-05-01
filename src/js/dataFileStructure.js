
module.exports  = {

buildStructure: function (fileInfo) {

    var key = fileInfo.Key.split('/');

    this.fileKey = fileInfo.Key;
    this.name = key[1];
    this.part = key[5].split('-')[1];
    this.lastModified = fileInfo.LastModified.split('T')[0];

    return (
            `<div class='file-info-tile'>
            <input type="checkbox" name="${this.fileKey}"
            <label for="${this.fileKey}">
              <div>
                <ul>
                  <li>Name: ${this.name}</li>
                  <li>Part: ${this.part}</li>
                  <li>Date: ${this.lastModified}</li>
                </ul>
              </div>
            </label>

            </div>`
    )

  }
}
//TODO refactor to ES6 class
