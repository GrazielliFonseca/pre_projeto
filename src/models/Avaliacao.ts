export interface Avaliacao {
  id?: number;
  id_cliente: number;
  id_produto: number;
  estrelas: number;
  descricao: string;
  data_avaliacao?: Date;
}