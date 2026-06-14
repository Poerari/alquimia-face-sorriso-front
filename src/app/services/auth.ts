import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(dadosLogin: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, dadosLogin);
  }
}