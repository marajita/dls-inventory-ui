import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = "http://localhost:8080/api/v1/student-controller";

  constructor(private http:HttpClient) {}


  async getAllStudents() {
    const studentData = await this.http.get(this.baseUrl+"/getAllStudents").toPromise();
    return studentData;
  }
}
