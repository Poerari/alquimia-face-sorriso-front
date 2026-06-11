import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Consulta } from '../../models/consulta';
import { Paciente } from '../../models/paciente';
import { Dentista } from '../../models/dentista';

import { ConsultaService } from '../../services/consulta';
import { PacienteService } from '../../services/paciente';
import { DentistaService } from '../../services/dentista';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css'
})
export class Consultas implements OnInit {

  consultas: Consulta[] = [];

  pacientes: Paciente[] = [];

  dentistas: Dentista[] = [];

  mostrarFormulario = false;

  consultaNova: any = {

    descricao: '',

    status: 'AGENDADA',

    dataInicio: '',

    dataFim: '',

    paciente: {
      id: null
    },

    dentista: {
      id: null
    }

  };

  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private dentistaService: DentistaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.carregarConsultas();
   
    this.pacienteService.listar().subscribe({
      next: (dados) => {
        this.pacientes = dados;
      }
    });

    this.dentistaService.listar().subscribe({
      next: (dados) => {
        this.dentistas = dados;
      }
    });

    

  }

  carregarConsultas() {

    this.consultaService.listar().subscribe({

      next: (dados) => {

        this.consultas = dados;

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao carregar consultas',
          erro
        );

      }

    });

  }

  abrirFormulario() {

    this.consultaNova = {

      descricao: '',

      status: 'AGENDADA',

      dataInicio: '',

      dataFim: '',

      paciente: {
        id: null
      },

      dentista: {
        id: null
      }

    };

    this.mostrarFormulario = true;

  }

  fecharFormulario() {

    this.mostrarFormulario = false;

  }
  
 salvarConsulta() {
  
  if (this.consultaNova.dataInicio) {
    this.consultaNova.dataFim = this.consultaNova.dataInicio;
  }

  if (
    !this.consultaNova.paciente?.id ||
    !this.consultaNova.dentista?.id ||
    !this.consultaNova.dataInicio
  ) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  if (this.consultaNova.id) {
    this.consultaService
      .atualizar(this.consultaNova.id, this.consultaNova)
      .subscribe({
        next: () => {
          this.carregarConsultas();
          this.fecharFormulario();
        },
        error: (erro) => {
          console.error('Erro ao atualizar consulta', erro);
        }
      });
  } else {
    this.consultaService
      .cadastrar(this.consultaNova)
      .subscribe({
        next: () => {
          this.carregarConsultas();
          this.fecharFormulario();
        },

        error: (erro) => {

        alert(
          erro.error?.message ||
          'Não foi possível salvar a consulta.'
  );

}
      });
  }
}

editarConsulta(consulta: Consulta) {
  this.mostrarFormulario = true;
  
  
  this.consultaNova = { 
    ...consulta,
  
    paciente: consulta.paciente ? { ...consulta.paciente } : { id: null },
    dentista: consulta.dentista ? { ...consulta.dentista } : { id: null }
  };
}

excluirConsulta(id: number) {

  const confirmar = confirm(
    'Tem certeza que deseja excluir esta consulta?'
  );

  if (!confirmar) {
    return;
  }

  this.consultaService
    .excluir(id)
    .subscribe({

      next: () => {

        this.consultas =
          this.consultas.filter(
            consulta => consulta.id !== id
          );

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao excluir consulta',
          erro
        );

      }

    });

}

}