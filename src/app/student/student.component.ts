import {Component, OnInit} from '@angular/core';
import {StudentService} from "../student.service";
import {MessageService, SelectItem} from 'primeng/api';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  enableInventoryManagement: boolean = false;
  enableInventoryRepair: boolean = false;

  studentHistoryList: any[] = [];

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
      {field: 'laptopSn', header: 'Laptop SN'},

    ];

    this.studentHistoryCols = [
      // {field: 'netId', header: 'Net ID'},
      {field: 'createdDate', header: 'Activity Date'},
      {field: 'comments', header: 'Comments'},

    ];

  }

  private getAllStudents() {
    this.studentService.getAllStudents().then((data: Array<any>) => {
      this.studentList = data["studentList"];
      console.log(this.studentList)
      this.generateProgramYears(this.studentList);
    }).catch(data => {
      console.log(data);
    });
  }

  // generate program search dropdown
  generateProgramYears(studentList: any[]) {
    this.programYears = [];
    let tempProgramYear: string[] = [];
    for (let student of studentList) {
      tempProgramYear.push(student.programYear);
      const uniqueSet: Set<string> = new Set(tempProgramYear);
      tempProgramYear = [...uniqueSet];
    }
    this.programYears.push({label: 'All', value: null});
    for (let programYear of tempProgramYear) {
      this.programYears.push({label: programYear, value: programYear})
    }

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

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.getStudentsExport());
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, "Student");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
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
      let std = {
        netId: student.netId,
        firstName: student.firstName,
        lastName: student.lastName,
        preferredName: student.preferredName,
        dukeEmail: student.dukeEmail,
        altEmail: student.altEmail,
        programYear: student.programYear,
        laptopSn: student.laptopSn
      }
      students.push(std);
    }
    return students;
  }


  onAssignInventoryClicked(rowData) {
    this.inventoryAssignForm.reset();
    this.inventoryRepairForm.reset();
    this.studentHistoryForm.reset();
    console.log(rowData.inventory);
    this.studentId = rowData.studentId;
    this.assignedInventory = rowData.inventory;
    if (this.assignedInventory == null) {
      this.assignedInventory = {laptopSn: '', powerAdapterSn: ''};
    }
    this.enableInventoryManagement = true;
    this.getStudentHistory();
  }

  private getStudentHistory() {
    this.studentService.getAllStudentHistory(this.studentId).then(data => {
      this.studentHistoryList = data["studentHistoryList"];
      console.log(this.studentHistoryList);
    }).catch(data => {
      console.log(data);
    });
  }

  onDeleteStudentClicked() {
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
      this.enableStudentPopup = false;
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
      this.getStudentHistory();
      this.studentHistoryForm.reset();
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
    this.assignedInventory = inventoryRecord.inventory;
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Laptop Assigned'});

  }

  onCloseAssignPopUpClicked() {
    this.getAllStudents();
    this.enableInventoryManagement = false;

  }

  assignInventory(data) {
    this.studentService.assignInventory(data).then(r => {
      this.getStudentHistory();
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
    inventoryRecord.studentId = this.studentId;
    console.log(inventoryRecord);

    this.inventoryService.repairInventory(inventoryRecord).then(data => {
      this.assignedInventory = {laptopSn: '', powerAdapterSn: ''};
      this.getStudentHistory();
      this.inventoryRepairForm.reset();
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Inventory Updated'});
    }).catch(data => {
      console.log(data);
    });
  }
}
