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

    // Criamos o objeto baseado na interface antes de enviar
    const dados: LoginRequest = {
      email: this.email,
      senha: this.senha
    };

    this.authService.login(dados).subscribe({
      next: (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.erro = 'Email ou senha inválidos';
      }
    });
  }
}