import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:HttpClient) {}

  private userUrl = 'http://localhost:8080/user-portal/user';
	private userUrl = '/api';

  public getAllStudents() {
    return this.http.get<any>("http://localhost:8080/api/v1/student-controller/getAllStudents");
  }

  public deleteUser(user) {
//     return this.http.delete(this.userUrl + "/"+ user.id);
  }

  public createUser(user) {
//     return this.http.post<User>(this.userUrl, user);
  }
}
