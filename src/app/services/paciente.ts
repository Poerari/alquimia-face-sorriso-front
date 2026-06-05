import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private api = 'http://localhost:8080/pacientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.api);
  }
}