import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// @ts-ignore
import { useUser } from '../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

function categorizeImc(imcValue: number, isFemale: boolean) {
  let category = '', advice = '', riskFactors = [];
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
}

export default function ImcScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    AsyncStorage.getItem('user').then(userStr => {
      if (userStr) setUser(JSON.parse(userStr));
    });
  }, []);
  if (!user) return <View style={styles.container}><Text>Carregando dados do usuário...</Text></View>;
  const height = parseFloat((user.altura || '').replace(',', '.'));
  const weight = parseFloat((user.peso || '').replace(',', '.'));
  if (!height || !weight) return <View style={styles.container}><Text>Preencha altura e peso no cadastro.</Text></View>;
  const imc = weight / (height * height);
  const isFemale = user.genero === 'feminino';
  const idealWeight = isFemale ? 21.5 * (height * height) : 23.5 * (height * height);
  let weightToLose = null, weightToGain = null;
  if (imc > 25) weightToLose = weight - idealWeight;
  else if (imc < 18.5) weightToGain = idealWeight - weight;
  const { category, advice, riskFactors } = categorizeImc(imc, isFemale);
  const categoryColor = category.includes('Abaixo') ? colors.warning : category.includes('ideal') ? colors.success : category.includes('Pouco') ? '#fbc02d' : category.includes('Sobrepeso') ? colors.warning : colors.danger;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análise de IMC</Text>
        <Text style={styles.headerSubtitle}>Índice de Massa Corporal</Text>
      </View>
      <View style={styles.userDataCard}>
        <View style={styles.userDataRow}>
          <MaterialIcons name="person" size={20} color={colors.info} />
          <Text style={styles.userDataText}>{user.nome || 'Usuário'}</Text>
        </View>
        <View style={styles.userDataRow}>
          <MaterialIcons name="straighten" size={20} color={colors.info} />
          <Text style={styles.userDataText}>{user.altura} m</Text>
        </View>
        <View style={styles.userDataRow}>
          <MaterialIcons name="fitness-center" size={20} color={colors.info} />
          <Text style={styles.userDataText}>{user.peso} kg</Text>
        </View>
        <View style={styles.userDataRow}>
          <MaterialIcons name="wc" size={20} color={colors.info} />
          <Text style={styles.userDataText}>{user.genero ? user.genero.charAt(0).toUpperCase() + user.genero.slice(1) : ''}</Text>
        </View>
      </View>
      <View style={styles.resultCard}>
        <Text style={styles.sectionTitle}>Seu Resultado</Text>
        <View style={styles.imcContainer}>
          <Text style={styles.imcValue}>{imc.toFixed(1)}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>  
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
        {/* Fatores de risco ou mensagem motivacional */}
        {riskFactors.length > 0 ? (
          <View style={{marginTop: 10, padding: 12, backgroundColor: '#fff5f5', borderRadius: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons name="warning" size={20} color={colors.danger} />
              <Text style={{marginLeft: 10, color: colors.danger, fontSize: 15, fontWeight: 'bold'}}>
                Você possui fator(es) de risco:
              </Text>
            </View>
            <View style={{marginTop: 8, marginLeft: 8}}>
              {riskFactors.map((factor, i) => (
                <View key={i} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                  <MaterialIcons name="arrow-right" size={16} color={colors.danger} />
                  <Text style={{marginLeft: 6, color: colors.danger, fontSize: 14}}>{factor}</Text>
                </View>
              ))}
            </View>
            {/* Cards de ação */}
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 16}}>
              <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 10, padding: 16, alignItems: 'center', flex: 1, marginRight: 8}}
                onPress={() => onNavigate && onNavigate('Exercicios')}
              >
                <MaterialIcons name="fitness-center" size={28} color={colors.white} />
                <Text style={{color: colors.white, fontWeight: 'bold', marginTop: 6}}>Ir para Exercícios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: colors.warning, borderRadius: 10, padding: 16, alignItems: 'center', flex: 1, marginLeft: 8}}
                onPress={() => onNavigate && onNavigate('Dieta')}
              >
                <MaterialIcons name="restaurant" size={28} color={colors.white} />
                <Text style={{color: colors.white, fontWeight: 'bold', marginTop: 6}}>Ir para Dieta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{marginTop: 10, padding: 12, backgroundColor: '#e6fff2', borderRadius: 8, flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="check-circle" size={20} color={colors.success} />
            <Text style={{marginLeft: 10, color: colors.success, fontSize: 15, fontWeight: 'bold'}}>
              Parabéns! Nenhum fator de risco identificado.
            </Text>
          </View>
        )}
        {/* Mensagem motivacional extra se não houver risco */}
        {riskFactors.length === 0 && (
          <View style={{marginTop: 10, padding: 10, backgroundColor: '#f0f9ff', borderRadius: 8}}>
            <Text style={{color: colors.info, fontSize: 14}}>
              Continue mantendo hábitos saudáveis! Pratique atividades físicas, mantenha uma alimentação equilibrada e faça acompanhamento regular. Sua saúde agradece!
            </Text>
          </View>
        )}
      </View>
      <View style={styles.goalsCard}>
        <Text style={styles.sectionTitle}>Metas e Orientações</Text>
        <View style={styles.goalItem}>
          <MaterialIcons name="star" size={20} color={colors.success} />
          <Text style={styles.goalText}><Text style={{ fontWeight: 'bold' }}>Peso ideal: </Text>{idealWeight.toFixed(1)} kg</Text>
        </View>
        {weightToLose !== null && (
          <View style={styles.goalItem}>
            <MaterialIcons name="trending-down" size={20} color={colors.warning} />
            <Text style={styles.goalText}><Text style={{ fontWeight: 'bold' }}>Perder: </Text>{weightToLose.toFixed(1)} kg</Text>
          </View>
        )}
        {weightToGain !== null && (
          <View style={styles.goalItem}>
            <MaterialIcons name="trending-up" size={20} color={colors.warning} />
            <Text style={styles.goalText}><Text style={{ fontWeight: 'bold' }}>Ganhar: </Text>{weightToGain.toFixed(1)} kg</Text>
          </View>
        )}
        <View style={styles.adviceContainer}>
          <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      </View>
      {riskFactors.length > 0 && (
        <View style={styles.risksCard}>
          <Text style={styles.sectionTitle}>Fatores de Risco</Text>
          {riskFactors.map((factor, i) => (
            <View key={i} style={styles.riskFactorItem}>
              <MaterialIcons name="warning" size={16} color={colors.danger} />
              <Text style={styles.riskFactorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.referenceCard}>
        <Text style={styles.sectionTitle}>Classificação de IMC</Text>
        <View style={styles.referenceTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Categoria</Text>
            <Text style={styles.tableHeaderText}>IMC {isFemale ? 'Feminino' : 'Masculino'}</Text>
          </View>
          <View style={[styles.tableRow, category === 'Abaixo do peso' && styles.highlightedRow]}>
            <Text style={styles.tableCell}>Abaixo do peso</Text>
            <Text style={styles.tableCell}>{isFemale ? '< 19,1' : '< 20,7'}</Text>
          </View>
          <View style={[styles.tableRow, category === 'Peso ideal' && styles.highlightedRow]}>
            <Text style={styles.tableCell}>Peso ideal</Text>
            <Text style={styles.tableCell}>{isFemale ? '19,1 - 25,7' : '20,7 - 26,3'}</Text>
          </View>
          <View style={[styles.tableRow, category === 'Pouco acima do peso' && styles.highlightedRow]}>
            <Text style={styles.tableCell}>Pouco acima</Text>
            <Text style={styles.tableCell}>{isFemale ? '25,8 - 27,2' : '26,4 - 27,7'}</Text>
          </View>
          <View style={[styles.tableRow, category === 'Sobrepeso' && styles.highlightedRow]}>
            <Text style={styles.tableCell}>Sobrepeso</Text>
            <Text style={styles.tableCell}>{isFemale ? '27,3 - 32,2' : '27,8 - 31,0'}</Text>
          </View>
          <View style={[styles.tableRow, category === 'Obesidade' && styles.highlightedRow]}>
            <Text style={styles.tableCell}>Obesidade</Text>
            <Text style={styles.tableCell}>{isFemale ? '≥ 32,3' : '≥ 31,1'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, paddingBottom: 40 },
  header: { padding: 24, paddingTop: 40, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: colors.primary },
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
  goalsCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  goalItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  goalText: { fontSize: 16, color: colors.dark, marginLeft: 12, flex: 1 },
  adviceContainer: { flexDirection: 'row', marginTop: 16, padding: 12, backgroundColor: '#fff9e6', borderRadius: 8 },
  adviceText: { fontSize: 15, color: colors.dark, marginLeft: 12, flex: 1, lineHeight: 22 },
  risksCard: { backgroundColor: colors.white, borderRadius: 12, padding: 20, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
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
