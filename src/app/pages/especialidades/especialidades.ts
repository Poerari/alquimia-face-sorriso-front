import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Especialidade } from '../../models/especialidade';
import { EspecialidadeService } from '../../services/especialidade';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css'
})
export class Especialidades implements OnInit {

  especialidades: Especialidade[] = [];

  mostrarFormulario = false;

  modoEdicao = false;

  especialidadeNova: any = {
    nome: ''
  };

  constructor(
    private especialidadeService: EspecialidadeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarEspecialidades();
  }

  carregarEspecialidades() {

    this.especialidadeService.listar().subscribe({

      next: (dados) => {

        this.especialidades = dados;

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error(
          'Erro ao carregar especialidades',
          erro
        );

      }

    });

  }

  abrirFormulario() {

    this.modoEdicao = false;

    this.especialidadeNova = {
      nome: ''
    };

    this.mostrarFormulario = true;

  }

  fecharFormulario() {

    this.mostrarFormulario = false;

  }

  editarEspecialidade(especialidade: Especialidade) {

    this.modoEdicao = true;

    this.especialidadeNova = {
      ...especialidade
    };

    this.mostrarFormulario = true;

  }

  salvarEspecialidade() {

    if (!this.especialidadeNova.nome) {

      alert('Informe o nome da especialidade.');

      return;

    }

    if (this.modoEdicao) {

      this.especialidadeService
        .atualizar(
          this.especialidadeNova.id,
          this.especialidadeNova
        )
        .subscribe({

          next: (especialidadeAtualizada) => {

            const index =
              this.especialidades.findIndex(

                e =>
                  e.id ===
                  especialidadeAtualizada.id

              );

            if (index !== -1) {

              this.especialidades[index] =
                especialidadeAtualizada;

            }

            this.fecharFormulario();

            this.cdr.detectChanges();

          }

        });

    } else {

      this.especialidadeService
        .cadastrar(this.especialidadeNova)
        .subscribe({

          next: (novaEspecialidade) => {

            this.especialidades.push(
              novaEspecialidade
            );

            this.fecharFormulario();

            this.cdr.detectChanges();

          }

        });

    }

  }

}