import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ConsultaService } from '../../services/consulta';
import { PacienteService } from '../../services/paciente';
import { DentistaService } from '../../services/dentista';
import { EspecialidadeService } from '../../services/especialidade';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  consultasHoje = 0;
  saudacao = '';
  dataAtual = '';

  graficoEspecialidades!: Chart;

  totalConsultas = 0;
  totalPacientes = 0;
  totalDentistas = 0;
  totalEspecialidades = 0;

  consultasRecentes: any[] = [];
  todasConsultas: any[] = [];

  labelsEspecialidades: string[] = [];
  dadosEspecialidades: number[] = [];

  graficoStatus!: Chart;
  labelsStatus: string[] = [];
  dadosStatus: number[] = [];

  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private dentistaService: DentistaService,
    private especialidadeService: EspecialidadeService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.definirSaudacao();
    this.carregarTotais();

    this.consultaService.listar().subscribe({
      next: (dados) => {
        if (dados) {
          this.todasConsultas = dados;
          this.totalConsultas = dados.length;
          
          // Limita a exibição da tabela para não quebrar a proporção do layout
          this.consultasRecentes = dados.slice(0, 3);

          this.gerarGraficoEspecialidades();
          this.gerarGraficoStatus();

          if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.criarGraficoEspecialidades();
              this.criarGraficoStatus();
              this.cdr.detectChanges();
            }, 50);
          }
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar consultas', erro);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.graficoEspecialidades) {
      this.graficoEspecialidades.destroy();
    }
    if (this.graficoStatus) {
      this.graficoStatus.destroy();
    }
  }

  gerarGraficoEspecialidades() {
    const contador: { [key: string]: number } = {};

    this.todasConsultas.forEach(consulta => {
      if (consulta && consulta.dentista && Array.isArray(consulta.dentista.especialidades)) {
        consulta.dentista.especialidades.forEach((esp: any) => {
          if (esp && esp.nome) {
            contador[esp.nome] = (contador[esp.nome] || 0) + 1;
          }
        });
      }
    });

    this.labelsEspecialidades = Object.keys(contador);
    this.dadosEspecialidades = Object.values(contador);
  }
   
  carregarTotais() {
    this.pacienteService.listar().subscribe({
      next: (dados) => this.totalPacientes = dados?.length || 0,
      error: (err) => console.error('Erro ao carregar pacientes:', err)
    });

    this.dentistaService.listar().subscribe({
      next: (dados) => this.totalDentistas = dados?.length || 0,
      error: (err) => console.error('Erro ao carregar dentistas:', err)
    });

    this.especialidadeService.listar().subscribe({
      next: (dados) => this.totalEspecialidades = dados?.length || 0,
      error: (err) => console.error('Erro ao carregar especialidades:', err)
    });
  }

  definirSaudacao() {
    const hora = new Date().getHours();

    if (hora < 12) {
      this.saudacao = 'Bom dia';
    } else if (hora < 18) {
      this.saudacao = 'Boa tarde';
    } else {
      this.saudacao = 'Boa noite';
    }

    this.dataAtual = new Date().toLocaleDateString(
      'pt-BR',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );
  }

  criarGraficoEspecialidades() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = document.getElementById('graficoEspecialidades') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.graficoEspecialidades instanceof Chart) {
      this.graficoEspecialidades.destroy();
    }

    this.graficoEspecialidades = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.labelsEspecialidades,
        datasets: [
          {
            data: this.dadosEspecialidades,
            backgroundColor: [
              '#3182CE', '#805AD5', '#319795', '#B22222', '#2E8B57', '#FF7256'
            ]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  gerarGraficoStatus() {
    const contador: any = {};

    this.todasConsultas.forEach(consulta => {
      const status = consulta.status;
      contador[status] = (contador[status] || 0) + 1;
    });

    this.labelsStatus = Object.keys(contador);
    this.dadosStatus = Object.values(contador);
  }

  criarGraficoStatus() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = document.getElementById('graficoStatus') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.graficoStatus instanceof Chart) {
      this.graficoStatus.destroy();
    }

    this.graficoStatus = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.labelsStatus,
        datasets: [
          {
            label: 'Quantidade',
            data: this.dadosStatus,
            backgroundColor: this.labelsStatus.map(status => {
              switch(status?.toUpperCase()) {
                case 'AGENDADA': return '#F6E05E';
                case 'CONCLUIDA': return '#68D391';
                case 'CANCELADA': return '#FC8181';
                case 'ATRASADA': return '#F6AD55';
                default: return '#E2E8F0';
              }
            }),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}