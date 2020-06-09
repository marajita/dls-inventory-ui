import {Component, OnInit} from '@angular/core';
import {StudentService} from "../student.service";
import {MessageService, SelectItem} from 'primeng/api';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import * as XLSX from "node_modules/xlsx/dist/xlsx.js";
import {InventoryService} from "../inventory.service";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']

})
export class StudentComponent implements OnInit {

  constructor(private studentService: StudentService, private inventoryService: InventoryService, private messageService: MessageService) {
  }

  studentList: any[];
  studentId: number;
  cols: any[];
  studentHistoryCols: any[];

  enableStudentPopup: boolean = false;
  enableStudentDeletePopup: boolean = false;

  studentModalTitle: string = "Loading..";

  submitted = false;
  programYears: SelectItem[];

  //Inventory
  assignedInventory = {};
  enableInventoryAssignment: boolean = false;

  spareInventoryList: SelectItem[] = [];

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

  inventoryAssignForm = new FormGroup({
    inventory: new FormControl('', Validators.required)
  });

  inventoryRepairForm = new FormGroup({
    comments: new FormControl('', Validators.required)
  });

  enableInventoryManagement: boolean = false;
  enableInventoryRepair: boolean = false;

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
      {field: '', header: 'Laptop SN'},

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

    this.studentHistoryList.push({
      'netId': 'bsha452',
      'activityDate': '01-01-2020 13:34',
      'comments': 'Student entry created'
    })
    this.studentHistoryList.push({
      'netId': 'bsha452',
      'activityDate': '01-01-2020 14:34',
      'comments': 'Laptop assigned - DSFSL23423'
    })

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
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Student Added'});
        this.getAllStudents();
      }).catch(data => {
        console.log(data);
      });

    } else {
      studentRecord.studentId = this.studentId;
      this.studentService.updateStudent(studentRecord).then(data => {
        console.log("updated");
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Student Updated'});
        this.getAllStudents();
      }).catch(data => {
        console.log(data);
      });
    }
    this.enableStudentPopup = false;

  }


  // exportExcel() {
  //   console.log(this.getStudentsExport());
  //   import("node_modules/xlsx/dist/xlsx.js").then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet([
  //       { A:"S", B:"h", C:"e", D:"e", E:"t", F:"J", G:"S" },
  //       { A: 1,  B: 2,  C: 3,  D: 4,  E: 5,  F: 6,  G: 7  },
  //       { A: 2,  B: 3,  C: 4,  D: 5,  E: 6,  F: 7,  G: 8  }
  //     ], {header:["A","B","C","D","E","F","G"]});
  //     const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  //     const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
  //     this.saveAsExcelFile(excelBuffer, "student");
  //   });
  // }

  exportExcel() {
    const fileName = 'test.xlsx';

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getStudentsExport());
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'test');

    XLSX.writeFile(wb, fileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("node_modules/file-saver/dist/FileSaver.js").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.ms-excel;charset=utf-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  getStudentsExport() {
    let students = [];
    for (let student of this.studentList) {
      // student.netId = student.netId.toString();
      // student.firstName = student.firstName.toString();
      // student.lastName = student.lastName.toString();
      // student.preferredName = student.preferredName.toString();
      // student.dukeEmail = student.dukeEmail.toString();
      // student.altEmail = student.altEmail.toString();
      // student.programYear = student.programYear.toString();
      let std = {
        netId: student.netId.toString(),
        firstName: student.firstName.toString(),
        lastName: student.lastName.toString(),
        preferredName: student.preferredName.toString(),
        dukeEmail: student.dukeEmail.toString(),
        altEmail: student.altEmail.toString(),
        programYear: student.programYear.toString()
      }
      students.push(std);
    }
    return students;
  }


  onAssignInventoryClicked(rowData) {
    console.log(rowData.inventory);
    this.studentId = rowData.studentId;
    this.assignedInventory = rowData.inventory;
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
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Student Deleted'});

    }).catch(data => {
      console.log(data);
    });
  }

  updateStudentHistory() {
    const studentRecord = Object.assign({}, this.studentHistoryForm.value);
    studentRecord.studentId = this.studentId
      this.studentService.updateStudentHistory(studentRecord).then(data => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Student Notes added'});
      }).catch(data => {
        console.log(data);
      });
  }


  onInventoryAssignNewLaptopClicked() {
    this.enableInventoryRepair = false;
    //get spare inventory list
    this.inventoryService.getAllSpareInventories().then(data => {
      console.log(data["inventoryList"]);
      const spareInvList = data["inventoryList"];
      this.spareInventoryList = [];

      for (let inv of spareInvList) {
        inv.label = inv.laptopSn;
        inv.value = inv;
        this.spareInventoryList.push(inv);
      }
      console.log(this.spareInventoryList);
      this.enableInventoryAssignment = true;

    }).catch(error => {
      console.log(error)
    });
  }


  onInventoryAssignNewLaptopSaved() {
    const inventoryRecord = Object.assign({}, this.inventoryAssignForm.value);
    console.log(inventoryRecord);
    const input = {
      studentId: this.studentId,
      inventoryId: inventoryRecord.inventory.inventoryId
    }
    this.assignInventory(input);
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Laptop Assigned'});

  }

  onCloseAssignPopUpClicked() {
    this.getAllStudents();
    this.enableInventoryManagement = false;

  }

  assignInventory(data) {
    this.studentService.assignInventory(data).then(r => {
      console.log(r)
    });
  }

  onInventoryRepairClicked() {
    this.enableInventoryRepair = true;
    this.enableInventoryAssignment = false;

  }

  onInventoryRepairSaved() {
    const inventoryRecord = Object.assign({}, this.inventoryRepairForm.value);
    console.log(this.assignedInventory);
    inventoryRecord.inventoryId = this.assignedInventory['inventoryId'];
    inventoryRecord.status = 'IN_REPAIR';
    console.log(inventoryRecord);

    this.inventoryService.repairInventory(inventoryRecord).then(data => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Inventory Updated'});
    }).catch(data => {
      console.log(data);
    });

    // this.inventoryService.isInventoryInUse(inventoryRecord).then(data => {
    //   console.log(data)
    //   if (data === false) {
    //     this.inventoryService.repairInventory(inventoryRecord).then(data => {
    //       this.messageService.add({severity: 'success', summary: 'Success', detail: 'Inventory Updated'});
    //     }).catch(data => {
    //       console.log(data);
    //     });
    //   } else {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Success',
    //       detail: 'Inventory in use. Please un-assign and try again'
    //     });
    //   }
    // }).catch(data => {
    //   console.log(data);
    // });


  }
}
