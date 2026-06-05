export interface Consulta {
    id: number;
    descricao: string;
    status: string;
    dataInicio: string;
    dataFim: string;

    paciente: {
    nome: string;
  };

  dentista: {
    nome: string;
  };
}

 
