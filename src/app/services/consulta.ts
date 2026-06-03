import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Consulta } from '../models/consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = 'http://localhost:8080/consultas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.apiUrl);
  }
}