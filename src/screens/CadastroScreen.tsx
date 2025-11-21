import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const CadastroSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Por favor, insira seu nome completo')
    .min(3, 'Nome muito curto')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Apenas letras são permitidas'),
  idade: Yup.number()
    .required('Por favor, informe sua idade')
    .min(12, 'Idade mínima: 12 anos')
    .max(120, 'Idade máxima: 120 anos')
    .typeError('Digite um número válido'),
  genero: Yup.string()
    .required('Por favor, selecione seu gênero'),
  altura: Yup.number()
    .required('Por favor, informe sua altura')
    .min(0.5, 'Altura mínima: 0.5m')
    .max(2.5, 'Altura máxima: 2.5m')
    .typeError('Digite um valor válido (ex: 1.75)'),
  peso: Yup.number()
    .required('Por favor, informe seu peso')
    .min(20, 'Peso mínimo: 20kg')
    .max(300, 'Peso máximo: 300kg')
    .typeError('Digite um valor válido (ex: 68.5)'),
  estado: Yup.string().required('Por favor, selecione seu perfil de atividade'),
  hasComorbidities: Yup.boolean(),
  comorbidades: Yup.array().of(Yup.string()).when('hasComorbidities', {
    is: (val: any) => val === true,
    then: (schema: any) => schema.test('other-or-list', 'Selecione ao menos uma comorbidade ou descreva em "Outro"', function (this: any, value: any) {
      const other = this.parent?.comorbidadeOutros;
      if (Array.isArray(value) && value.length > 0) return true;
      if (other && String(other).trim().length > 2) return true;
      return false;
    })
  }),
  comorbidadeOutros: Yup.string(),
});

const colors = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  accent: '#4895ef',
  light: '#f8f9fa',
  dark: '#212529',
  success: '#4cc9f0',
  danger: '#f72585',
  warning: '#f8961e',
  info: '#577590',
};

const commonComorbidities = [
  'Diabetes',
  'Hipertensão',
  'Doença cardíaca',
  'Asma',
  'Doença renal',
  'Outros'
];

export default function CadastroScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [initialValues, setInitialValues] = useState({ nome: '', idade: '', genero: '', altura: '', peso: '', estado: '', hasComorbidities: false, comorbidades: [] as string[], comorbidadeOutros: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
          setInitialValues({
            nome: user.nome || '',
            idade: user.idade || '',
            genero: user.genero || '',
            altura: user.altura || '',
            peso: user.peso || '',
            estado: user.estado || '',
            hasComorbidities: !!user.hasComorbidities,
            comorbidades: Array.isArray(user.comorbidades) ? user.comorbidades : [],
            comorbidadeOutros: user.comorbidadeOutros || '',
          });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.primary, fontSize: 18, marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.gradientContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Animatable.View animation="fadeIn" duration={800}>
            <View style={styles.header}>
              <MaterialIcons name="app-registration" size={32} color={colors.primary} />
              <Animatable.Text animation="fadeInDown" duration={1000} style={styles.title}>
                Cadastro de Saúde
              </Animatable.Text>
              <Text style={styles.subtitle}>
                Preencha seus dados para personalizarmos seu acompanhamento
              </Text>
            </View>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={CadastroSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const userData = {
                    nome: String(values.nome),
                    idade: String(values.idade),
                    genero: String(values.genero),
                    altura: String(values.altura),
                    peso: String(values.peso),
                    estado: String(values.estado),
                    hasComorbidities: !!values.hasComorbidities,
                    comorbidades: Array.isArray(values.comorbidades) ? values.comorbidades : [],
                    comorbidadeOutros: values.comorbidadeOutros || '',
                  };
                  await AsyncStorage.setItem('user', JSON.stringify(userData));
                  if (onNavigate) onNavigate('Dashboard');
                } catch (error) {
                  console.error('Erro ao salvar dados:', error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (
                <View style={styles.formContainer}>
                  {/* Nome */}
                  <Animatable.View animation="fadeInDown" delay={100} duration={500}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <View style={styles.inputContainer}>
                      <MaterialIcons name="person" size={20} color={colors.info} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Digite seu nome completo"
                        placeholderTextColor="#6c757d"
                        style={[
                          styles.input,
                          touched.nome && errors.nome ? styles.inputError : {},
                          touched.nome && !errors.nome ? styles.inputSuccess : {}
                        ]}
                        onChangeText={handleChange('nome')}
                        onBlur={handleBlur('nome')}
                        value={values.nome}
                        autoCapitalize="words"
                      />
                    </View>
                    {touched.nome && errors.nome && (
                      <Text style={styles.errorText}><MaterialIcons name="error" size={14} color={colors.danger} /> {errors.nome}</Text>
                    )}
                  </Animatable.View>
                  {/* Idade e Gênero lado a lado */}
                  <Animatable.View animation="fadeInDown" delay={200} duration={500} style={styles.rowInline}>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>Idade</Text>
                      <View style={styles.inputContainer}>
                        <MaterialIcons name="cake" size={20} color={colors.info} style={styles.inputIcon} />
                        <TextInput
                          placeholder="Idade"
                          placeholderTextColor="#6c757d"
                          keyboardType="numeric"
                          style={[
                            styles.input,
                            touched.idade && errors.idade ? styles.inputError : {},
                            touched.idade && !errors.idade ? styles.inputSuccess : {}
                          ]}
                          onChangeText={handleChange('idade')}
                          onBlur={handleBlur('idade')}
                          value={values.idade}
                        />
                      </View>
                      {touched.idade && errors.idade && (
                        <Text style={styles.errorText}><MaterialIcons name="error" size={14} color={colors.danger} /> {errors.idade}</Text>
                      )}
                    </View>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>Gênero</Text>
                      <View style={[
                        styles.pickerContainer,
                        touched.genero && errors.genero ? styles.inputError : {},
                        touched.genero && !errors.genero ? styles.inputSuccess : {}
                      ]}>
                        <Picker
                          selectedValue={values.genero}
                          onValueChange={(itemValue) => setFieldValue('genero', itemValue, true)}
                          onBlur={handleBlur('genero')}
                          style={styles.picker}
                          dropdownIconColor={colors.info}
                          mode="dropdown"
                        >
                          <Picker.Item label="Selecione" value="" color="#6c757d" />
                          <Picker.Item label="Masculino" value="masculino" color={colors.dark} />
                          <Picker.Item label="Feminino" value="feminino" color={colors.dark} />
                          <Picker.Item label="Outro/Prefiro não informar" value="outro" color={colors.dark} />
                        </Picker>
                      </View>
                      {touched.genero && errors.genero && (
                        <Text style={styles.errorText}><MaterialIcons name="error" size={14} color={colors.danger} /> {errors.genero}</Text>
                      )}
                    </View>
                  </Animatable.View>
                  {/* Altura e Peso lado a lado */}
                  <Animatable.View animation="fadeInDown" delay={400} duration={500} style={styles.rowInline}>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>Altura (m)</Text>
                      <View style={styles.inputContainer}>
                        <MaterialIcons name="straighten" size={20} color={colors.info} style={styles.inputIcon} />
                        <TextInput
                          placeholder="Ex: 1.75"
                          placeholderTextColor="#6c757d"
                          keyboardType="numeric"
                          style={[
                            styles.input,
                            touched.altura && errors.altura ? styles.inputError : {},
                            touched.altura && !errors.altura ? styles.inputSuccess : {}
                          ]}
                          onChangeText={handleChange('altura')}
                          onBlur={handleBlur('altura')}
                          value={values.altura}
                        />
                      </View>
                      {touched.altura && errors.altura && (
                        <Text style={styles.errorText}><MaterialIcons name="error" size={14} color={colors.danger} /> {errors.altura}</Text>
                      )}
                    </View>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>Peso (kg)</Text>
                      <View style={styles.inputContainer}>
                        <MaterialIcons name="fitness-center" size={20} color={colors.info} style={styles.inputIcon} />
                        <TextInput
                          placeholder="Ex: 68.5"
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
                        <Text style={styles.errorText}><MaterialIcons name="error" size={14} color={colors.danger} /> {errors.peso}</Text>
                      )}
                    </View>
                  </Animatable.View>
                  {/* Estado/Perfil */}
                  <Animatable.View animation="fadeInDown" delay={600} duration={500}>
                    <Text style={styles.label}>Perfil de Atividade</Text>
                    <View style={[
                      styles.pickerContainer,
                      touched.estado && errors.estado ? styles.inputError : {},
                      touched.estado && !errors.estado ? styles.inputSuccess : {}
                    ]}>
                      <Picker
                        selectedValue={values.estado}
                        onValueChange={(itemValue) => setFieldValue('estado', itemValue, true)}
                        onBlur={handleBlur('estado')}
                        style={styles.picker}
                        dropdownIconColor={colors.info}
                        mode="dropdown"
                      >
                        <Picker.Item label="Selecione seu perfil" value="" color="#6c757d" />
                        <Picker.Item label="Sedentário (não pratica exercícios)" value="sedentario" color={colors.dark} />
                        <Picker.Item label="Ativo (exercício 1-2x/semana)" value="ativo" color={colors.dark} />
                        <Picker.Item label="Fitness (exercício 3-5x/semana)" value="fitness" color={colors.dark} />
                        <Picker.Item label="Atleta amador" value="atleta_amador" color={colors.dark} />
                        <Picker.Item label="Atleta de alto rendimento" value="atleta_alto_rendimento" color={colors.dark} />
                        <Picker.Item label="Outro" value="outro" color={colors.dark} />
                      </Picker>
                    </View>
                    {touched.estado && errors.estado && (
                      <Text style={styles.errorText}><MaterialIcons name="error" size={14} color={colors.danger} /> {errors.estado}</Text>
                    )}
                  </Animatable.View>
                  {/* Comorbidades */}
                  <Animatable.View animation="fadeInDown" delay={600} duration={500}>
                    <View style={styles.comorbidityHeader}>
                      <Text style={styles.label}>Possui comorbidades?</Text>
                        <Switch
                          value={values.hasComorbidities}
                          onValueChange={(val) => { void setFieldValue('hasComorbidities', val); }}
                          thumbColor={values.hasComorbidities ? colors.primary : '#f4f3f4'}
                          trackColor={{ false: '#d3d3d3', true: colors.accent }}
                        />
                    </View>
                    {values.hasComorbidities && (
                      <View style={styles.comorbidityList}>
                        {commonComorbidities.map((c) => {
                          const selected = values.comorbidades && values.comorbidades.includes(c);
                          return (
                            <TouchableOpacity
                              key={c}
                              style={[styles.chip, selected && styles.chipSelected]}
                              onPress={() => {
                                let arr = Array.isArray(values.comorbidades) ? [...values.comorbidades] : [];
                                if (arr.includes(c)) arr = arr.filter((x) => x !== c);
                                else arr.push(c);
                                setFieldValue('comorbidades', arr);
                              }}
                            >
                              <MaterialIcons name={selected ? 'check-box' : 'check-box-outline-blank'} size={20} color={selected ? colors.light : colors.dark} />
                              <Text style={[styles.chipText, selected && { color: colors.light }]}>{c}</Text>
                            </TouchableOpacity>
                          );
                        })}
                        {values.comorbidades && values.comorbidades.includes('Outros') && (
                          <View style={{ marginTop: 8 }}>
                            <Text style={styles.label}>Descreva a comorbidade</Text>
                            <TextInput
                              placeholder="Informe a condição"
                              placeholderTextColor="#6c757d"
                              style={[styles.input, { paddingLeft: 12 }]}
                              onChangeText={(text) => setFieldValue('comorbidadeOutros', text)}
                              value={values.comorbidadeOutros}
                            />
                          </View>
                        )}
                        {touched.comorbidades && errors.comorbidades && (
                          <Text style={styles.errorText}>{String(errors.comorbidades)}</Text>
                        )}
                      </View>
                    )}
                  </Animatable.View>

                  {/* Botão de Envio */}
                  <Animatable.View animation="fadeInDown" delay={700} duration={500}>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!isValid || !dirty) && styles.submitButtonDisabled
                      ]}
                      onPress={handleSubmit as any}
                      disabled={!isValid || !dirty || isSubmitting}
                    >
                      <LinearGradient
                        colors={!isValid || !dirty ? ['#e9ecef', '#e9ecef'] : [colors.primary, colors.secondary]}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {isSubmitting ? (
                          <Text style={styles.submitButtonText}>Processando...</Text>
                        ) : (
                          <>
                            <Text style={styles.submitButtonText}>Salvar e Continuar</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="white" />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )}
            </Formik>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.info,
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    marginLeft: 4,
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
    backgroundColor: colors.light,
    fontSize: 16,
    color: colors.dark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#fff5f5',
  },
  inputSuccess: {
    borderColor: colors.success,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    width: '100%',
    height: 54,
    color: colors.dark,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingRight: 32,
    flex: 1,
    marginTop: Platform.OS === 'android' ? 4 : 0,
    marginBottom: Platform.OS === 'android' ? 4 : 0,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: colors.light,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    minHeight: 60,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  submitButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonDisabled: {
    shadowColor: 'transparent',
    elevation: 0,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: colors.light,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  rowInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  halfField: {
    flex: 1,
    marginHorizontal: 6,
  },
  comorbidityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comorbidityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    marginLeft: 8,
    color: colors.dark,
    fontWeight: '600',
  },
});
