import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Paciente } from '../../models/paciente';
import { PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css',
})
export class Pacientes implements OnInit {
  pacientes: Paciente[] = [];
  filtro = '';
  mostrarFormulario = false;
  modoEdicao = false; 
  perfilUsuario = ''; // Variável para armazenar o perfil logado

  pacienteNovo: Paciente = {
    id: 0,
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  };

  get pacientesFiltrados() {
    return this.pacientes.filter(paciente =>
      paciente.nome && paciente.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  constructor(
    private pacienteService: PacienteService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarPacientes();
  }

  // Captura o perfil do localStorage para sabermos o nível de acesso
  carregarPerfil() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      this.perfilUsuario = usuario.perfil;
    }
  }

  // Método auxiliar para verificar se o usuário atual é apenas um leitor (Dentista)
  ehSomenteLeitura(): boolean {
    return this.perfilUsuario === 'DENTISTA';
  }

  carregarPacientes() {
    this.pacienteService.listar().subscribe({
      next: (dados) => {
        console.log('Dados recebidos do back-end:', dados);
        this.pacientes = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar pacientes', erro);
      }
    });
  }

  // Máscara dinâmica de CPF
  formatarCpf(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.pacienteNovo.cpf = valor;
  }

  // Máscara dinâmica de Telefone (Suporta Fixo com 10 dígitos e Celular com 11 dígitos)
  formatarTelefone(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    
    // Aplica o parêntese no DDD
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    
    // Se tiver mais de 13 caracteres com a máscara, assume formato de celular celular: (XX) XXXXX-XXXX
    if (valor.length > 13) {
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    } else {
      // Caso contrário, assume formato fixo: (XX) XXXX-XXXX
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    this.pacienteNovo.telefone = valor;
  }

  // Validação Regex para garantir a estrutura do e-mail antes do envio
  validarEmail(email: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  abrirFormulario() {
    if (this.ehSomenteLeitura()) return;

    this.modoEdicao = false;
    this.pacienteNovo = {
      id: undefined as any, 
      nome: '',
      cpf: '',
      email: '',
      telefone: ''
    };
    this.mostrarFormulario = true;
    this.cdr.detectChanges(); 
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
    this.cdr.detectChanges();
  }

  limparFormulario() {
    this.pacienteNovo = {
      id: 0,
      nome: '',
      cpf: '',
      email: '',
      telefone: ''
    };
  }

  editarPaciente(paciente: Paciente) {
    if (this.ehSomenteLeitura()) return;

    this.modoEdicao = true;
    this.pacienteNovo = { ...paciente }; 
    this.mostrarFormulario = true;
  }

  salvarPaciente() {
    if (this.ehSomenteLeitura()) return;

    if (!this.pacienteNovo.nome || !this.pacienteNovo.cpf) {
      alert('Nome e CPF são obrigatórios.');
      return;
    }

    // Validação estrutural do e-mail
    if (this.pacienteNovo.email && !this.validarEmail(this.pacienteNovo.email)) {
      alert('Por favor, insira um e-mail válido (exemplo: usuario@gmail.com).');
      return;
    }

    // CRIA UM OBJETO LIMPO PARA O BACK-END (Remove pontos, traços e parênteses)
    const dadosParaSalvar = {
      ...this.pacienteNovo,
      cpf: this.pacienteNovo.cpf.replace(/\D/g, ''), // Remove tudo que não for número
      telefone: this.pacienteNovo.telefone ? this.pacienteNovo.telefone.replace(/\D/g, '') : '' // Remove tudo que não for número
    };

    if (this.modoEdicao) {
      this.pacienteService
        .atualizar(dadosParaSalvar.id, dadosParaSalvar)
        .subscribe({
          next: (pacienteAtualizado) => {
            const index = this.pacientes.findIndex(p => p.id === pacienteAtualizado.id);
            if (index !== -1) {
              // Mantém os dados atualizados na lista
              this.pacientes[index] = pacienteAtualizado;
            }
            this.fecharFormulario();
            this.cdr.detectChanges();
          },
          error: (erro) => {
            // Exibe a mensagem exata enviada pela validação do back-end
            alert(erro.error?.message || 'Erro ao atualizar paciente.');
          }
        });
    } else {
      this.pacienteService
        .cadastrar(dadosParaSalvar)
        .subscribe({
          next: (novoPaciente) => {
            this.pacientes.push(novoPaciente);
            this.fecharFormulario();
            this.cdr.detectChanges();
          },
          error: (erro) => {
            // Exibe a mensagem exata enviada pela validação do back-end
            alert(erro.error?.message || 'Erro ao salvar paciente.');
          }
        });
    }
  }
}