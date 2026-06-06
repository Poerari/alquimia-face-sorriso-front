import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaService } from '../../services/consulta';
import { PacienteService } from '../../services/paciente';
import { DentistaService } from '../../services/dentista';
import { EspecialidadeService } from '../../services/especialidade';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  totalConsultas = 0;
  totalPacientes = 0;
  totalDentistas = 0;
  totalEspecialidades = 0;

  consultasRecentes: any[] = [];

  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private dentistaService: DentistaService,
    private especialidadeService: EspecialidadeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.consultaService.listar().subscribe(dados => {
      console.log('CONSULTAS DO DASHBOARD', dados); 
      this.totalConsultas = dados.length;
      this.consultasRecentes = dados.slice(0, 5);
      this.cdr.detectChanges();
    });

    this.pacienteService.listar().subscribe(dados => {
      this.totalPacientes = dados.length;
      this.cdr.detectChanges();
    });

    this.dentistaService.listar().subscribe(dados => {
      this.totalDentistas = dados.length;
      this.cdr.detectChanges();
    });

    this.especialidadeService.listar().subscribe(dados => {
      this.totalEspecialidades = dados.length;
      this.cdr.detectChanges();
    });

  }

}