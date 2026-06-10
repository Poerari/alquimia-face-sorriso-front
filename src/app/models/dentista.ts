import { Especialidade } from './especialidade';
export interface Dentista {
  id: number;
  nome: string;
  cpf: string;
  cro: string;
  email: string;
  ativo: boolean;
  especialidades?: Especialidade[];
}