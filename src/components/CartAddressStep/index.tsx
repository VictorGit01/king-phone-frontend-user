import { useContext, useEffect, useMemo, useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../../contexts/CartContext";
import { ValueContext } from "../../contexts/ValueContext";
import { Address, EMPTY_ADDRESS } from "../../types/address";
import { formatWhatsApp, limitWhatsAppDigits } from "../../utils/formatWhatsApp";
import { loadFromStorage, saveToStorage } from "../../utils/storage";

const ADDRESS_STORAGE_KEY = "kingphone:address:v1";
const ORDER_PLACED_FLAG_KEY = "kingphone:orderPlaced";

type Props = {
  onBack: () => void;
  whatsappUrl: string;
  onOrderPlaced?: () => void;
};

export const CartAddressStep = ({ onBack, whatsappUrl, onOrderPlaced }: Props) => {
  const { total, originalTotal, discount, appliedPromotion, placeOrder } = useContext(CartContext);
  const { formattedPrice } = useContext(ValueContext);
  const navigate = useNavigate();


  const [address, setAddress] = useState<Address>(() => {
    const stored = loadFromStorage<Partial<Address>>(ADDRESS_STORAGE_KEY);
    const merged = { ...EMPTY_ADDRESS, ...(stored ?? {}) } as Address;

    // Migração: versões antigas tinham street/number, mas não addressLine
    if (!merged.addressLine?.trim()) {
      const legacyLine = [merged.street?.trim(), merged.number?.trim()].filter(Boolean).join(", ");
      if (legacyLine) merged.addressLine = legacyLine;
    }

    return merged;
  });

  useEffect(() => {
    saveToStorage(ADDRESS_STORAGE_KEY, address);
  }, [address]);

  const isValid = useMemo(() => {
    // MVP: exigir só o essencial
    return (
      Boolean(address.fullName.trim()) &&
  Boolean(address.addressLine.trim()) &&
  Boolean(address.number.trim()) &&
      Boolean(address.city.trim()) &&
      Boolean(address.state.trim())
    );
  }, [address]);

  const addressTextForWhatsapp = useMemo(() => {
    const lines: string[] = [];

    lines.push("\n\n*ENDEREÇO PARA ENTREGA*");

    if (address.fullName.trim()) lines.push(`- Nome: ${address.fullName.trim()}`);
  if (address.phone.trim()) lines.push(`- WhatsApp: ${address.phone.trim()}`);

  lines.push(`- Endereço: ${address.addressLine.trim()}`);
  if (address.number.trim()) lines.push(`- Número: ${address.number.trim()}`);

    if (address.city.trim()) lines.push(`- Cidade: ${address.city.trim()}`);
    if (address.state.trim()) lines.push(`- UF: ${address.state.trim()}`);
    if (address.complement.trim()) lines.push(`- Complemento: ${address.complement.trim()}`);
    if (address.reference.trim()) lines.push(`- Referência: ${address.reference.trim()}`);

    return lines.join("\n");
  }, [address]);

  const finalWhatsappUrl = useMemo(() => {
    // whatsappUrl já vem com ?text=...; vamos anexar o endereço no final do texto
    try {
      const url = new URL(whatsappUrl);
      const currentText = url.searchParams.get("text") ?? "";
      url.searchParams.set("text", `${currentText}${addressTextForWhatsapp}`);
      return url.toString();
    } catch {
      // fallback: se por algum motivo falhar o parse, não quebra o fluxo
      return whatsappUrl;
    }
  }, [whatsappUrl, addressTextForWhatsapp]);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnlyLimited = limitWhatsAppDigits(inputValue, 11);
    const formattedValue = formatWhatsApp(digitsOnlyLimited);
    setAddress((a) => ({ ...a, phone: formattedValue.trim() }));
  };

  const handleSendViaWhatsapp = () => {
    // 1) Abre WhatsApp em nova aba
    window.open(finalWhatsappUrl, "_blank", "noreferrer");
    // 2) Limpa e fecha carrinho
    placeOrder();
  // 3) Sinaliza para a Home exibir o modal de sucesso aps o redirect
  sessionStorage.setItem(ORDER_PLACED_FLAG_KEY, "1");
  // 4) Volta pro topo antes do redirect (e evita ficar no meio da pgina)
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  // 4) Volta pra home
  navigate("/");

  // 5) Reseta estado do carrinho (step) no componente pai, se fornecido
  onOrderPlaced?.();
  };

  return (
    <div className="w-full h-full flex flex-col text-white">
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-white/80 hover:text-white flex items-center gap-2"
          type="button"
        >
          <IoArrowBack /> Voltar
        </button>
        <div className="text-sm text-white/60">Entrega</div>
      </div>

      <div className="px-6 pb-6 overflow-y-auto no-scrollbar flex-grow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Nome *</label>
            <input
              className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
              value={address.fullName}
              onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">WhatsApp (opcional)</label>
            <input
              className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
              value={address.phone}
              onChange={handleWhatsappChange}
              placeholder="(xx) xxxxx-xxxx"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Endereço *</label>
            <input
              className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
              value={address.addressLine}
              onChange={(e) => setAddress((a) => ({ ...a, addressLine: e.target.value }))}
              placeholder="Ex: Setor Norte, Conjunto B, Quadra 4"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Número *</label>
            <input
              className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
              value={address.number}
              onChange={(e) => setAddress((a) => ({ ...a, number: e.target.value }))}
              placeholder="Ex: 10"
            />
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
        <label className="block text-sm text-white/70 mb-1">Cidade *</label>
              <input
                className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
                value={address.city}
                onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                placeholder="Ex: Brasília"
              />
            </div>
            <div>
        <label className="block text-sm text-white/70 mb-1">UF *</label>
              <input
                className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
                value={address.state}
                onChange={(e) =>
                  setAddress((a) => ({
                    ...a,
                    state: e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2),
                  }))
                }
                placeholder="Ex: DF"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Complemento (opcional)</label>
            <input
              className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
              value={address.complement}
              onChange={(e) => setAddress((a) => ({ ...a, complement: e.target.value }))}
              placeholder="Apto, bloco, etc."
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Ponto de referência (opcional)</label>
            <input
              className="w-full rounded-md bg-[#151719] border border-white/10 px-3 py-2 outline-none focus:border-accent"
              value={address.reference}
              onChange={(e) => setAddress((a) => ({ ...a, reference: e.target.value }))}
              placeholder="Ex: Próximo ao mercado..."
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="pt-4 pb-5 flex flex-col">
          <div className="flex justify-between text-sm text-white/70">
            <div>Subtotal</div>
            <div>{formattedPrice(originalTotal)}</div>
          </div>
          {appliedPromotion && discount > 0 && (
            <div className="flex justify-between text-sm text-green-400 mt-1">
              <div>{appliedPromotion}</div>
              <div>-{formattedPrice(discount)}</div>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold mt-2">
            <div>Total</div>
            <div>{formattedPrice(total)}</div>
          </div>
        </div>

        <button
          type="button"
          className={`button button-accent hover:bg-accent-hover text-primary flex-1 px-2 gap-x-2 flex items-center justify-center ${
            !isValid ? "opacity-60 pointer-events-none" : ""
          }`}
          onClick={handleSendViaWhatsapp}
          title={!isValid ? "Preencha os campos obrigatórios para continuar" : "Enviar pedido via WhatsApp"}
        >
          Enviar via WhatsApp
          <IoArrowForward className="text-lg" />
        </button>

        {!isValid && (
          <div className="text-xs text-white/60 mt-2">
            Preencha os campos obrigatórios: *Nome*, *Endereço*, *Número*, *Cidade* e *UF*.
          </div>
        )}
      </div>
    </div>
  );
};
