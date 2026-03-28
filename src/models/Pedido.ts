export interface Pedido {
  id?: number;
  id_cliente: number;
  data_hora?: Date | string; 
  valor_total: number;
  forma_pagto: 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Pix';
  status: 'Pendente' | 'Finalizado' | 'Cancelado';
  forma_entrega: 'Enviar' | 'Retirar na loja';
  frete: number;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}