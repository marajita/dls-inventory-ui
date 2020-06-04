import {Component, OnInit} from '@angular/core';
import {StudentService} from "../student.service";
import {MessageService, SelectItem} from 'primeng/api';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']

})
export class StudentComponent implements OnInit {

  constructor(private studentService: StudentService, private messageService: MessageService) {
  }

  studentList: any;
  studentId: number;
  cols: any[];
  studentHistoryCols: any[];

  enableStudentPopup: boolean = false;
  enableStudentDeletePopup: boolean = false;

  studentModalTitle: string = "Loading..";

  submitted = false;
  programYears: SelectItem[];


  studentForm = new FormGroup({
    netId: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dukeEmail: new FormControl('', [Validators.required, Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]),
    altEmail: new FormControl(''),
    programYear: new FormControl('', Validators.required),
    preferredName: new FormControl(''),

  });

  studentHistoryForm = new FormGroup({
    comments: new FormControl('')

  });
  enableInventoryManagement: boolean = false;
  studentHistoryList: any[] = [];

  get registerFormControl() {
    return this.studentForm.controls;
  }

  ngOnInit(): void {
    this.getAllStudents();
    this.cols = [
      {field: 'netId', header: 'Net ID'},
      {field: 'firstName', header: 'First Name'},
      {field: 'lastName', header: 'Last Name'},
      {field: 'preferredName', header: 'Preferred Name'},
      {field: 'dukeEmail', header: 'Duke Email'},
      {field: 'altEmail', header: 'Alt Email'},
      {field: 'programYear', header: 'Program Year'},
      {field: 'dukeEmail', header: 'Duke Email'},
    ];

    this.programYears = [
      {label: 'All', value: null},
      {label: 'W2019', value: 'W2019'},
      {label: 'G2019', value: 'G2019'},
      {label: 'W2020', value: 'W2020'},
      {label: 'G2020', value: 'G2020'},
    ];

    this.studentHistoryCols = [
      {field: 'netId', header: 'Net ID'},
      {field: 'activityDate', header: 'Activity Date'},
      {field: 'comments', header: 'Comments'},

    ];

  }

  private getAllStudents() {
    this.studentService.getAllStudents().then((data: Array<any>) => {
      this.studentList = data["studentList"];
      // this.studentList = this.studentList.slice(); //Triggers data refresh

      console.log(this.studentList)
    }).catch(data => {
      console.log(data);
    });

    this.studentHistoryList.push({'netId':'bsha452', 'activityDate': '01-01-2020 13:34', 'comments': 'Student entry created'})
    this.studentHistoryList.push({'netId':'bsha452', 'activityDate': '01-01-2020 14:34', 'comments': 'Laptop assigned - DSFSL23423'})

  }

  onEditStudentClicked(rowData) {
    this.studentModalTitle = "Edit Student"
    console.log(rowData);
    console.log(rowData.firstName);
    this.studentId = rowData.studentId;
    this.studentForm.patchValue({
      netId: rowData.netId,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      dukeEmail: rowData.dukeEmail,
      altEmail: rowData.altEmail,
      programYear: rowData.programYear,
      preferredName: rowData.preferredName,
    });
    this.enableStudentPopup = true;
  }

  onAddStudentClicked() {
    this.studentForm.reset();
    this.submitted = false;
    this.studentModalTitle = 'Add Student';
    this.enableStudentPopup = true;
  }

  addOrEditStudent() {
    console.log(this.studentForm.value);
    this.submitted = true;
    const studentRecord = Object.assign({}, this.studentForm.value);
    if (this.studentModalTitle == 'Add Student') {
      this.studentService.insertStudent(studentRecord).then(data => {
        console.log("inserted");
        this.getAllStudents();
      }).catch(data => {
        console.log(data);
      });
    } else {
      studentRecord.studentId = this.studentId;
      this.studentService.updateStudent(studentRecord).then(data => {
        console.log("updated");
        this.getAllStudents();

      }).catch(data => {
        console.log(data);
      });
    }
    this.enableStudentPopup = false;

  }

  exportPdf() {
    alert("Work in progress...")
    // import("jspdf").then(jsPDF => {
    //   import("jspdf-autotable").then(x => {
    //     const doc = new jsPDF.default(0,0);
    //     doc.autoTable(this.exportColumns, this.cars);
    //     doc.save('primengTable.pdf');
    //   })
    // })
  }

  exportExcel() {
    alert("Work in progress...")
    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.getCars());
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "primengTable");
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    alert("Work in progress...")
    // import("file-saver").then(FileSaver => {
    //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //   let EXCEL_EXTENSION = '.xlsx';
    //   const data: Blob = new Blob([buffer], {
    //     type: EXCEL_TYPE
    //   });
    //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // });
  }


  onAssignInventoryClicked(rowData) {
    this.enableInventoryManagement = true;
  }

  onDeleteStudentClicked(rowData) {
    this.studentId = rowData.studentId;
    this.enableStudentDeletePopup = true
  }

  deleteStudent() {
    const studentRecord = {
      studentId: this.studentId,
    };
    this.studentService.deactivateStudent(studentRecord).then(data => {
      console.log("updated");
      this.getAllStudents();
      this.enableStudentDeletePopup = false;
    }).catch(data => {
      console.log(data);
    });
  }

  updateStudentHistory() {

  }
}
