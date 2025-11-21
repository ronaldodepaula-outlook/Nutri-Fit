import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressChart } from 'react-native-chart-kit';
// @ts-ignore
import { useUser } from '../contexts/UserContext';

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

const TableRow = React.memo(({ isHighlighted, leftText, rightText }: { isHighlighted: boolean; leftText: string; rightText: string; }) => (
  <View style={[styles.tableRow, isHighlighted && styles.highlightedRow]}>
    <Text style={styles.tableCell}>{leftText}</Text>
    <Text style={styles.tableCell}>{rightText}</Text>
  </View>
));

const RiskFactorItem = React.memo(({ factor }: { factor: string }) => (
  <View style={styles.riskFactorItem}>
    <MaterialIcons name="warning" size={16} color={colors.danger} />
    <Text style={styles.riskFactorText}>{factor}</Text>
  </View>
));

export default function ImcScreen() {
  const { user } = useUser();
  const [imcData, setImcData] = useState<{
    imc: number | null;
    idealWeight: number | null;
    weightToLose: number | null;
    weightToGain: number | null;
    category: string;
    advice: string;
    riskFactors: string[];
  }>({
    imc: null,
    idealWeight: null,
    weightToLose: null,
    weightToGain: null,
    category: '',
    advice: '',
    riskFactors: [],
  });
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const screenWidth = useMemo(() => Dimensions.get('window').width, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const categorizeImc = (imcValue: number, isFemale: boolean) => {
    let category = '', advice = '', riskFactors: string[] = [];
    if (isFemale) {
      if (imcValue < 19.1) {
        category = 'Abaixo do peso';
        advice = 'Acompanhamento nutricional e exames recomendados.';
        riskFactors = ['Osteoporose', 'Anemia'];
      } else if (imcValue < 25.8) {
        category = 'Peso ideal';
        advice = 'Mantenha hábitos saudáveis!';
        riskFactors = ['Risco mínimo'];
      } else if (imcValue < 27.3) {
        category = 'Pouco acima do peso';
        advice = 'Reduza calorias e faça exercícios.';
        riskFactors = ['Risco moderado de diabetes'];
      } else if (imcValue < 32.3) {
        category = 'Sobrepeso';
        advice = 'Procure nutricionista e faça atividades.';
        riskFactors = ['Diabetes tipo 2', 'Hipertensão'];
      } else {
        category = 'Obesidade';
        advice = 'Acompanhamento médico essencial.';
        riskFactors = ['Diabetes', 'Hipertensão grave'];
      }
    } else {
      if (imcValue < 20.7) {
        category = 'Abaixo do peso';
        advice = 'Dieta hipercalórica e musculação.';
        riskFactors = ['Baixa imunidade'];
      } else if (imcValue < 26.4) {
        category = 'Peso ideal';
        advice = 'Continue saudável!';
        riskFactors = ['Risco mínimo'];
      } else if (imcValue < 27.8) {
        category = 'Pouco acima do peso';
        advice = 'Reduza processados e movimente-se.';
        riskFactors = ['Colesterol elevado'];
      } else if (imcValue < 31.1) {
        category = 'Sobrepeso';
        advice = 'Inicie programa de perda de peso.';
        riskFactors = ['Doenças coronarianas'];
      } else {
        category = 'Obesidade';
        advice = 'Avaliação médica completa.';
        riskFactors = ['Infarto', 'AVC'];
      }
    }
    return { category, advice, riskFactors };
  };

  const calculateImcData = useCallback(() => {
    if (!user) return;
    const height = parseFloat((user.altura || '').replace(',', '.'));
    const weight = parseFloat((user.peso || '').replace(',', '.'));
    if (!height || !weight) return;
    const imcValue = weight / (height * height);
    const isFemale = user.genero === 'feminino';
    const idealWeight = isFemale ? 21.5 * (height * height) : 23.5 * (height * height);
    let weightToLose = null, weightToGain = null;
    if (imcValue > 25) weightToLose = weight - idealWeight;
    else if (imcValue < 18.5) weightToGain = idealWeight - weight;
    const { category, advice, riskFactors } = categorizeImc(imcValue, isFemale);
    setImcData({ imc: imcValue, idealWeight, weightToLose, weightToGain, category, advice, riskFactors });
  }, [user]);

  useEffect(() => { calculateImcData(); }, [calculateImcData]);

  const categoryColor = useMemo(() => {
    if (!imcData.category) return colors.info;
    if (imcData.category.includes('Abaixo')) return colors.warning;
    if (imcData.category.includes('ideal')) return colors.success;
    if (imcData.category.includes('Pouco')) return '#fbc02d';
    if (imcData.category.includes('Sobrepeso')) return colors.warning;
    return colors.danger;
  }, [imcData.category]);

  const imcProgress = useMemo(() => imcData.imc ? Math.min(imcData.imc / 40, 1) : 0, [imcData.imc]);
  const chartData = useMemo(() => ({ labels: ['Seu IMC'], data: [imcProgress] }), [imcProgress]);
  const renderedRiskFactors = useMemo(() => (
    imcData.riskFactors.map((factor, i) => <RiskFactorItem key={`risk-${i}`} factor={factor} />)
  ), [imcData.riskFactors]);
  const formattedUserData = useMemo(() => ({
    name: user?.nome || 'Usuário',
    height: user?.altura || '--',
    weight: user?.peso || '--',
    gender: user?.genero ? user.genero.charAt(0).toUpperCase() + user.genero.slice(1) : ''
  }), [user]);

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
        {imcData.imc !== null && (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.sectionTitle}>Seu Resultado</Text>
              <View style={styles.imcContainer}>
                <Text style={styles.imcValue}>{imcData.imc.toFixed(1)}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>  
                  <Text style={styles.categoryText}>{imcData.category}</Text>
                </View>
              </View>
              <View style={styles.chartContainer}>
                <ProgressChart
                  data={chartData}
                  width={screenWidth - 80}
                  height={120}
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
                  <Text style={styles.goalText}><Text style={{ fontWeight: 'bold' }}>Peso ideal: </Text>{imcData.idealWeight.toFixed(1)} kg</Text>
                </View>
              )}
              {imcData.weightToLose !== null && (
                <View style={styles.goalItem}>
                  <MaterialIcons name="trending-down" size={20} color={colors.warning} />
                  <Text style={styles.goalText}><Text style={{ fontWeight: 'bold' }}>Perder: </Text>{imcData.weightToLose.toFixed(1)} kg</Text>
                </View>
              )}
              {imcData.weightToGain !== null && (
                <View style={styles.goalItem}>
                  <MaterialIcons name="trending-up" size={20} color={colors.warning} />
                  <Text style={styles.goalText}><Text style={{ fontWeight: 'bold' }}>Ganhar: </Text>{imcData.weightToGain.toFixed(1)} kg</Text>
                </View>
              )}
              <View style={styles.adviceContainer}>
                <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                <Text style={styles.adviceText}>{imcData.advice}</Text>
              </View>
            </View>
            {imcData.riskFactors.length > 0 && (
              <View style={styles.risksCard}>
                <Text style={styles.sectionTitle}>Fatores de Risco</Text>
                <View style={styles.riskFactorsContainer}>{renderedRiskFactors}</View>
              </View>
            )}
            <View style={styles.referenceCard}>
              <Text style={styles.sectionTitle}>Classificação de IMC</Text>
              <View style={styles.referenceTable}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Categoria</Text>
                  <Text style={styles.tableHeaderText}>IMC {user?.genero === 'feminino' ? 'Feminino' : 'Masculino'}</Text>
                </View>
                <TableRow isHighlighted={user?.genero === 'feminino' && imcData.category === 'Abaixo do peso'} leftText="Abaixo do peso" rightText={user?.genero === 'feminino' ? '< 19,1' : '< 20,7'} />
                <TableRow isHighlighted={imcData.category === 'Peso ideal'} leftText="Peso ideal" rightText={user?.genero === 'feminino' ? '19,1 - 25,7' : '20,7 - 26,3'} />
                <TableRow isHighlighted={imcData.category === 'Pouco acima do peso'} leftText="Pouco acima" rightText={user?.genero === 'feminino' ? '25,8 - 27,2' : '26,4 - 27,7'} />
                <TableRow isHighlighted={imcData.category === 'Sobrepeso'} leftText="Sobrepeso" rightText={user?.genero === 'feminino' ? '27,3 - 32,2' : '27,8 - 31,0'} />
                <TableRow isHighlighted={imcData.category === 'Obesidade'} leftText="Obesidade" rightText={user?.genero === 'feminino' ? '≥ 32,3' : '≥ 31,1'} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  scrollContainer: { paddingBottom: 40 },
  header: { padding: 24, paddingTop: 40, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  userDataCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, marginTop: -20, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, zIndex: 1 },
  userDataRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userDataText: { fontSize: 16, color: colors.dark, marginLeft: 12 },
  resultCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, margin: 20, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark, marginBottom: 16 },
  imcContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  imcValue: { fontSize: 42, fontWeight: 'bold', color: colors.primary },
  categoryBadge: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  categoryText: { fontSize: 16, fontWeight: '600', color: colors.white },
  chartContainer: { alignItems: 'center', marginTop: 10 },
  goalsCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  goalItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  goalText: { fontSize: 16, color: colors.dark, marginLeft: 12, flex: 1 },
  adviceContainer: { flexDirection: 'row', marginTop: 16, padding: 12, backgroundColor: '#fff9e6', borderRadius: 8 },
  adviceText: { fontSize: 15, color: colors.dark, marginLeft: 12, flex: 1, lineHeight: 22 },
  risksCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  riskFactorsContainer: { marginTop: 8 },
  riskFactorItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 8, backgroundColor: '#fff5f5', borderRadius: 6 },
  riskFactorText: { fontSize: 14, color: colors.dark, marginLeft: 8 },
  referenceCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  referenceTable: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 12 },
  tableHeaderText: { flex: 1, fontWeight: 'bold', color: colors.dark },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  highlightedRow: { backgroundColor: '#f0f8ff' },
  tableCell: { flex: 1, color: colors.dark },
});
