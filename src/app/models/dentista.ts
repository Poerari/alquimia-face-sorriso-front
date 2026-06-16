import { Especialidade } from './especialidade';
export interface Dentista {
  id: number;
  nome: string;
  cpf: string;
  cro: string;
  email: string;
  ativo: boolean;
  especialidades?: Array<{ id: number; nome: string }>;
}