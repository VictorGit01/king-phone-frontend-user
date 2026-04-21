export type Address = {
  fullName: string;
  phone: string;
  /**
   * Linha livre do endereço (ex.: "Setor Sul, Conjunto C, Quadra 9, Lote 9").
   * Usado principalmente para cidades onde o formato não é "rua + número" clássico.
   */
  addressLine: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  reference: string;
  city: string;
  state: string;
};

export const EMPTY_ADDRESS: Address = {
  fullName: "",
  phone: "",
  addressLine: "",
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  reference: "",
  city: "",
  state: "",
};
