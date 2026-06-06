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
    this.carregarPacientes();
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

  abrirFormulario() {
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
    this.modoEdicao = true;
    
    this.pacienteNovo = { ...paciente }; 
    this.mostrarFormulario = true;
  }

  salvarPaciente() {
    
    if (!this.pacienteNovo.nome || !this.pacienteNovo.cpf) {
      console.warn('Nome e CPF são obrigatórios.');
      return;
    }

    if (this.modoEdicao) {
      
    } else {
      
      this.pacienteService.cadastrar(this.pacienteNovo).subscribe({
        next: (novoPaciente) => {
          
          this.pacientes = [...this.pacientes, novoPaciente]; 
          this.fecharFormulario();
          this.cdr.detectChanges();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar paciente', erro);
        }
      });
    }
  }
}