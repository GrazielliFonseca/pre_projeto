export interface Cliente {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  data_nasc: string;
  id_categoria: number;
  perfil_estilo?: string;
  total_gasto?: number;
}