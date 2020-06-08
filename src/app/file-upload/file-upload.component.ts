import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng";
import {UploadFileService} from "../upload-file.service";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  url:string = 'http://localhost:8080/api/v1/file-controller/upload'

  constructor(private messageService: MessageService, private uploadFileService: UploadFileService) {}

  ngOnInit(): void {
    console.log("init")
  }

  uploadedFiles: any[] = [];

  onUpload(event) {
    console.log("upload file");
    for(let file of event.files) {
      this.uploadFileService.upload(file);
      this.uploadedFiles.push(file);
    }

    this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
  }
}
