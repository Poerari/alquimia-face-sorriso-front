import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PacienteService } from '../../services/paciente';
import { DentistaService } from '../../services/dentista';
import { ConsultaService } from '../../services/consulta';
import { EspecialidadeService } from '../../services/especialidade';

import {
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';


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
  private cdr: ChangeDetectorRef,
  @Inject(PLATFORM_ID) private platformId: Object
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

      let consultasFiltradas = [...dados];

      let usuarioSalvo: string | null = null;

      if (isPlatformBrowser(this.platformId)) {
        usuarioSalvo =
          localStorage.getItem('usuario');
      }

      if (usuarioSalvo) {

        const usuario = JSON.parse(usuarioSalvo);

        if (usuario.perfil === 'DENTISTA') {

          const limparNome = (nome: string) =>
            nome
              .replace(/\./g, '')
              .trim()
              .toLowerCase();

          consultasFiltradas = consultasFiltradas.filter(
            (consulta: any) =>
              limparNome(
                consulta.dentista?.nome || ''
              ) ===
              limparNome(
                usuario.nome
              )
          );
        }
      }

      consultasFiltradas.sort(
        (a: any, b: any) => b.id - a.id
      );

      this.consultas = consultasFiltradas;
      this.consultasFiltradas = [...consultasFiltradas];

      this.totalConsultas = consultasFiltradas.length;

      this.agendadas = consultasFiltradas.filter(
        c => c.status === 'AGENDADA'
      ).length;

      this.concluidas = consultasFiltradas.filter(
        c => c.status === 'CONCLUIDA'
      ).length;

      this.atrasadas = consultasFiltradas.filter(
        c => c.status === 'ATRASADA'
      ).length;

      this.canceladas = consultasFiltradas.filter(
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

  const resultado = this.consultas.filter(consulta => {

    const dataConsulta = consulta.dataInicio
      ? consulta.dataInicio.substring(0, 10)
      : '';

    const atendeDataInicial =
      !this.dataInicial || dataConsulta >= this.dataInicial;

    const atendeDataFinal =
      !this.dataFinal || dataConsulta <= this.dataFinal;

    const atendeStatus =
      !this.statusFiltro || consulta.status === this.statusFiltro;

    return atendeDataInicial && atendeDataFinal && atendeStatus;
  });

  this.consultasFiltradas = resultado;

  console.log('FILTRADO:', this.consultasFiltradas);
}

exportarPDF() {
  console.log('Botão Exportar clicado!');
  console.log('Plataforma é Browser?', isPlatformBrowser(this.platformId));
  console.log('Dados para exportar:', this.consultasFiltradas);

  if (!isPlatformBrowser(this.platformId)) {
    console.warn('Exportação ignorada: Não está no ambiente do navegador.');
    return;
  }

  if (!this.consultasFiltradas || this.consultasFiltradas.length === 0) {
    alert('Não há dados filtrados para exportar no momento.');
    return;
  }

  try {
    // Instanciação direta do jsPDF
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(18);
    doc.text('Relatorio de Consultas', 14, 20);

    // Mapeando os dados exatamente como aparecem no seu console log
    const dadosBoraMapear = this.consultasFiltradas.map(consulta => {
      let dataTexto = 'Sem data';
      
      if (consulta.dataInicio) {
        const dataObj = new Date(consulta.dataInicio);
        if (!isNaN(dataObj.getTime())) {
          dataTexto = dataObj.toLocaleString('pt-BR');
        } else {
          dataTexto = consulta.dataInicio;
        }
      }

      return [
        consulta.paciente?.nome || 'Nao informado',
        consulta.dentista?.nome || 'Nao informado',
        dataTexto,
        consulta.status || ''
      ];
    });

    console.log('Dados processados para a tabela do PDF:', dadosBoraMapear);

    // Chamada do autoTable repassando a instância do documento
    autoTable(doc, {
      startY: 30,
      head: [['Paciente', 'Dentista', 'Data', 'Status']],
      body: dadosBoraMapear,
      theme: 'grid'
    });

    console.log('Tentando salvar o arquivo PDF...');
    doc.save('relatorio-consultas.pdf');
    console.log('PDF Salvo com sucesso!');

  } catch (erro) {
    console.error('Erro fatal capturado ao gerar o PDF:', erro);
    alert('Erro ao gerar PDF. Olhe o console para detalhes.');
  }
}
}