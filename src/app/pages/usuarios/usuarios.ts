import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { DentistaService } from '../../services/dentista';
import { Dentista } from '../../models/dentista';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  dentistas: Dentista[] = [];
  usuarioNovo: Usuario = this.inicializarUsuario();
  mostrarFormulario: boolean = false;
  isEditando: boolean = false;
  totalUsuarios: number = 0;

  constructor(
    private usuarioService: UsuarioService, 
    private dentistaService: DentistaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
    this.carregarDentistas();
  }

  carregarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.totalUsuarios = dados.length;
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('Erro ao carregar usuários:', erro);
      }
    });
  }

  carregarDentistas(): void {
    this.dentistaService.listar().subscribe({
      next: (dados) => {
        this.dentistas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar lista de dentistas:', erro);
      }
    });
  }

  // Puxa e autocompleta os dados do dentista selecionado na lista
  selecionarDentista(event: any): void {
    const idSelecionado = event.target.value;
    if (!idSelecionado) return;

    const dr = this.dentistas.find(d => d.id === Number(idSelecionado));
    if (dr) {
      this.usuarioNovo.nome = dr.nome;
      this.usuarioNovo.email = dr.email;
      this.usuarioNovo.perfil = 'DENTISTA';
      
      if (dr.cpf) {
        this.usuarioNovo.cpf = this.aplicarMascaraCpfString(dr.cpf);
      }
    }
  }

  // Máscara dinâmica durante a digitação do campo CPF
  formatarCpfInput(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.usuarioNovo.cpf = valor;
  }

  // Formata strings de CPFs puros vindos do banco para apresentar na listagem da tabela
  formatarCpfExibicao(cpf?: string): string {
    if (!cpf) return '';
    let valor = cpf.replace(/\D/g, '');
    if (valor.length === 11) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  aplicarMascaraCpfString(cpf: string): string {
    let valor = cpf.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return valor;
  }

  inicializarUsuario(): Usuario {
    return {
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      perfil: 'ADMIN', 
      ativo: true
    };
  }

  abrirFormulario(): void {
    this.isEditando = false;
    this.usuarioNovo = this.inicializarUsuario();
    this.mostrarFormulario = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.isEditando = true;

    this.usuarioNovo = { 
      ...usuario,
      ativo: usuario.ativo ?? true 
    }; 
    
    if (this.usuarioNovo.cpf) {
      this.usuarioNovo.cpf = this.aplicarMascaraCpfString(this.usuarioNovo.cpf);
    }
    
    this.mostrarFormulario = true;
    this.cdr.detectChanges(); 
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.usuarioNovo = this.inicializarUsuario();
  }

  excluirUsuario(id?: number): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluir(id).subscribe({
        next: () => {
          console.log('Usuário excluído com sucesso');
          this.carregarUsuarios();
        },
        error: (erro) => {
          console.error('Erro ao excluir usuário:', erro);
          alert('Erro ao excluir usuário no backend.');
        }
      });
    }
  }

  salvarUsuario(): void {
    if (!this.usuarioNovo.nome || !this.usuarioNovo.cpf || !this.usuarioNovo.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Limpa a máscara do CPF antes de despachar o objeto para salvar limpo no backend
    const dadosParaSalvar = {
      ...this.usuarioNovo,
      cpf: this.usuarioNovo.cpf.replace(/\D/g, '')
    };

    console.log('=== OBJETO ENVIADO PELO ANGULAR ===', dadosParaSalvar);

    if (this.isEditando && dadosParaSalvar.id) {
      this.usuarioService.atualizar(dadosParaSalvar.id, dadosParaSalvar).subscribe({
        next: (resposta) => {
          console.log('Usuário atualizado com sucesso:', resposta);
          this.carregarUsuarios();
          this.fecharFormulario();
        },
        error: (erro) => {
          console.error('Erro no PUT:', erro);
          alert('Erro ao atualizar usuário.');
        }
      });
    } else {
      this.usuarioService.cadastrar(dadosParaSalvar).subscribe({
        next: (resposta) => {
          console.log('Usuário cadastrado com sucesso:', resposta);
          this.carregarUsuarios();
          this.fecharFormulario();
        },
        error: (erro) => {
          console.error('Erro no POST:', erro);
          alert('Erro ao salvar usuário.');
        }
      });
    }
  }
}