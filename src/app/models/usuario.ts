export interface Usuario {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  perfil: 'ADMIN' | 'RECEPCIONISTA' | 'DENTISTA'; // Definição estrita dos perfis do sistema
  ativo: boolean;
  dataCriacao?: string;
  ultimoLogin?: string;
}