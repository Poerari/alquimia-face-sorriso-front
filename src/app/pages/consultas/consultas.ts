import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Consulta } from '../../models/consulta';
import { ConsultaService } from '../../services/consulta';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css'
})
export class ConsultasComponent implements OnInit {

  consultas: Consulta[] = [];

  constructor(private consultaService: ConsultaService) {}

  ngOnInit(): void {
    this.consultaService.listar().subscribe({
      next: (dados) => {
        this.consultas = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar consultas', erro);
      }
    });
  }
}