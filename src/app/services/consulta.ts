import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  
  private apiUrl = 'http://localhost:8080/api/consultas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/${id}`);
  }

  cadastrar(consulta: any): Observable<Consulta> {
    return this.http.post<Consulta>(this.apiUrl, consulta);
  }

  atualizar(id: number, consulta: any): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/${id}`, consulta);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}