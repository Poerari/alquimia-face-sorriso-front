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
  perfilUsuario = ''; 

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

  carregarPerfil() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.perfilUsuario = usuario.perfil;
    }
  }

  ehSomenteLeitura(): boolean {
    return (
      this.perfilUsuario === 'DENTISTA' ||
      this.perfilUsuario === 'RECEPCIONISTA'
    );
  }

  carregarDentistas() {
    this.dentistaService.listar().subscribe({
      next: (dados) => {
        this.dentistas = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar dentistas', erro);
      }
    });
  }

  formatarCpf(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.dentistaNovo.cpf = valor;
  }

  formatarCro(event: any): void {
    let valor = event.target.value;
    
    // Remove o prefixo temporariamente para limpar o que não for número
    valor = valor.replace(/^CRO/i, '').replace(/\D/g, '');
    
    // Se o usuário digitou algum número, anexa o prefixo padrão "CRO"
    if (valor.length > 0) {
      this.dentistaNovo.cro = 'CRO' + valor;
    } else {
      this.dentistaNovo.cro = '';
    }
  }

  validarEmail(email: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
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
    
    // Garante que o objeto de edição possua a estrutura de array inicializada
    if (!this.dentistaNovo.especialidades) {
      this.dentistaNovo.especialidades = [];
    }

    this.mostrarFormulario = true;
    this.cdr.detectChanges(); 
  }

  salvarDentista() {
    if (this.ehSomenteLeitura()) return;

    const croDigitado = this.dentistaNovo.cro?.trim();
    const emailDigitado = this.dentistaNovo.email?.trim();

    if (!this.dentistaNovo.nome || !this.dentistaNovo.cpf || !croDigitado || !emailDigitado) {
      alert('Preencha todos os campos obrigatórios (Nome, CPF, CRO e Email).');
      return;
    }

    if (!this.validarEmail(emailDigitado)) {
      alert('Por favor, insira um e-mail em formato válido.');
      return;
    }

    const jaExisteCro = this.dentistas.some(d => 
      d.cro?.toLowerCase() === croDigitado.toLowerCase() && (!this.modoEdicao || d.id !== this.dentistaNovo.id)
    );

    const jaExisteEmail = this.dentistas.some(d => 
      d.email?.toLowerCase() === emailDigitado.toLowerCase() && (!this.modoEdicao || d.id !== this.dentistaNovo.id)
    );

    if (jaExisteCro) {
      alert('Este CRO já está cadastrado para outro dentista.');
      return;
    }

    if (jaExisteEmail) {
      alert('Este e-mail já está cadastrado para outro dentista.');
      return;
    }

    const dadosParaSalvar = {
      ...this.dentistaNovo,
      cpf: this.dentistaNovo.cpf.replace(/\D/g, ''), 
      cro: croDigitado,
      email: emailDigitado
    };

    if (this.modoEdicao) {
      this.dentistaService
        .atualizar(dadosParaSalvar.id, dadosParaSalvar)
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
            alert(erro.error?.message || 'Erro ao atualizar dentista.');
          }
        });
    } else {
      this.dentistaService
        .cadastrar(dadosParaSalvar)
        .subscribe({
          next: (novoDentista) => {
            this.dentistas.push(novoDentista);
            this.fecharFormulario();
            this.cdr.detectChanges();
          },
          error: (erro) => {
            alert(erro.error?.message || 'Erro ao cadastrar dentista.');
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
    if (!this.dentistaNovo || !this.dentistaNovo.especialidades) {
      return false;
    }
    
    return this.dentistaNovo.especialidades.some(
      (e: any) => e.id === especialidadeId
    );
  }
}