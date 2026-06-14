import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Especialidade } from '../../models/especialidade';
import { EspecialidadeService } from '../../services/especialidade';

import { Dentista } from '../../models/dentista';
import { DentistaService } from '../../services/dentista';

@Component({
  selector: 'app-dentistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dentistas.html',
  styleUrl: './dentistas.css',
})
export class Dentistas implements OnInit {

  dentistas: Dentista[] = [];
  mostrarFormulario = false;
  modoEdicao = false;
  perfilUsuario = ''; // Variável para controlar o nível de acesso

  dentistaNovo: any = {
    nome: '',
    cpf: '',
    cro: '',
    email: '',
    ativo: true,
    especialidades: []
  };

  especialidades: Especialidade[] = [];

  constructor(
    private dentistaService: DentistaService,
    private especialidadeService: EspecialidadeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarDentistas();

    this.especialidadeService.listar().subscribe({
      next: (dados) => {
        this.especialidades = dados;
      }
    });
  }

  // Captura o perfil do usuário logado
  carregarPerfil() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.perfilUsuario = usuario.perfil;
    }
  }

  // Helper para verificar se o usuário atual é DENTISTA (somente leitura nesta tela)
  ehSomenteLeitura(): boolean {
    return this.perfilUsuario === 'DENTISTA';
  }

  carregarDentistas() {
    this.dentistaService.listar().subscribe({
      next: (dados) => {
        console.log(dados);
        this.dentistas = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar dentistas', erro);
      }
    });
  }

  abrirFormulario() {
    if (this.ehSomenteLeitura()) return;

    this.modoEdicao = false;
    this.dentistaNovo = {
      nome: '',
      cpf: '',
      cro: '',
      email: '',
      ativo: true,
      especialidades: []
    };
    this.mostrarFormulario = true;
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
  }

  editarDentista(dentista: Dentista) {
    if (this.ehSomenteLeitura()) return;

    this.modoEdicao = true;
    this.dentistaNovo = JSON.parse(JSON.stringify(dentista));
    this.mostrarFormulario = true;
    this.cdr.detectChanges(); 
  }

  salvarDentista() {
    if (this.ehSomenteLeitura()) return;

    if (!this.dentistaNovo.nome || !this.dentistaNovo.cpf || !this.dentistaNovo.cro) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    if (this.modoEdicao) {
      this.dentistaService
        .atualizar(this.dentistaNovo.id, this.dentistaNovo)
        .subscribe({
          next: (dentistaAtualizado) => {
            const index = this.dentistas.findIndex(d => d.id === dentistaAtualizado.id);
            if (index !== -1) {
              this.dentistas[index] = dentistaAtualizado;
            }
            this.fecharFormulario();
            this.cdr.detectChanges();
          },
          error: (erro) => {
            console.error('Erro ao atualizar dentista', erro);
          }
        });
    } else {
      this.dentistaService
        .cadastrar(this.dentistaNovo)
        .subscribe({
          next: (novoDentista) => {
            this.dentistas.push(novoDentista);
            this.fecharFormulario();
            this.dentistaNovo = {
              nome: '',
              cpf: '',
              cro: '',
              email: '',
              ativo: true
            };
            this.cdr.detectChanges();
          },
          error: (erro) => {
            console.error('Erro ao cadastrar dentista', erro);
          }
        });
    }
  }

  toggleEspecialidade(especialidade: Especialidade) {
    if (this.ehSomenteLeitura()) return;

    if (!this.dentistaNovo.especialidades) {
      this.dentistaNovo.especialidades = [];
    }

    const index = this.dentistaNovo.especialidades.findIndex(
      (e: any) => e.id === especialidade.id
    );

    if (index >= 0) {
      this.dentistaNovo.especialidades.splice(index, 1);
    } else {
      this.dentistaNovo.especialidades.push(especialidade);
    }

    this.cdr.detectChanges(); 
  }

  possuiEspecialidade(especialidadeId: number): boolean {
    return this.dentistaNovo.especialidades?.some(
      (e: any) => e.id === especialidadeId
    ) || false;
  }
}