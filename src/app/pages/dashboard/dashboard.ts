import {
  Component,
  OnInit,
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
export class Dashboard implements OnInit {

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
      // Garante que 'dados' é um array válido
      this.todasConsultas = dados || [];
      this.totalConsultas = this.todasConsultas.length;
      this.consultasRecentes = this.todasConsultas.slice(0, 5);

      // Só tenta gerar o gráfico se houver consultas no banco
      if (this.todasConsultas.length > 0) {
        this.gerarGraficoEspecialidades();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.criarGraficoEspecialidades();
          }, 50); // Um pequeno delay garante que o HTML já renderizou o <canvas>
        }
      }
    },
    error: (erro) => {
      console.error('Erro ao carregar consultas:', erro);
    }
  });
}

gerarGraficoEspecialidades() {
  const contador: { [key: string]: number } = {};

  this.todasConsultas.forEach(consulta => {
    // Validação defensiva completa: verifica se dentista e especialidades existem e se é um array
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

    const canvas =
      document.getElementById(
        'graficoEspecialidades'
      ) as HTMLCanvasElement;

    if (!canvas) return;

    if (this.graficoEspecialidades) {
      this.graficoEspecialidades.destroy();
    }

    this.graficoEspecialidades =
      new Chart(canvas, {

        type: 'doughnut',

        data: {

          labels: this.labelsEspecialidades,

          datasets: [

            {

              data: this.dadosEspecialidades,

              backgroundColor: [

                '#d8cb72',
                '#c9bb61',
                '#b8aa53',
                '#9e9247',
                '#85783a',
                '#6d6230'

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

  

}


