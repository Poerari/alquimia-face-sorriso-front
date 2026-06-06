import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Especialidade } from '../models/especialidade';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {

  private api = 'http://localhost:8080/especialidades';

  constructor(private http: HttpClient) {}

  listar(): Observable<Especialidade[]> {
    return this.http.get<Especialidade[]>(this.api);
  }

}