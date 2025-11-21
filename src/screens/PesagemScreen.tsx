import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Easing, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const PesagemSchema = Yup.object().shape({
  peso: Yup.number()
    .required('Informe seu peso atual')
    .min(20, 'Peso mínimo: 20kg')
    .max(300, 'Peso máximo: 300kg')
    .typeError('Digite um valor válido (ex: 68.5)'),
});

export default function ModernPesagemScreen() {
  const [pesagens, setPesagens] = useState<{ data: string; peso: number }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    loadPesagens();
  }, []);

  const loadPesagens = async () => {
    try {
      const pesagensStr = await AsyncStorage.getItem('pesagens');
      if (pesagensStr) setPesagens(JSON.parse(pesagensStr));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar pesagens:', error);
    }
  };

  const notifyDashboardPesagens = () => {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('pesagensAtualizadas'));
    }
  };

  const savePesagens = async (arr: { data: string; peso: number }[]) => {
    try {
      await AsyncStorage.setItem('pesagens', JSON.stringify(arr));
      setPesagens(arr);
      notifyDashboardPesagens();
    } catch (error) {
      console.error('Erro ao salvar pesagens:', error);
    }
  };

  const handleDelete = async (index: number) => {
    const newPesagens = pesagens.filter((_, i) => i !== index);
    await savePesagens(newPesagens);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
  };

  const handleUpdate = async (peso: number) => {
    if (editIndex === null) return;
    const updatedPesagens = [...pesagens];
    updatedPesagens[editIndex].peso = peso;
    await savePesagens(updatedPesagens);
    setEditIndex(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Controle de Peso</Text>
        <Text style={styles.headerSubtitle}>Acompanhe sua evolução</Text>
      </LinearGradient>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <Formik
          enableReinitialize
          initialValues={{ peso: editIndex !== null ? String(pesagens[editIndex]?.peso) : '' }}
          validationSchema={PesagemSchema}
          onSubmit={async (values, { resetForm }) => {
            if (editIndex !== null) {
              await handleUpdate(Number(values.peso));
              resetForm();
              return;
            }

            const dataAtual = new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit' 
            });

            const newPesagens = [...pesagens, { data: dataAtual, peso: parseFloat(values.peso) }];
            await savePesagens(newPesagens);

            // Atualiza o peso no perfil do usuário
            const userDataStr = await AsyncStorage.getItem('user');
            if (userDataStr) {
              const userData = JSON.parse(userDataStr);
              userData.peso = values.peso;
              await AsyncStorage.setItem('user', JSON.stringify(userData));
            }

            resetForm();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => (
            <View style={styles.formContent}>
              <View style={styles.inputContainer}>
                <MaterialIcons name="fitness-center" size={24} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Digite seu peso (kg)"
                  placeholderTextColor="#6c757d"
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    touched.peso && errors.peso ? styles.inputError : {},
                    touched.peso && !errors.peso ? styles.inputSuccess : {}
                  ]}
                  onChangeText={handleChange('peso')}
                  onBlur={handleBlur('peso')}
                  value={values.peso}
                />
              </View>
              {touched.peso && errors.peso && (
                <Text style={styles.errorText}>
                  <MaterialIcons name="error" size={14} color={Colors.danger} /> {errors.peso}
                </Text>
              )}

              <View style={styles.buttonGroup}>
                {editIndex !== null ? (
                  <>
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleSubmit as any}
                    >
                      <Text style={styles.buttonText}>Atualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => { setEditIndex(null); resetForm(); }}
                    >
                      <Text style={[styles.buttonText, { color: Colors.darkBg }]}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit as any}
                    disabled={!values.peso}
                  >
                    <LinearGradient
                      colors={values.peso ? [Colors.primary, Colors.secondary] : ['#e9ecef', '#e9ecef']}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.buttonText}>Registrar Peso</Text>
                      <MaterialIcons name="add-circle" size={20} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Formik>
      </View>

      {/* Histórico */}
      <Text style={styles.historyTitle}>Histórico de Pesagens</Text>
      
      {pesagens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="info" size={40} color="#adb5bd" />
          <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
          <Text style={styles.emptySubtext}>Registre seu primeiro peso para começar</Text>
        </View>
      ) : (
        <FlatList
          data={pesagens.slice().reverse()}
          keyExtractor={(_, idx) => idx.toString()}
          style={styles.historyList}
          contentContainerStyle={styles.historyContent}
          renderItem={({ item, index }) => (
            <Animatable.View 
              animation="fadeInUp"
              duration={600}
              delay={index * 100}
              style={styles.historyItem}
            >
              <View style={styles.historyItemContent}>
                <View style={styles.historyIcon}>
                  <MaterialIcons name="scale" size={24} color={Colors.primary} />
                </View>
                <View style={styles.historyTextContainer}>
                  <Text style={styles.historyDate}>{item.data}</Text>
                  <Text style={styles.historyWeight}>{item.peso} kg</Text>
                </View>
              </View>
              
              <View style={styles.historyActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(pesagens.length - 1 - index)}
                  disabled={editIndex !== null}
                >
                  <MaterialIcons name="edit" size={20} color={Colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(pesagens.length - 1 - index)}
                  disabled={editIndex !== null}
                >
                  <MaterialIcons name="delete" size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </Animatable.View>
          )}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
  },
  formContent: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 16,
    backgroundColor: Colors.lightBg,
    fontSize: 16,
    color: Colors.darkBg,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#fff5f5',
  },
  inputSuccess: {
    borderColor: Colors.success,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  submitButton: {
    flex: 1,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: Colors.success,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkBg,
    marginTop: 30,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#adb5bd',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ced4da',
    marginTop: 4,
  },
  historyList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  historyContent: {
    paddingBottom: 40,
  },
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  historyWeight: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkBg,
    marginTop: 2,
  },
  historyActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
