import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class Consultas implements OnInit {

  consultas: Consulta[] = [];

  constructor(
    private consultaService: ConsultaService,
    private cdr: ChangeDetectorRef // 1. Injetamos o detector de mudanças
  ) {}

  ngOnInit(): void {
    console.log('ConsultasComponent iniciado');

    this.consultaService.listar().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);
        this.consultas = dados;
        
        // 2. Forçamos o Angular a renderizar a tabela com os novos dados
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('Erro ao carregar consultas', erro);
      }
    });
  }
}