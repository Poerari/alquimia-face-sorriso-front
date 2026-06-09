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

  editarConsulta(consulta: Consulta) {

    console.log(
      'Editar consulta:',
      consulta
    );

  }

  salvarConsulta() {

    if (
      !this.consultaNova.paciente.id ||
      !this.consultaNova.dentista.id ||
      !this.consultaNova.dataInicio
    ) {

      alert(
        'Preencha os campos obrigatórios.'
      );

      return;

    }

    this.consultaService
      .cadastrar(this.consultaNova)
      .subscribe({

        next: (novaConsulta) => {

          this.consultas.push(
            novaConsulta
          );

          this.fecharFormulario();

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error(
            'Erro ao salvar consulta',
            erro
          );

        }

      });

  }

}