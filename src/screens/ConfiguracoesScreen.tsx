import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
// @ts-ignore
import { exportarDadosCSV, realizarBackup, resetarDados } from '../utils/utilsBackup';
// @ts-ignore
import { compartilharArquivo } from '../utils/utilsShare';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfiguracoesScreen() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handleExportarCSV = async () => {
    setLoading(true);
    try {
      const fileUri = await exportarDadosCSV();
      setInfo('Arquivo CSV exportado com sucesso!');
      Alert.alert('Exportação CSV', 'Arquivo salvo em: ' + fileUri, [
        { text: 'Compartilhar', onPress: () => compartilharArquivo(fileUri) },
        { text: 'Abrir', onPress: () => Linking.openURL(fileUri) },
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao exportar CSV.');
    }
    setLoading(false);
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const fileUri = await realizarBackup();
      setInfo('Backup realizado com sucesso!');
      Alert.alert('Backup', 'Backup salvo em: ' + fileUri, [
        { text: 'Compartilhar', onPress: () => compartilharArquivo(fileUri) },
        { text: 'Abrir', onPress: () => Linking.openURL(fileUri) },
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao realizar backup.');
    }
    setLoading(false);
  };

  const handleResetar = async () => {
    Alert.alert(
      'Resetar dados',
      'Tem certeza que deseja apagar TODOS os dados do app?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await resetarDados();
            setInfo('Todos os dados foram apagados.');
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4361ee', '#3f37c9']} style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
        <Text style={styles.headerSubtitle}>Gerencie seus dados e preferências</Text>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" duration={800} style={styles.content}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleExportarCSV}
          disabled={loading}
        >
          <View style={styles.optionIconContainer}>
            <FontAwesome5 name="file-csv" size={24} color="#4cc9f0" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Exportar Dados em CSV</Text>
            <Text style={styles.optionDescription}>Salve seus registros em formato CSV.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleBackup}
          disabled={loading}
        >
          <View style={styles.optionIconContainer}>
            <MaterialIcons name="backup" size={24} color="#4cc9f0" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Backup de todas as bases</Text>
            <Text style={styles.optionDescription}>Crie um backup completo dos seus dados.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.dangerOption]}
          onPress={handleResetar}
          disabled={loading}
        >
          <View style={styles.optionIconContainer}>
            <MaterialIcons name="delete" size={24} color="#f72585" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Resetar todos os dados</Text>
            <Text style={styles.optionDescription}>Apaga permanentemente todos os dados do app.</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Informações do sistema</Text>
          <Text style={styles.infoText}>
            Versão: 1.0.0{info ? `\n${info}` : ''}
          </Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#4cc9f0" style={{ marginTop: 20 }} />}
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerOption: {
    borderColor: '#f72585',
    borderWidth: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
  },
  optionTextContainer: {},
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
});
