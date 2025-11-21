// Função mock para selecionar anexo (arquivo)
export async function selecionarAnexo(): Promise<{ uri: string; name: string; type: string } | null> {
  // Simula seleção de arquivo
  return {
    uri: 'file:///mock/anexo.pdf',
    name: 'anexo.pdf',
    type: 'application/pdf',
  };
}
