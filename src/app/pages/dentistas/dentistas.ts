import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Dentista } from '../../models/dentista';
import { DentistaService } from '../../services/dentista';

@Component({
  selector: 'app-dentistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dentistas.html',
  styleUrl: './dentistas.css',
})
export class Dentistas implements OnInit {

  dentistas: Dentista[] = [];

  mostrarFormulario = false;
  modoEdicao = false;

  dentistaNovo: any = {
    nome: '',
    cpf: '',
    cro: '',
    email: '',
    ativo: true
  };

  constructor(
    private dentistaService: DentistaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDentistas();
  }

  carregarDentistas() {

    this.dentistaService.listar().subscribe({

      next: (dados) => {

        this.dentistas = dados;
        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao carregar dentistas',
          erro
        );

      }

    });

  }

  abrirFormulario() {

  this.modoEdicao = false;

  this.dentistaNovo = {
    nome: '',
    cpf: '',
    cro: '',
    email: '',
    ativo: true
  };

  this.mostrarFormulario = true;

}
  fecharFormulario() {

    this.mostrarFormulario = false;

  }

  editarDentista(dentista: Dentista) {

  this.modoEdicao = true;

  this.dentistaNovo = {
    ...dentista
  };

  this.mostrarFormulario = true;

}

salvarDentista() {

  if (
    !this.dentistaNovo.nome ||
    !this.dentistaNovo.cpf ||
    !this.dentistaNovo.cro
  ) {

    alert('Preencha os campos obrigatórios.');
    return;

  }

  if (this.modoEdicao) {

    this.dentistaService
      .atualizar(
        this.dentistaNovo.id,
        this.dentistaNovo
      )
      .subscribe({

        next: (dentistaAtualizado) => {

          const index = this.dentistas.findIndex(
            d => d.id === dentistaAtualizado.id
          );

          if (index !== -1) {
            this.dentistas[index] = dentistaAtualizado;
          }

          this.fecharFormulario();

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error(
            'Erro ao atualizar dentista',
            erro
          );

        }

      });

  } else {

    this.dentistaService
      .cadastrar(this.dentistaNovo)
      .subscribe({

        next: (novoDentista) => {

          this.dentistas.push(novoDentista);

          this.fecharFormulario();

          this.dentistaNovo = {
            nome: '',
            cpf: '',
            cro: '',
            email: '',
            ativo: true
          };

          this.cdr.detectChanges();

        },

        error: (erro) => {

          console.error(
            'Erro ao cadastrar dentista',
            erro
          );

        }

      });

  }

}
}  