export interface Pedido {
  id?: number;
  id_cliente: number;
  data_hora?: Date | string; 
  valor_total: number;
  forma_pagto: 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Pix' | string;
  status: 'Pendente' | 'Finalizado' | 'Cancelado' | string;
  forma_entrega: 'Enviar' | 'Retirar na loja' | string;
  frete: number;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}