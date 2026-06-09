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

  excluir(id: number): Observable<void> {
  return this.http.delete<void>(
    `${this.api}/${id}`
  );
}

 cadastrar(paciente: Paciente): Observable<Paciente> {

  return this.http.post<Paciente>(
    this.api,
    paciente
  );

}

atualizar(id: number, paciente: Paciente) {

  return this.http.put<Paciente>(
    `${this.api}/${id}`,
    paciente
  );

}
}