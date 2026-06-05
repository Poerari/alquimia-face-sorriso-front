import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ConsultaService } from './services/consulta';
import { Consulta } from './models/consulta';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit{
  consultas: Consulta[] = [];

  constructor(private consultaService: ConsultaService) {}

  ngOnInit(): void {
    this.consultaService.listar().subscribe({
      next: (dados) => {
        console.log(dados);
        this.consultas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar consultas', erro);
      }
    });
  }
}