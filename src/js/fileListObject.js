

class FileListObject {
  constructor(file) {
    console.log(file);
    var key = file.Key.split('/');

    this.fileKey = file.Key;
    this.name = key[1];
    this.part = key[5].split('-')[1];
    this.lastModified = file.LastModified.split('T')[0];
  }

  makeFileObject() {
    const obj = `
    <div class='file-list-item'>
    <div class="checkbox-container">
      <input type="checkbox" name="${this.fileKey}">
    </div>
      <div class='file-info-container'>
          <div>${this.name}</div>
          <div>${this.part}</div>
          <div>${this.lastModified}</div>
      </div>
    </div>
    <hr>
    `;
    return obj;
  }

}

export default FileListObject;
