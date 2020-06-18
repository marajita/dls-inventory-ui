import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng";
import {UploadFileService} from "../upload-file.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as XLSX from "xlsx";


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {


  uploadForm = new FormGroup({
    file: new FormControl(null, Validators.required)
  })


  constructor(private messageService: MessageService, private uploadFileService: UploadFileService) {
  }

  ngOnInit(): void {
  }

  uploadedFiles: File[] = [];
  file: any;

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files;
      this.file = event.target.files[0];
      console.log(this.file);
      // this.form.get('file').setValue(file);
    }
  }

  // onSubmit() {
  //   console.log("submitting");
  //   const fileReader = new FileReader();
  //     fileReader.onload = (e) => {
  //       this.arrayBuffer = fileReader.result;
  //       const data = new Uint8Array(this.arrayBuffer);
  //       const arr = new Array();
  //       for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //       const bstr = arr.join("");
  //       const workbook = XLSX.read(bstr, {type:"binary"});
  //       const first_sheet_name = workbook.SheetNames[0];
  //       let worksheet = workbook.Sheets[first_sheet_name];
  //       console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
  //     }
  //     fileReader.readAsArrayBuffer(this.file);
  // }

  onSubmit() {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.file);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, {type: 'binary'});

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(data); // Data will be logged in array format containing objects
    };
  }
}
