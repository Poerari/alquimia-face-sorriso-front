
import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';


import { Consulta } from '../../models/consulta';
import { Paciente } from '../../models/paciente';
import { Dentista } from '../../models/dentista';
import { EspecialidadeService } from '../../services/especialidade'; 

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
  trackByConsulta(index: number, consulta: Consulta) {
    return consulta.id;
  }

  private platformId = inject(PLATFORM_ID);

  consultas: Consulta[] = [];
  pacientes: Paciente[] = [];
  dentistas: Dentista[] = [];
  especialidades: any[] = []; // Lista global idêntica à de dentistas
  
  mostrarFormulario = false;

  totalAgendadas = 0;
  totalConcluidas = 0;
  totalAtrasadas = 0;
  totalCanceladas = 0;

  perfilUsuario = '';
  nomeUsuarioLogado = '';
  idDentistaLogado: number | null = null;
  dataMinima = new Date().toISOString().slice(0, 16);

  consultaNova: any = {
    descricao: '',
    status: 'AGENDADA',
    dataInicio: '',
    dataFim: '',
    paciente: { id: null },
    dentista: { id: null },
    especialidade: { id: null }
  };

  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private dentistaService: DentistaService,
    private especialidadeService: EspecialidadeService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();

    this.pacienteService.listar().subscribe({
      next: (dados) => { this.pacientes = dados; }
    });

    
    this.especialidadeService.listar().subscribe({
      next: (dados) => { this.especialidades = dados; },
      error: (erro) => console.error('Erro ao listar especialidades', erro)
    });

    this.dentistaService.listar().subscribe({
      next: (dados) => {
        this.dentistas = dados;
        this.vincularIdDentista();
        this.carregarConsultas(); 
      },
      error: (erro) => {
        console.error('Erro ao listar dentistas', erro);
        this.carregarConsultas();
      }
    });
  }

 carregarPerfil() {
  if (isPlatformBrowser(this.platformId)) {

    const usuarioSalvo =
      localStorage.getItem('usuario');

    console.log('USUARIO SALVO:', usuarioSalvo);

    if (usuarioSalvo) {

      const usuario = JSON.parse(usuarioSalvo);

      console.log('OBJETO USUARIO:', usuario);

      this.perfilUsuario = usuario.perfil;
      this.nomeUsuarioLogado = usuario.nome;
    }
  }
}

  ehDentista(): boolean {
    return this.perfilUsuario === 'DENTISTA';
  }

  vincularIdDentista() {
    if (this.ehDentista() && this.dentistas.length > 0) {
      const limparString = (txt: string) => txt.replace(/\./g, '').trim().toLowerCase();
      const nomeLogadoLimpo = limparString(this.nomeUsuarioLogado);

      const correspondente = this.dentistas.find(d => 
        limparString(d.nome) === nomeLogadoLimpo
      );

      if (correspondente) {
        this.idDentistaLogado = correspondente.id;
      }
    }
  }

 carregarConsultas() {
  this.consultaService.listar().subscribe({
    next: (dados) => {

      console.log('Dados brutos recebidos do backend:', dados);
      console.log('USUÁRIO LOGADO:', this.nomeUsuarioLogado);

      const dadosBrutos = dados || [];

      let consultasFiltradas = dadosBrutos;

      if (
        this.perfilUsuario === 'DENTISTA' &&
        this.nomeUsuarioLogado
      ) {

        const limparNome = (nome: string) =>
          nome
            .replace(/\./g, '')
            .trim()
            .toLowerCase();

        consultasFiltradas = dadosBrutos.filter(
          (consulta: any) =>
            limparNome(consulta.dentista?.nome || '') ===
            limparNome(this.nomeUsuarioLogado)
        );
      }

      this.consultas = consultasFiltradas.map((consulta: any) => {

        if (
          consulta.especialidade?.id &&
          !consulta.especialidade.nome
        ) {

          const correspondente =
            this.especialidades.find(
              e => e.id === Number(consulta.especialidade.id)
            );

          if (correspondente) {
            consulta.especialidade = {
              ...correspondente
            };
          }
        }

        return consulta;
      });

      this.consultas.sort((a: any, b: any) => {
       return (
          new Date(b.dataRegistro).getTime() -
          new Date(a.dataRegistro).getTime()
        );
      });

      this.atualizarIndicadores();
      this.cdr.detectChanges();
    },

    error: (erro) => {
      console.error(
        'Erro de comunicação com o serviço de consultas:',
        erro
      );
    }
  });
}

onDentistaChange() {

  const dentistaSelecionado = this.dentistas.find(
    d => d.id === Number(this.consultaNova.dentista.id)
  );

  if (dentistaSelecionado) {

    this.especialidades =
      dentistaSelecionado.especialidades || [];

    this.consultaNova.especialidade = {
      id: null
    };
  }
}

  abrirFormulario() {
   
    this.consultaNova = {
      descricao: '',
      status: 'AGENDADA',
      dataInicio: '',
      dataFim: '',
      paciente: { id: null },
      dentista: { id: null },
      especialidade: { id: null }
    };

    if (this.ehDentista() && this.idDentistaLogado !== null) {
      this.consultaNova.dentista.id = this.idDentistaLogado;
    }

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
      !this.consultaNova.especialidade?.id ||
      !this.consultaNova.dataInicio
    ) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dadosParaSalvar = {
      ...this.consultaNova,
      paciente: { id: Number(this.consultaNova.paciente.id) },
      dentista: { id: Number(this.consultaNova.dentista.id) },
      especialidade: { id: Number(this.consultaNova.especialidade.id) }
    };

    if (this.consultaNova.id) {
      this.consultaService.atualizar(this.consultaNova.id, dadosParaSalvar).subscribe({
        next: () => { this.carregarConsultas(); this.fecharFormulario(); },
        error: (erro) => console.error('Erro ao atualizar consulta', erro)
      });
    } else {
      this.consultaService.cadastrar(dadosParaSalvar).subscribe({
        next: () => { this.carregarConsultas(); this.fecharFormulario(); },
        error: (erro) => {
          if (erro.error?.message) alert(erro.error.message);
          else alert('Não foi possível salvar a consulta.');
        }
      });
    }
  }

  editarConsulta(consulta: any) {
    // Garante que todas as propriedades existam ao abrir para edição
    this.consultaNova = { 
      ...consulta,
      paciente: consulta.paciente ? { id: consulta.paciente.id } : { id: null },
      dentista: consulta.dentista ? { id: consulta.dentista.id } : { id: null },
      especialidade: consulta.especialidade ? { id: consulta.especialidade.id } : { id: null }
    };

    this.mostrarFormulario = true;
  }

  excluirConsulta(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta consulta?')) return;

    this.consultaService.excluir(id).subscribe({
      next: () => {
        this.consultas = this.consultas.filter(c => c.id !== id);
        this.atualizarIndicadores();
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao excluir consulta', erro)
    });
  }

  atualizarIndicadores() {
    this.totalAgendadas = this.consultas.filter(c => c.status === 'AGENDADA').length;
    this.totalConcluidas = this.consultas.filter(c => c.status === 'CONCLUIDA').length;
    this.totalAtrasadas = this.consultas.filter(c => c.status === 'ATRASADA').length;
    this.totalCanceladas = this.consultas.filter(c => c.status === 'CANCELADA').length;
  }

  calcularFimConsulta(): Date {
    const inicio = new Date(this.consultaNova.dataInicio);
    inicio.setMinutes(inicio.getMinutes() + 15);
    return inicio;
  }
}