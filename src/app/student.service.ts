import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) {

  }

  async getAllStudents() {
    const studentData = await this.http.get(this.baseUrl+'/api/v1/student-controller/getAllStudents').toPromise();
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
}
