import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  usuarioNovo: Usuario = this.inicializarUsuario();
  mostrarFormulario: boolean = false;
  isEditando: boolean = false;
  totalUsuarios: number = 0;

  constructor(
      private usuarioService: UsuarioService, 
      private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
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
    ativo: usuario.ativo ?? false 
  }; 
  
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

    console.log('=== OBJETO ENVIADO PELO ANGULAR ===', this.usuarioNovo);

    if (this.isEditando && this.usuarioNovo.id) {
      this.usuarioService.atualizar(this.usuarioNovo.id, this.usuarioNovo).subscribe({
        next: (resposta) => {
          console.log('Usuário atualizado com sucesso:', resposta);
          this.carregarUsuarios();
          this.fecharFormulario();
        },
        error: (erro) => {
          console.error('Erro no PUT:', erro);
          alert('Erro 500 ao atualizar. Verifique o console do Spring Boot.');
        }
      });
    } else {
      this.usuarioService.cadastrar(this.usuarioNovo).subscribe({
        next: (resposta) => {
          console.log('Usuário cadastrado com sucesso:', resposta);
          this.carregarUsuarios();
          this.fecharFormulario();
        },
        error: (erro) => {
          console.error('Erro no POST:', erro);
          alert('Erro 500 ao salvar. Verifique o console do Spring Boot.');
        }
      });
    }
  }
}