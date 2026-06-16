import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/login-request'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  senha = '';
  erro = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

entrar() {

  this.erro = '';

  const dados: LoginRequest = {
    email: this.email,
    senha: this.senha
  };

  this.authService.login(dados).subscribe({

    next: (resposta) => {
      console.log('LOGIN COMPLETO');
      console.log(resposta);
      console.log('TOKEN:', resposta.token);
      console.log('USUARIO:', resposta.usuario);

      localStorage.setItem(
      'usuario',
      JSON.stringify(resposta)
    );

      this.router.navigate(['/dashboard']);
    },

    error: () => {
      this.erro = 'E-mail ou senha inválidos.';
    }

  });

}
}