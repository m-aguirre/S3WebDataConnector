
class FileListObject {
  constructor(file) {
    let key = file.Key.split('/');
    this.fileKey = file.Key;
    this.name = key[1];
    this.dateOfFile = key[2] + '-' + key[3] + '-' + key[4];
    this.part = key[5].split('-')[1];
    //this.lastModified = file.LastModified.split('T')[0];
    this.fileSize = file.Size;
  }

  makeFileObject() {
    const obj = `
    <div class='file-list-item'>
    <div class="checkbox-container">
      <input type="checkbox" name="${this.fileKey}">
    </div>
      <div class='file-info-container'>
          <div class='file-info-element'>${this.name}</div>
          <div class='file-info-element'>${this.dateOfFile}</div>
          <div class='file-info-element'>${this.part}</div>
          <div class='file-info-element'>${this.fileSize}</div>
      </div>
    </div>
    <hr>
    `;
    return obj;
  }

}

export default FileListObject;
