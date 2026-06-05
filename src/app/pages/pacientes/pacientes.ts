import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Paciente } from '../../models/paciente';
import { PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class Pacientes implements OnInit {

  pacientes: Paciente[] = [];

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.pacienteService.listar().subscribe({
      next: (dados) => {
        this.pacientes = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar pacientes', erro);
      }
    });
  }
}