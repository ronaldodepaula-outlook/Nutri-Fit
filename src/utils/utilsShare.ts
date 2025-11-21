// Função mock para compartilhar arquivo
import * as Sharing from 'expo-sharing';

export async function compartilharArquivo(fileUri: string): Promise<void> {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}
