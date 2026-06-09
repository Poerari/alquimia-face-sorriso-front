export interface Consulta {
    id: number;
    descricao: string;
    status: string;
    dataInicio: string;
    dataFim: string;

  paciente: {
    id: number;
    nome: string;
};

dentista: {
  id: number;
  nome: string;
};
}

 
