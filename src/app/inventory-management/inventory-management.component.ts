import { Component, OnInit } from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../student.service";
import {InventoryService} from "../inventory.service";

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {

  constructor(private inventoryService: InventoryService, private messageService: MessageService) {
  }
  studentList: any;
  id: number;
  cols: any[];
  enableStudentPopup: boolean = false;
  studentModalTitle: string = "Loading..";

  submitted = false;
  programYears: SelectItem[];


  studentForm = new FormGroup({
    netId: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dukeEmail: new FormControl('',[Validators.required, Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]),
    altEmail: new FormControl(''),
    programYear: new FormControl('', Validators.required),
    preferredName: new FormControl(''),

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
      {field: 'programYear', header: 'Program Year'}
    ];

    this.programYears = [
      { label: 'All', value: null },
      { label: 'W2019', value: 'W2019' },
      { label: 'G2019', value: 'G2019' },
      { label: 'W2020', value: 'W2020' },
      { label: 'G2020', value: 'G2020' },
    ];

  }

  private getAllStudents() {
    // this.studentService.getAllStudents().then((data: Array<any>) => {
    //   this.studentList = data["studentList"];
    //   console.log(this.studentList)
    // }).catch(data => {
    //   console.log(data);
    // });
  }

  onEditStudentClicked(rowData) {
    this.studentModalTitle = "Edit Student"
    console.log(rowData);
    console.log(rowData.firstName);
    this.id = rowData.id;
    this.studentForm.patchValue({
      netId: rowData.netId,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      dukeEmail: rowData.dukeEmail,
      altEmail: rowData.altEmail,
      programYear: rowData.programYear,
      preferredName:rowData.preferredName,
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
    // console.log(this.studentForm.value);
    // this.submitted = true;
    // const studentRecord = Object.assign({}, this.studentForm.value);
    // if (this.studentModalTitle == 'Add Student') {
    //   this.studentService.insertStudent(studentRecord).then(data => {
    //     console.log("inserted");
    //     this.getAllStudents();
    //   }).catch(data => {
    //     console.log(data);
    //   });
    // } else {
    //   studentRecord.id = this.id;
    //   this.studentService.updateStudent(studentRecord).then(data => {
    //     console.log("updated");
    //     this.getAllStudents();
    //
    //   }).catch(data => {
    //     console.log(data);
    //   });
    // }
    // this.enableStudentPopup = false;

  }
}
