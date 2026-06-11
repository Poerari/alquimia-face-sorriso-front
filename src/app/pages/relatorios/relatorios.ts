import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PacienteService } from '../../services/paciente';
import { DentistaService } from '../../services/dentista';
import { ConsultaService } from '../../services/consulta';
import { EspecialidadeService } from '../../services/especialidade';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css'
})
export class Relatorios implements OnInit {

  totalPacientes = 0;
  totalDentistas = 0;
  totalConsultas = 0;
  totalEspecialidades = 0;

  agendadas = 0;
  concluidas = 0;
  atrasadas = 0;
  canceladas = 0;

  dataInicial = '';
  dataFinal = '';
  statusFiltro = '';

  consultas: any[] = [];
  consultasFiltradas: any[] = [];

  constructor(
    private pacienteService: PacienteService,
    private dentistaService: DentistaService,
    private consultaService: ConsultaService,
    private especialidadeService: EspecialidadeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.carregarIndicadores();

  }

  carregarIndicadores() {

    this.pacienteService.listar().subscribe({
      next: dados => {
        this.totalPacientes = dados.length;
        this.cdr.detectChanges();
      },
      error: erro => {
        console.error('ERRO PACIENTES', erro);
      }
    });

    this.dentistaService.listar().subscribe({
      next: dados => {
        this.totalDentistas = dados.length;
        this.cdr.detectChanges();
      },
      error: erro => {
        console.error('ERRO DENTISTAS', erro);
      }
    });

    this.especialidadeService.listar().subscribe({
      next: dados => {
        this.totalEspecialidades = dados.length;
        this.cdr.detectChanges();
      },
      error: erro => {
        console.error('ERRO ESPECIALIDADES', erro);
      }
    });

    this.consultaService.listar().subscribe({
      next: dados => {

        this.consultas = dados;
        this.consultasFiltradas = [...dados];

        this.totalConsultas = dados.length;

        this.agendadas = dados.filter(
          c => c.status === 'AGENDADA'
        ).length;

        this.concluidas = dados.filter(
          c => c.status === 'CONCLUIDA'
        ).length;

        this.atrasadas = dados.filter(
          c => c.status === 'ATRASADA'
        ).length;

        this.canceladas = dados.filter(
          c => c.status === 'CANCELADA'
        ).length;

        this.cdr.detectChanges();

      },
      error: erro => {
        console.error('ERRO CONSULTAS', erro);
      }
    });

  }

  gerarRelatorio() {

    this.consultasFiltradas =
      this.consultas.filter(consulta => {

        const dataConsulta =
          new Date(consulta.dataInicio);

        let atendeDataInicial = true;
        let atendeDataFinal = true;
        let atendeStatus = true;

        if (this.dataInicial) {

          atendeDataInicial =
            dataConsulta >=
            new Date(this.dataInicial);

        }

        if (this.dataFinal) {

          const dataFim =
            new Date(this.dataFinal);

          dataFim.setHours(
            23,
            59,
            59,
            999
          );

          atendeDataFinal =
            dataConsulta <= dataFim;

        }

        if (this.statusFiltro) {

          atendeStatus =
            consulta.status ===
            this.statusFiltro;

        }

        return (
          atendeDataInicial &&
          atendeDataFinal &&
          atendeStatus
        );

      });

    this.cdr.detectChanges();

  }

}