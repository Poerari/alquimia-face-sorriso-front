import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App implements OnInit {
  usuarioLogado: any = null;
  naTelaDeLogin: boolean = true;
  horarioAtual: string = '';
  dicaDoDia: string = '';
  
  private dicas: string[] = [
    "Dica: Um sorriso acolhedor é o melhor cartão de visitas da clínica.",
    ];

  constructor(
  private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: any) => {
    this.naTelaDeLogin = event.url.includes('/login') || event.url === '/';
    this.verificarDadosUsuario();
  });
}


  ngOnInit(): void {
    this.verificarDadosUsuario();
    this.iniciarRelogio();
    this.sortearDica();
    
  }

  verificarDadosUsuario(): void {
  if (isPlatformBrowser(this.platformId)) {
    const dados = localStorage.getItem('usuario');

    if (dados) {
      this.usuarioLogado = JSON.parse(dados);
    } else {
      this.usuarioLogado = null;
    }
  }
}

iniciarRelogio() {
    setInterval(() => {
      this.horarioAtual = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', minute: '2-digit' 
      });
    }, 1000);
  }

  sortearDica() {
    const indice = Math.floor(Math.random() * this.dicas.length);
    this.dicaDoDia = this.dicas[indice];
  }

  deveExibirPainel(): boolean {
    return this.usuarioLogado !== null && !this.naTelaDeLogin;
  }

  sair(): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('usuario');
  }

  this.usuarioLogado = null;
  this.router.navigate(['/login']);
}
}

