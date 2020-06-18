import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'https://dls-inventory-app.herokuapp.com';

  constructor(private http: HttpClient) {

  }

  async getAllStudents() {
    const studentData = await this.http.get(this.baseUrl + '/api/v1/student-controller/getAllStudents').toPromise();
    return studentData;
  }

  async updateStudent(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/student-controller/updateStudent', data).toPromise();
  }

  async insertStudent(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/student-controller/insertStudent', data).toPromise();
  }

  async deactivateStudent(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/student-controller/deactivateStudent', data).toPromise();
  }

  async assignInventory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/student-controller/assignInventory', data).toPromise();
  }

  async updateStudentHistory(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/student-controller/updateStudentHistory', data).toPromise();
  }

  async getAllStudentHistory(studentId: number) {
    return await this.http.get(this.baseUrl + '/api/v1/student-controller/getAllStudentHistory/' + studentId).toPromise();
  }

  async getStudentByInventoryId(inventoryId: number) {
    return await this.http.get(this.baseUrl + '/api/v1/student-controller/getStudentByInventoryId/' + inventoryId).toPromise();
  }

  async updateStudentFromUpload(data: object) {
    return await this.http.post(this.baseUrl + '/api/v1/student-controller/updateStudentFromUpload', data).toPromise();
  }


}
