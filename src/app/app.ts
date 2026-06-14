import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ConsultaService } from './services/consulta';
import { Consulta } from './models/consulta';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  consultas: Consulta[] = [];
  usuarioLogado: any = null;

  constructor(
    private consultaService: ConsultaService,
    private router: Router
  ) {
    // Escuta as mudanças de rota para atualizar o menu lateral assim que o login for feito
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.atualizarUsuario();
      }
    });
  }

  ngOnInit(): void {
    this.atualizarUsuario();
    
    // Deixamos a listagem de consultas aqui caso você use globalmente
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

  // Busca as informações atualizadas do localStorage
  atualizarUsuario(): void {
    const dados = localStorage.getItem('usuario');
    if (dados) {
      this.usuarioLogado = JSON.parse(dados);
    } else {
      this.usuarioLogado = null;
    }
  }

  // Função para deslogar do sistema
  sair(): void {
    localStorage.removeItem('usuario');
    this.usuarioLogado = null;
    this.router.navigate(['/login']);
  }
}