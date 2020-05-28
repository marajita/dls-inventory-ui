import {Component, OnInit} from '@angular/core';
import {StudentService} from "../student.service";
import {MessageService} from 'primeng/api';
import {FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']

})
export class StudentComponent implements OnInit {

  constructor(private studentService: StudentService, private messageService: MessageService) {
  }

  studentList: any;
  cols: any[];
  displayAddStudent: boolean = false;
  studentModalTitle: string = "Loading..";

  studentForm = new FormGroup({
    netId: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    altEmail: new FormControl(''),
    programYear: new FormControl(''),
  });

  ngOnInit(): void {
    this.studentService.getAllStudents().then((data: Array<any>) => {
      this.studentList = data["studentList"];
      console.log(this.studentList)
    });
    this.cols = [
      {field: 'netId', header: 'Net ID'},
      {field: 'firstName', header: 'First Name'},
      {field: 'lastName', header: 'Last Name'},
      {field: 'email', header: 'Email'},
      {field: 'altEmail', header: 'Alt Email'},
      {field: 'programYear', header: 'Program Year'}
    ];

  }

  onEditStudentClicked(rowData) {
    this.studentModalTitle = "Edit Student"
    console.log(rowData);
    console.log(rowData.firstName);
    this.studentForm.patchValue({
      netId: rowData.netId,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      email: rowData.email,
      altEmail: rowData.altEmail,
      programYear: rowData.programYear,
    });
    this.displayAddStudent = true;

  }

  onAddStudentClicked() {
    this.studentForm.reset();
    this.studentModalTitle = "Add Student"
    this.displayAddStudent = true;
  }

  addStudent() {
    console.log(this.studentForm.value);
  }
}
