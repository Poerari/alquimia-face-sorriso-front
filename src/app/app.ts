import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
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
  
  //ADICIONE ESTA VARIÁVEL PARA CONTROLAR O MODAL
  exibirModalLogin: boolean = false; 

  private platformId = inject(PLATFORM_ID);

  constructor(
    private consultaService: ConsultaService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.atualizarUsuario();
      }
    });
  }

  ngOnInit(): void {
    this.atualizarUsuario();
    
    this.consultaService.listar().subscribe({
      next: (dados) => {
        this.consultas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar consultas', erro);
      }
    });
  }

atualizarUsuario(): void {
    if (isPlatformBrowser(this.platformId)) {
      const dados = localStorage.getItem('usuario');
      
      if (dados) {
        this.usuarioLogado = JSON.parse(dados);
      } else {
        this.usuarioLogado = null;
        
        //  Se não estiver logado, força a URL a mudar para /login
        // Isso faz o <router-outlet> do meu @else desenhar a tela de login na hora!
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    }
  }

  sair(): void {
  if (isPlatformBrowser(this.platformId)) {

    localStorage.clear();

    this.usuarioLogado = null;

    this.router.navigate(['/login']);
  }
}
}