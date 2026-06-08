import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Dentista } from '../models/dentista';

@Injectable({
  providedIn: 'root'
})
export class DentistaService {

  private api = 'http://localhost:8080/dentistas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Dentista[]> {
  return this.http.get<Dentista[]>(this.api);
}

cadastrar(dentista: Dentista): Observable<Dentista> {
  return this.http.post<Dentista>(
    this.api,
    dentista
  );
}

atualizar(id: number, dentista: Dentista) {
  return this.http.put<Dentista>(
    `${this.api}/${id}`,
    dentista
  );
}
}