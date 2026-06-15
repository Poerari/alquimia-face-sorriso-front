import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Especialidade } from '../../models/especialidade';
import { EspecialidadeService } from '../../services/especialidade';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css',
})
export class Especialidades implements OnInit {
  especialidades: Especialidade[] = [];
  mostrarFormulario = false;
  modoEdicao = false;
  perfilUsuario = ''; // Armazena o perfil do usuário logado

  especialidadeNova: Especialidade = {
    id: 0,
    nome: ''
  };

  constructor(
    private especialidadeService: EspecialidadeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarEspecialidades();
  }

  // Recupera o perfil para validação de acesso
  carregarPerfil() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.perfilUsuario = usuario.perfil;
    }
  }

  // Verifica se o usuário logado possui restrição de escrita nesta tela
  ehSomenteLeitura(): boolean {
    return (
    this.perfilUsuario === 'DENTISTA' ||
    this.perfilUsuario === 'RECEPCIONISTA'
      );
  }

  carregarEspecialidades() {
    this.especialidadeService.listar().subscribe({
      next: (dados) => {
        this.especialidades = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar especialidades', erro);
      }
    });
  }

  abrirFormulario() {
    if (this.ehSomenteLeitura()) return;

    this.modoEdicao = false;
    this.especialidadeNova = {
      id: undefined as any,
      nome: ''
    };
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.cdr.detectChanges();
  }

  editarEspecialidade(especialidade: Especialidade) {
    if (this.ehSomenteLeitura()) return;

    this.modoEdicao = true;
    this.especialidadeNova = { ...especialidade };
    this.mostrarFormulario = true;
  }

  salvarEspecialidade() {
    if (this.ehSomenteLeitura()) return;

    if (!this.especialidadeNova.nome) {
      alert('O nome da especialidade é obrigatório.');
      return;
    }

    if (this.modoEdicao) {
      this.especialidadeService
        .atualizar(this.especialidadeNova.id, this.especialidadeNova)
        .subscribe({
          next: (atualizada) => {
            const index = this.especialidades.findIndex(e => e.id === atualizada.id);
            if (index !== -1) {
              this.especialidades[index] = atualizada;
            }
            this.fecharFormulario();
            this.cdr.detectChanges();
          },
          error: (erro) => {
            console.error('Erro ao atualizar especialidade', erro);
          }
        });
    } else {
      this.especialidadeService
        .cadastrar(this.especialidadeNova)
        .subscribe({
          next: (nova) => {
            this.especialidades.push(nova);
            this.fecharFormulario();
            this.cdr.detectChanges();
          },
          error: (erro) => {
            console.error('Erro ao cadastrar especialidade', erro);
          }
        });
    }
  }
}