import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private api = 'http://localhost:8080/consultas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.api);
  }

  cadastrar(consulta: any): Observable<any> {
  return this.http.post<any>(
    this.api,
    consulta
  );
  }

  atualizar(
      id: number,
      consulta: any
  ): Observable<any> {

    return this.http.put<any>(
        `${this.api}/${id}`,
        consulta
      );

    }
}