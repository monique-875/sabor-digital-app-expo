import React, { createContext, useContext, useState } from 'react';

const ContextoCarrinho = createContext(null);
export const useCarrinho = () => useContext(ContextoCarrinho);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]); // [{ produto, quantidade }]

  const adicionar = (produto, quantidade = 1) =>
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.produto.id === produto.id);
      if (itemExistente) return itensAtuais.map((item) => (item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item));
      return [...itensAtuais, { produto, quantidade }];
    });

  const alterarQuantidade = (id, quantidade) =>
    setItens((itensAtuais) =>
      quantidade <= 0
        ? itensAtuais.filter((item) => item.produto.id !== id)
        : itensAtuais.map((item) => (item.produto.id === id ? { ...item, quantidade } : item))
    );

  const limpar = () => setItens([]);
  const quantidadeItens = itens.reduce((total, item) => total + item.quantidade, 0);
  // Estimativa só para exibição: o total oficial é calculado pela API.
  const totalEstimado = itens.reduce((total, item) => total + Number(item.produto.preco || 0) * item.quantidade, 0);

  return (
    <ContextoCarrinho.Provider value={{ itens, adicionar, alterarQuantidade, limpar, quantidadeItens, totalEstimado }}>
      {children}
    </ContextoCarrinho.Provider>
  );
}
