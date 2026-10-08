import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Carrega dados sempre que a tela ganha foco (volta de um formulário, por exemplo).
export function useCarregarDados(buscarDados, dependencias = []) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async (atualizar = false) => {
    if (atualizar) setAtualizando(true);
    setErro(null);
    try {
      setDados(await buscarDados());
    } catch (erroCapturado) {
      setErro(erroCapturado.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  return {
    dados,
    carregando,
    erro,
    atualizando,
    carregarNovamente: () => carregar(true),
  };
}
