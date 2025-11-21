import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { selecionarAnexo } from '../utils/utilsAnexo';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

interface Nutricionista {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  recomendacoes: string[];
  anexos: { uri: string; name: string; type: string }[];
}

export default function NutricionistaScreen() {
  const [nutricionistas, setNutricionistas] = useState<Nutricionista[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [selectedNutri, setSelectedNutri] = useState<Nutricionista | null>(null);
  const [novaRecomendacao, setNovaRecomendacao] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('nutricionistas').then((data) => {
      if (data) setNutricionistas(JSON.parse(data));
    });
  }, []);

  const salvarNutricionistas = async (list: Nutricionista[]) => {
    setNutricionistas(list);
    await AsyncStorage.setItem('nutricionistas', JSON.stringify(list));
  };

  const adicionarNutricionista = () => {
    if (!novoNome) return;
    const novo: Nutricionista = {
      id: Date.now().toString(),
      nome: novoNome,
      email: novoEmail,
      telefone: novoTelefone,
      recomendacoes: [],
      anexos: [],
    };
    const lista = [...nutricionistas, novo];
    salvarNutricionistas(lista);
    setNovoNome('');
    setNovoEmail('');
    setNovoTelefone('');
    setModalVisible(false);
    Alert.alert('Sucesso', 'Nutricionista cadastrado!');
  };

  const adicionarRecomendacao = () => {
    if (!selectedNutri || !novaRecomendacao) return;
    const lista = nutricionistas.map((n) =>
      n.id === selectedNutri.id
        ? { ...n, recomendacoes: [...n.recomendacoes, novaRecomendacao] }
        : n
    );
    salvarNutricionistas(lista);
    setSelectedNutri({ ...selectedNutri, recomendacoes: [...selectedNutri.recomendacoes, novaRecomendacao] });
    setNovaRecomendacao('');
    Alert.alert('Sucesso', 'Recomendação adicionada!');
  };

  const anexarArquivo = async () => {
    if (!selectedNutri) return;
    try {
      const anexo = await selecionarAnexo();
      if (anexo) {
        const lista = nutricionistas.map((n) =>
          n.id === selectedNutri.id
            ? { ...n, anexos: [...n.anexos, anexo] }
            : n
        );
        salvarNutricionistas(lista);
        setSelectedNutri({ ...selectedNutri, anexos: [...selectedNutri.anexos, anexo] });
        Alert.alert('Sucesso', 'Arquivo anexado!');
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao anexar arquivo.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4361ee', '#3f37c9']} style={styles.header}>
        <Text style={styles.headerTitle}>Área do Nutricionista</Text>
        <Text style={styles.headerSubtitle}>Gerencie seus profissionais e recomendações</Text>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" duration={800} style={styles.content}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="plus-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}> Cadastrar Nutricionista</Text>
        </TouchableOpacity>

        <FlatList
          data={nutricionistas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animatable.View animation="fadeInLeft" duration={600}>
              <TouchableOpacity style={styles.card} onPress={() => setSelectedNutri(item)}>
                <FontAwesome5 name="user-md" size={24} color="#4cc9f0" />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardText}>{item.email} | {item.telefone}</Text>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-alt" size={48} color="#ccc" />
              <Text style={styles.emptyListText}>Nenhum nutricionista cadastrado.</Text>
            </View>
          }
        />

        {/* Modal - Cadastro */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalBg} pointerEvents="box-none">
            <Animatable.View animation="zoomIn" duration={400} style={styles.modalContent} pointerEvents="auto">
              <Text style={styles.modalTitle}>Novo Nutricionista</Text>
              <TextInput placeholder="Nome" style={styles.input} value={novoNome} onChangeText={setNovoNome} />
              <TextInput placeholder="E-mail" style={styles.input} value={novoEmail} onChangeText={setNovoEmail} />
              <TextInput placeholder="Telefone" style={styles.input} value={novoTelefone} onChangeText={setNovoTelefone} />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalBtnPrimary} onPress={adicionarNutricionista}>
                  <Text style={styles.modalBtnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setModalVisible(false)}>
                  <Text style={[styles.modalBtnText, { color: '#333' }]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </Modal>

        {/* Modal - Detalhes */}
        <Modal visible={!!selectedNutri} animationType="slide" transparent>
          <View style={[styles.modalBg, { justifyContent: 'center', alignItems: 'center' }]}> 
            <Animatable.View animation="zoomIn" duration={400} style={[styles.modalContent, { elevation: 10, zIndex: 10 }]}> 
              <Text style={styles.modalTitle}>{selectedNutri?.nome}</Text>
              <Text style={styles.cardText}>{selectedNutri?.email} | {selectedNutri?.telefone}</Text>

              <Text style={styles.sectionTitle}>Recomendações</Text>
              <FlatList
                data={selectedNutri?.recomendacoes}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <MaterialIcons name="check-circle" size={18} color="#4cc9f0" />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma recomendação.</Text>}
              />

              <TextInput
                placeholder="Nova recomendação"
                style={styles.input}
                value={novaRecomendacao}
                onChangeText={setNovaRecomendacao}
              />
              <View style={{ marginTop: 16 }}>
                <View style={[styles.buttonCard, { marginBottom: 14 }]}> 
                  <TouchableOpacity style={[styles.modalBtnPrimary, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 10, minHeight: 48 }]} onPress={adicionarRecomendacao}>
                    <MaterialIcons name="add-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={[styles.modalBtnText, { fontSize: 16, flexShrink: 1, flexWrap: 'wrap' }]}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.buttonCard, { marginBottom: 14 }]}> 
                  <TouchableOpacity style={[styles.modalBtnSecondary, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 10, minHeight: 48 }]} onPress={anexarArquivo}>
                    <MaterialIcons name="attach-file" size={20} color="#3f37c9" style={{ marginRight: 10 }} />
                    <Text style={[styles.modalBtnTextSecondary, { color: '#3f37c9', fontSize: 16, flexShrink: 1, flexWrap: 'wrap' }]}>Anexar</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonCard}> 
                  <TouchableOpacity style={[styles.modalBtnSecondary, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 10, minHeight: 48 }]} onPress={() => setSelectedNutri(null)}>
                    <MaterialIcons name="close" size={20} color="#f72585" style={{ marginRight: 10 }} />
                    <Text style={[styles.modalBtnTextSecondary, { color: '#f72585', fontSize: 16, flexShrink: 1, flexWrap: 'wrap' }]}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Anexos</Text>
              <FlatList
                data={selectedNutri?.anexos}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <MaterialIcons name="attach-file" size={18} color="#4cc9f0" />
                    <Text style={styles.listText}>{item.name}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum anexo.</Text>}
              />
              
            </Animatable.View>
          </View>
        </Modal>
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
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#3f37c9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  cardInfo: {
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyListText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalBtnPrimary: {
    flex: 1,
    backgroundColor: '#3f37c9',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 140,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  modalBtnSecondary: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 140,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textShadowColor: '#222',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  modalBtnTextSecondary: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  buttonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: 'stretch',
    minWidth: 0,
    maxWidth: '100%',
  },
});
