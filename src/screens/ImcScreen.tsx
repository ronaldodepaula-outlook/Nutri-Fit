import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { advisoryShort, advisoryLong, consultProfessional } from '../constants/HealthMessages';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressChart } from 'react-native-chart-kit';

const colors = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  success: '#4cc9f0',
  warning: '#f8961e',
  danger: '#f72585',
  light: '#f8f9fa',
  dark: '#212529',
  info: '#577590',
  white: '#fff',
};

const chartConfig = {
  backgroundGradientFrom: colors.light,
  backgroundGradientTo: colors.light,
  color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
};

function getUserData(user: any) {
  if (!user) return { name: 'Usuário', height: '--', weight: '--', gender: '' };
  return {
    name: user.nome || 'Usuário',
    height: user.altura || '--',
    weight: user.peso || '--',
    gender: user.genero ? user.genero.charAt(0).toUpperCase() + user.genero.slice(1) : ''
  };
}

function categorizeImc(imcValue: number, isFemale: boolean) {
  let categoryText = '', adviceText = '', riskFactorsList: string[] = [];
  if (isFemale) {
    if (imcValue < 19.1) {
      categoryText = 'Abaixo do peso';
      adviceText = 'Procure acompanhamento nutricional para ganho de peso saudável.';
      riskFactorsList = ['Osteoporose', 'Anemia', 'Queda de cabelo'];
    } else if (imcValue < 25.8) {
      categoryText = 'Peso ideal';
      adviceText = 'Mantenha hábitos saudáveis com alimentação balanceada e exercícios.';
      riskFactorsList = ['Risco mínimo para doenças relacionadas ao peso'];
    } else if (imcValue < 27.3) {
      categoryText = 'Pouco acima do peso';
      adviceText = 'Reduza calorias e pratique exercícios aeróbicos.';
      riskFactorsList = ['Risco moderado de diabetes', 'Pressão alta'];
    } else if (imcValue < 32.3) {
      categoryText = 'Sobrepeso';
      adviceText = 'Procure nutricionista para plano alimentar.';
      riskFactorsList = ['Diabetes tipo 2', 'Hipertensão'];
    } else {
      categoryText = 'Obesidade';
      adviceText = 'Acompanhamento médico é essencial.';
      riskFactorsList = ['Diabetes', 'Hipertensão grave'];
    }
  } else {
    if (imcValue < 20.7) {
      categoryText = 'Abaixo do peso';
      adviceText = 'Dieta hipercalórica saudável e musculação.';
      riskFactorsList = ['Baixa imunidade', 'Fadiga crônica'];
    } else if (imcValue < 26.4) {
      categoryText = 'Peso ideal';
      adviceText = 'Continue com estilo de vida saudável.';
      riskFactorsList = ['Risco mínimo para doenças relacionadas ao peso'];
    } else if (imcValue < 27.8) {
      categoryText = 'Pouco acima do peso';
      adviceText = 'Reduza processados e aumente atividade física.';
      riskFactorsList = ['Colesterol elevado', 'Pré-diabetes'];
    } else if (imcValue < 31.1) {
      categoryText = 'Sobrepeso';
      adviceText = 'Inicie programa de perda de peso.';
      riskFactorsList = ['Doenças coronarianas'];
    } else {
      categoryText = 'Obesidade';
      adviceText = 'Avaliação médica completa recomendada.';
      riskFactorsList = ['Infarto', 'AVC'];
    }
  }
  return { category: categoryText, advice: adviceText, riskFactors: riskFactorsList };
}

export default function ImcScreen() {
  const [user, setUser] = useState<any>(null);
  const [imcData, setImcData] = useState<any>({});
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const screenWidth = useMemo(() => Dimensions.get('window').width, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    AsyncStorage.getItem('user').then(data => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const height = parseFloat((user.altura || '').replace(',', '.'));
    const weight = parseFloat((user.peso || '').replace(',', '.'));
    if (!height || !weight) return;
    const imcValue = weight / (height * height);
    const isFemale = user.genero === 'feminino';
    const idealWeightValue = isFemale ? 21.5 * (height * height) : 23.5 * (height * height);
    let weightToLose = null, weightToGain = null;
    if (imcValue > 25) weightToLose = weight - idealWeightValue;
    else if (imcValue < 18.5) weightToGain = idealWeightValue - weight;
    const { category, advice, riskFactors } = categorizeImc(imcValue, isFemale);
    setImcData({
      imc: imcValue,
      idealWeight: idealWeightValue,
      weightToLose,
      weightToGain,
      category,
      advice,
      riskFactors,
    });
  }, [user]);

  const categoryColor = useMemo(() => {
    if (!imcData.category) return colors.info;
    if (imcData.category.includes('Abaixo')) return colors.warning;
    if (imcData.category.includes('ideal')) return colors.success;
    if (imcData.category.includes('Pouco')) return '#fbc02d';
    if (imcData.category.includes('Sobrepeso')) return colors.warning;
    return colors.danger;
  }, [imcData.category]);

  const imcProgress = useMemo(() => {
    if (!imcData.imc) return 0;
    return Math.min(imcData.imc / 40, 1);
  }, [imcData.imc]);

  const chartData = useMemo(() => ({
    labels: ['Seu IMC'],
    data: [imcProgress]
  }), [imcProgress]);

  const formattedUserData = useMemo(() => getUserData(user), [user]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.headerTitle}>Análise de IMC</Text>
          <Text style={styles.headerSubtitle}>Índice de Massa Corporal</Text>
        </LinearGradient>
        <View style={styles.userDataCard}>
          <View style={styles.userDataRow}>
            <MaterialIcons name="person" size={20} color={colors.info} />
            <Text style={styles.userDataText}>{formattedUserData.name}</Text>
          </View>
          <View style={styles.userDataRow}>
            <MaterialIcons name="straighten" size={20} color={colors.info} />
            <Text style={styles.userDataText}>{formattedUserData.height} m</Text>
          </View>
          <View style={styles.userDataRow}>
            <MaterialIcons name="fitness-center" size={20} color={colors.info} />
            <Text style={styles.userDataText}>{formattedUserData.weight} kg</Text>
          </View>
          <View style={styles.userDataRow}>
            <MaterialIcons name="wc" size={20} color={colors.info} />
            <Text style={styles.userDataText}>{formattedUserData.gender}</Text>
          </View>
        </View>
        {/* Comorbidades */}
        <View style={styles.comorbCard}>
          <Text style={styles.sectionTitle}>Comorbidades</Text>
          {user && user.hasComorbidities ? (
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(user.comorbidades || []).map((c: string, i: number) => (
                  <View key={i} style={styles.comorbChip}>
                    <Text style={styles.comorbText}>{c}</Text>
                  </View>
                ))}
                {user.comorbidades && user.comorbidades.includes('Outros') && user.comorbidadeOutros ? (
                  <View style={styles.comorbChip}>
                    <Text style={styles.comorbText}>{user.comorbidadeOutros}</Text>
                  </View>
                ) : null}
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.adviceText}>{advisoryLong}</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.adviceText, { marginTop: 8 }]}>Nenhuma comorbidade informada.</Text>
          )}
        </View>
        {imcData.imc !== undefined && (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.sectionTitle}>Seu Resultado</Text>
              <View style={styles.imcContainer}>
                <Text style={styles.imcValue}>{imcData.imc?.toFixed(1)}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}> 
                  <Text style={styles.categoryText}>{imcData.category}</Text>
                </View>
              </View>
              <View style={styles.chartContainer}>
                <ProgressChart
                  data={chartData}
                  width={screenWidth - 80}
                  height={140}
                  strokeWidth={10}
                  radius={40}
                  chartConfig={chartConfig}
                  hideLegend={true}
                />
              </View>
            </View>
            <View style={styles.goalsCard}>
              <Text style={styles.sectionTitle}>Metas e Orientações</Text>
              {imcData.idealWeight !== null && (
                <View style={styles.goalItem}>
                  <MaterialIcons name="star" size={20} color={colors.success} />
                  <Text style={styles.goalText}>
                    <Text style={{ fontWeight: 'bold' }}>Peso ideal: </Text>
                    {imcData.idealWeight?.toFixed(1)} kg
                  </Text>
                </View>
              )}
              {imcData.weightToLose !== null && (
                <View style={styles.goalItem}>
                  <MaterialIcons name="trending-down" size={20} color={colors.warning} />
                  <Text style={styles.goalText}>
                    <Text style={{ fontWeight: 'bold' }}>Perder: </Text>
                    {imcData.weightToLose?.toFixed(1)} kg para alcançar o peso ideal
                  </Text>
                </View>
              )}
              {imcData.weightToGain !== null && (
                <View style={styles.goalItem}>
                  <MaterialIcons name="trending-up" size={20} color={colors.warning} />
                  <Text style={styles.goalText}>
                    <Text style={{ fontWeight: 'bold' }}>Ganhar: </Text>
                    {imcData.weightToGain?.toFixed(1)} kg para alcançar o peso ideal
                  </Text>
                </View>
              )}
              <View style={styles.adviceContainer}>
                <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                <Text style={styles.adviceText}>{imcData.advice}</Text>
              </View>
            </View>
            {imcData.riskFactors && imcData.riskFactors.length > 0 && (
              <View style={styles.risksCard}>
                <Text style={styles.sectionTitle}>Fatores de Risco Associados</Text>
                <View style={styles.riskFactorsContainer}>
                  {imcData.riskFactors.map((factor: string, idx: number) => (
                    <View key={idx} style={styles.riskFactorItem}>
                      <MaterialIcons name="warning" size={16} color={colors.danger} />
                      <Text style={styles.riskFactorText}>{factor}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer: {
    paddingBottom: 40,
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
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userDataCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginTop: -20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
  },
  userDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userDataText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 12,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
  },
  imcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imcValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoryBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  goalsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 12,
    flex: 1,
  },
  adviceContainer: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff9e6',
    borderRadius: 8,
  },
  adviceText: {
    fontSize: 15,
    color: colors.dark,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  risksCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  riskFactorsContainer: {
    marginTop: 8,
  },
  riskFactorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff5f5',
    borderRadius: 6,
  },
  riskFactorText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
  },
  comorbCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  comorbChip: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  comorbText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
