import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Modal, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { advisoryShort, advisoryLong, consultProfessional } from '../constants/HealthMessages';
import ComorbidityPlans from '../constants/ComorbidityPlans';

const CARD_WIDTH = (Dimensions.get('window').width - 48 - 20) / 2;
const CARD_HEIGHT = 130;
const CHART_WIDTH = Dimensions.get('window').width - 48;
const CHART_HEIGHT = 200;

const themeColors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  dark: '#34495e',
  light: '#ecf0f1',
  white: '#ffffff'
};

const cardColors = {
  peso: '#1976d2',
  altura: '#388e3c',
  imc: '#fbc02d',
  pesoIdeal: '#ff7043',
  dieta: '#8e24aa',
  exercicios: '#0097a7',
};

type User = {
  nome: string;
  idade: string;
  genero: string;
  altura: string;
  peso: string;
  estado: string;
  hasComorbidities?: boolean;
  comorbidades?: string[];
  comorbidadeOutros?: string;
};

type Pesagem = {
  data: string;
  peso: number;
};

export default function DashboardScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [imc, setImc] = useState<number | null>(null);
  const [faixa, setFaixa] = useState('');
  const [pesoIdeal, setPesoIdeal] = useState('');
  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const [planDetail, setPlanDetail] = useState<{ title: string; content: string; target?: 'Dieta' | 'Exercicios' } | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [chartData, setChartData] = useState<any>(null);
  const [pieData, setPieData] = useState<any>(null);
  const [pesagens, setPesagens] = useState<Pesagem[]>([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    loadUser();
    loadPesagens();
  }, []);

  useEffect(() => {
    if (user) {
      processUserData();
    }
  }, [user]);

  useEffect(() => {
    prepareChartData(pesagens);
  }, [pesagens]);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setChecking(false);
  };

  const loadPesagens = async () => {
    try {
      const pesagensStr = await AsyncStorage.getItem('pesagens');
      if (pesagensStr) {
        const arr = JSON.parse(pesagensStr);
        setPesagens(arr);
        prepareChartData(arr);
      } else {
        setPesagens([]);
        prepareChartData([]);
      }
    } catch (e) {
      setPesagens([]);
      prepareChartData([]);
    }
  };

  const processUserData = () => {
    if (!user) return;
    const altura = parseFloat((user.altura || '').replace(',', '.'));
    const peso = parseFloat((user.peso || '').replace(',', '.'));
    if (altura && peso) {
      const imcCalc = peso / (altura * altura);
      setImc(imcCalc);
      setFaixa(calculateImcCategory(imcCalc, user.genero));
      const pesoIdealCalc = calculateIdealWeight(altura, user.genero);
      setPesoIdeal(pesoIdealCalc.toFixed(1));
    }
  };

  const calculateImcCategory = (imcValue: number, gender: string): string => {
    const categories = {
      feminino: [
        { max: 19.1, label: 'Abaixo do peso (IMC < 19,1)' },
        { max: 25.8, label: 'Peso ideal (IMC 19,1 - 25,7)' },
        { max: 27.3, label: 'Pouco acima do peso (IMC 25,8 - 27,2)' },
        { max: 32.3, label: 'Sobrepeso (IMC 27,3 - 32,2)' },
        { max: Infinity, label: 'Obesidade (IMC ≥ 32,3)' }
      ],
      masculino: [
        { max: 20.7, label: 'Abaixo do peso (IMC < 20,7)' },
        { max: 26.4, label: 'Peso ideal (IMC 20,7 - 26,3)' },
        { max: 27.8, label: 'Pouco acima do peso (IMC 26,4 - 27,7)' },
        { max: 31.1, label: 'Sobrepeso (IMC 27,8 - 31,0)' },
        { max: Infinity, label: 'Obesidade (IMC ≥ 31,1)' }
      ]
    };
    const genderKey = (gender || '').toLowerCase() === 'feminino' ? 'feminino' : 'masculino';
    return categories[genderKey].find(c => imcValue < c.max)?.label || '';
  };

  const calculateIdealWeight = (height: number, gender: string): number => {
    const multiplier = (gender || '').toLowerCase() === 'feminino' ? 22.4 : 23.5;
    return height * height * multiplier;
  };

  const prepareChartData = (pesagensArr = pesagens) => {
    if (!user) return;
    if (!pesagensArr || pesagensArr.length === 0) {
      setChartData(null);
      return;
    }
    const labels = pesagensArr.map(p => p.data);
    const weights = pesagensArr.map(p => p.peso);
    const altura = parseFloat((user.altura || '').replace(',', '.'));
    const imcs = weights.map(w => altura ? w / (altura * altura) : 0);
    setChartData({
      labels,
      datasets: [
        {
          data: weights,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          strokeWidth: 3
        },
        {
          data: imcs,
          color: (opacity = 1) => `rgba(243, 156, 18, ${opacity})`,
          strokeWidth: 3
        }
      ],
      legend: ["Peso (kg)", "IMC"]
    });
    setPieData([
      { name: "Gordura", population: 25, color: themeColors.danger, legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Músculo", population: 40, color: themeColors.secondary, legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Água", population: 20, color: themeColors.primary, legendFontColor: "#7F7F7F", legendFontSize: 12 },
      { name: "Outros", population: 15, color: themeColors.warning, legendFontColor: "#7F7F7F", legendFontSize: 12 }
    ]);
  };

  const cardDetails = {
    peso: {
      title: 'Peso Atual',
      content: user ? `Seu peso atual é ${user.peso} kg. Mantenha um registro consistente para acompanhar seu progresso.` : '',
      icon: <MaterialCommunityIcons name="weight-kilogram" size={40} color="#fff" style={{ backgroundColor: 'transparent' }} />
    },
    altura: {
      title: 'Altura',
      content: user ? `Sua altura é ${user.altura} m. Esta medida é fundamental para cálculos precisos de IMC e outras métricas.` : '',
      icon: <MaterialCommunityIcons name="human-male-height" size={40} color="#fff" style={{ backgroundColor: 'transparent' }} />
    },
    imc: {
      title: 'Índice de Massa Corporal',
      content: imc !== null && faixa && user ? `Seu IMC é ${imc?.toFixed(2)} (${faixa}). O IMC é um indicador importante, mas não considera composição corporal.` : '',
      icon: <MaterialCommunityIcons name="calculator-variant" size={40} color="#fff" style={{ backgroundColor: 'transparent' }} />
    },
    pesoIdeal: {
      title: 'Peso Ideal',
      content: user ? `Baseado em sua altura, seu peso ideal é aproximadamente ${pesoIdeal} kg. Consulte um profissional para uma avaliação personalizada.` : '',
      icon: <MaterialCommunityIcons name="star" size={40} color="#fff" style={{ backgroundColor: 'transparent' }} />
    },
    dieta: {
      title: 'Recomendações Nutricionais',
      content: imc && imc < 18.5 
        ? 'Sua dieta deve focar em ganho de peso saudável, com aumento gradual de calorias e nutrientes essenciais.' 
        : imc && imc < 25 
          ? 'Mantenha uma dieta balanceada com variedade de nutrientes para sustentar seu peso ideal.' 
          : imc && imc < 30 
            ? 'Uma dieta com leve déficit calórico pode ajudar a alcançar seus objetivos de saúde.' 
            : 'Recomenda-se dieta para perda de peso, supervisionada por nutricionista, com foco em saúde metabólica.',
      icon: <FontAwesome5 name="utensils" size={36} color="#fff" style={{ marginBottom: 2 }} />
    },
    exercicios: {
      title: 'Plano de Exercícios',
      content: imc && imc < 18.5 
        ? 'Foco em treinamento de força para construção muscular, com progressão gradual de carga.' 
        : imc && imc < 25 
          ? 'Combinação equilibrada de exercícios cardiovasculares e treinamento de força para manutenção.' 
          : imc && imc < 30 
            ? 'Programa misto com ênfase em aeróbicos para condicionamento e força para preservação muscular.' 
            : 'Priorize exercícios aeróbicos de baixo impacto inicialmente, evoluindo para maior intensidade gradualmente.',
      icon: <MaterialCommunityIcons name="run" size={36} color="#fff" style={{ marginBottom: 2 }} />
    }
  };

  if (checking) {
    return <View style={styles.center}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Carregando seus dados de saúde...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard de Saúde</Text>
          <Text style={styles.subtitle}>Bem-vindo, {user.nome}</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.editProfileButton} onPress={() => onNavigate && onNavigate('Cadastro')}>
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
        {/* Métricas principais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Corporais</Text>
          <View style={styles.row}>
            <MetricCard type="peso" value={`${user.peso} kg`} subtitle="Peso Atual" onPress={() => setModalVisible('peso')} />
            <MetricCard type="altura" value={`${user.altura} m`} subtitle="Altura" onPress={() => setModalVisible('altura')} />
          </View>
          <View style={styles.row}>
            <MetricCard type="imc" value={imc?.toFixed(2) || '--'} subtitle={faixa || 'IMC'} onPress={() => setModalVisible('imc')} />
            <MetricCard type="pesoIdeal" value={`${pesoIdeal} kg`} subtitle="Peso Ideal" onPress={() => setModalVisible('pesoIdeal')} />
          </View>
        </View>
        {/* Gráficos */}
        {chartData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evolução Mensal</Text>
            <LineChart
              data={chartData}
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              chartConfig={{
                backgroundColor: themeColors.white,
                backgroundGradientFrom: themeColors.white,
                backgroundGradientTo: themeColors.light,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "5", strokeWidth: "2", stroke: themeColors.primary }
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 }}
            />
          </View>
        )}
        {pieData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Composição Corporal</Text>
            <PieChart
              data={pieData}
              width={CHART_WIDTH}
              height={220}
              chartConfig={{
                backgroundColor: themeColors.white,
                backgroundGradientFrom: themeColors.white,
                backgroundGradientTo: themeColors.light,
                color: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{ marginVertical: 8, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 }}
            />
          </View>
        )}
        {/* Recomendações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendações Personalizadas</Text>
          <View style={styles.row}>
            <MetricCard type="dieta" value={imc && imc < 18.5 ? 'Ganho' : imc && imc < 25 ? 'Manutenção' : imc && imc < 30 ? 'Dieta Leve' : 'Perda'} subtitle="Plano Nutricional" onPress={() => setModalVisible('dieta')} />
            <MetricCard type="exercicios" value={imc && imc < 18.5 ? 'Força' : imc && imc < 25 ? 'Equilíbrio' : imc && imc < 30 ? 'Misto' : 'Aeróbico'} subtitle="Programa de Treino" onPress={() => setModalVisible('exercicios')} />
          </View>
        </View>
        {/* Perfil de Atividade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil de Atividade</Text>
          <View style={{ width: '100%' }}>
            <View style={[styles.cardFull, { backgroundColor: themeColors.info }]}> 
              <FontAwesome5 name="running" size={28} color="#fff" style={{ marginBottom: 6 }} />
              <Text style={[styles.cardValueClean, { color: '#fff', fontSize: 16 }]}>Perfil: {user.estado ? user.estado.charAt(0).toUpperCase() + user.estado.slice(1).replace('_', ' ') : 'Não informado'}</Text>
              <Text style={[styles.cardSubtitleClean, { color: '#fff', fontSize: 12 }]}>Esse perfil personaliza suas recomendações de dieta e treino.</Text>
            </View>
          </View>
        </View>
        {/* Comorbidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comorbidades</Text>
          <View style={{ width: '100%' }}>
            <View style={[styles.cardFull, { backgroundColor: '#f1f3f5' }]}> 
              {user?.hasComorbidities ? (
                <>
                  <Text style={[styles.cardSubtitleClean, { color: themeColors.dark, fontSize: 14, marginBottom: 8 }]}>Comorbidades registradas:</Text>
                  <View style={styles.comorbidityWrap}>
                    {(user?.comorbidades || []).map((c: string, idx: number) => (
                      <View key={idx} style={styles.comorbChip}>
                        <Text style={styles.comorbText}>{c}</Text>
                      </View>
                    ))}
                    {user?.comorbidades?.includes('Outros') && user?.comorbidadeOutros ? (
                      <View style={styles.comorbChip}>
                        <Text style={styles.comorbText}>{user.comorbidadeOutros}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.advisoryText, { marginTop: 10 }]}>Recomendação: consulte um profissional de saúde para orientações personalizadas.</Text>
                </>
              ) : (
                <Text style={[styles.cardSubtitleClean, { color: themeColors.dark, fontSize: 14 }]}>Nenhuma comorbidade informada.</Text>
              )}
            </View>
          </View>
        </View>
        {/* Planos por Comorbidade (agregado + por item) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planos por Comorbidade</Text>
          <View style={{ width: '100%' }}>
            <View style={[styles.cardFull, { backgroundColor: '#f8fbff' }]}>
              {user?.hasComorbidities ? (
                <>
                  <Text style={[styles.cardSubtitleClean, { color: themeColors.dark, fontSize: 14, marginBottom: 8 }]}>Planos recomendados com base nas comorbidades informadas:</Text>
                  {/* Aggregated summary */}
                  <Text style={{ color: '#333', marginBottom: 8 }}>Resumo integrado:</Text>
                  <View style={{ marginBottom: 8 }}>
                    {(() => {
                      const list = (user?.comorbidades || []).length ? user?.comorbidades || [] : [];
                      const parts: string[] = [];
                      list.forEach((c: string) => {
                        const key = c === 'Outros' ? 'Outros' : c;
                        const entry = ComorbidityPlans[key];
                        if (entry) parts.push(`• ${c}: ${entry.diet.title} / ${entry.exercise.title}`);
                      });
                      if (user?.comorbidades?.includes('Outros') && user?.comorbidadeOutros) {
                        parts.push(`• Outros: ${user.comorbidadeOutros}`);
                      }
                      if (parts.length === 0) parts.push('Nenhum plano específico encontrado para as comorbidades informadas.');
                      return parts.map((p, i) => <Text key={i} style={{ color: '#444', fontSize: 13, marginBottom: 4 }}>{p}</Text>);
                    })()}
                  </View>
                  {/* Individual cards */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {(user?.comorbidades || []).map((c: string, idx: number) => {
                      const key = c === 'Outros' ? 'Outros' : c;
                      const plan = ComorbidityPlans[key];
                      return (
                        <View key={idx} style={styles.planCard}>
                          <Text style={styles.planTitle}>{c}</Text>
                          <Text style={{ color: '#444', fontSize: 13, marginBottom: 8 }}>{plan ? plan.diet.title + ' · ' + plan.exercise.title : 'Plano geral disponível'}</Text>
                          <View style={styles.planButtonGroup}>
                            <TouchableOpacity
                              style={styles.planButton}
                              onPress={() => {
                                if (plan) {
                                  setPlanDetail({ title: plan.diet.title, content: plan.diet.content, target: 'Dieta' });
                                } else {
                                  setPlanDetail({ title: 'Dieta', content: 'Recomendações gerais. Consulte profissional.', target: 'Dieta' });
                                }
                              }}
                            >
                              <Text style={styles.planButtonText}>Ver Dieta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.planButton}
                              onPress={() => {
                                if (plan) {
                                  setPlanDetail({ title: plan.exercise.title, content: plan.exercise.content, target: 'Exercicios' });
                                } else {
                                  setPlanDetail({ title: 'Exercícios', content: 'Recomendações gerais. Consulte profissional.', target: 'Exercicios' });
                                }
                              }}
                            >
                              <Text style={styles.planButtonText}>Ver Exercícios</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                    {/* If user provided 'Outros' free text and no plan entry, show it */}
                    {user?.comorbidades?.includes('Outros') && user?.comorbidadeOutros ? (
                      <View style={styles.planCard}>
                        <Text style={styles.planTitle}>Outros</Text>
                        <Text style={{ color: '#444', fontSize: 13, marginBottom: 8 }}>{user.comorbidadeOutros}</Text>
                        <View style={styles.planButtonGroup}>
                          <TouchableOpacity style={styles.planButton} onPress={() => setPlanDetail({ title: 'Outros - Dieta', content: ComorbidityPlans.Outros.diet.content, target: 'Dieta' })}>
                            <Text style={styles.planButtonText}>Ver Dieta</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.planButton} onPress={() => setPlanDetail({ title: 'Outros - Exercícios', content: ComorbidityPlans.Outros.exercise.content, target: 'Exercicios' })}>
                            <Text style={styles.planButtonText}>Ver Exercícios</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </>
              ) : (
                <Text style={[styles.cardSubtitleClean, { color: themeColors.dark, fontSize: 14 }]}>Nenhuma comorbidade informada.</Text>
              )}
            </View>
          </View>
        </View>

        {/* Modal de Detalhes */}
        <DetailModal 
          visible={!!modalVisible} 
          onClose={() => setModalVisible(null)} 
          title={modalVisible && cardDetails[modalVisible as keyof typeof cardDetails]?.title || ''}
          content={modalVisible && cardDetails[modalVisible as keyof typeof cardDetails]?.content || ''}
        />

        {/* Modal para planos por comorbidade */}
        <PlanModal
          visible={!!planDetail}
          onClose={() => setPlanDetail(null)}
          plan={planDetail}
          onNavigate={(screen: string) => {
            // persist selected comorbidades and navigate
            AsyncStorage.setItem('selectedComorbidades', JSON.stringify(user?.comorbidades || []));
            AsyncStorage.setItem('selectedComorbidadeOutros', user?.comorbidadeOutros || '');
            setPlanDetail(null);
            onNavigate && onNavigate(screen);
          }}
        />
      </Animated.View>
    </ScrollView>
  );
}

const MetricCard: React.FC<{ type: keyof typeof cardColors; value: string; subtitle: string; onPress: () => void }> = ({ type, value, subtitle, onPress }) => {
  const cardStyle = {
    ...styles.card,
    backgroundColor: cardColors[type],
    shadowColor: 'transparent',
    borderWidth: 0,
  };
  return (
    <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardContent}>
        <View style={styles.cardIconClean}>{
          type === 'peso' && <MaterialCommunityIcons name="weight-kilogram" size={32} color="#fff" style={{ backgroundColor: 'transparent' }} />
        }{
          type === 'altura' && <MaterialCommunityIcons name="human-male-height" size={32} color="#fff" style={{ backgroundColor: 'transparent' }} />
        }{
          type === 'imc' && <MaterialCommunityIcons name="calculator-variant" size={32} color="#fff" style={{ backgroundColor: 'transparent' }} />
        }{
          type === 'pesoIdeal' && <MaterialCommunityIcons name="star" size={32} color="#fff" style={{ backgroundColor: 'transparent' }} />
        }{
          type === 'dieta' && <FontAwesome5 name="utensils" size={28} color="#fff" style={{ marginBottom: 2 }} />
        }{
          type === 'exercicios' && <MaterialCommunityIcons name="run" size={28} color="#fff" style={{ marginBottom: 2 }} />
        }
        </View>
        <Text style={styles.cardValueClean}>{value}</Text>
        <Text style={styles.cardSubtitleClean}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DetailModal: React.FC<{ visible: boolean; onClose: () => void; title: string; content: string }> = ({ visible, onClose, title, content }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{content}</Text>
          <View style={styles.modalButtonGroup}>
            <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={onClose}>
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
    </Modal>
  );
};

const PlanModal: React.FC<{ visible: boolean; onClose: () => void; plan: { title: string; content: string; target?: 'Dieta' | 'Exercicios' } | null; onNavigate: (screen: string) => void }> = ({ visible, onClose, plan, onNavigate }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{plan?.title}</Text>
          <Text style={styles.modalText}>{plan?.content}</Text>
          <View style={styles.modalButtonGroup}>
            <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={onClose}>
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
            {plan?.target ? (
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondaryButton]}
                onPress={() => onNavigate(plan.target === 'Dieta' ? 'Dieta' : 'Exercicios')}
              >
                <Text style={styles.modalButtonText}>{plan.target === 'Dieta' ? 'Abrir Dieta' : 'Abrir Exercícios'}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: themeColors.light,
    width: '100%',
    maxWidth: Dimensions.get('window').width,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.white,
  },
  loadingText: {
    fontSize: 16,
    color: themeColors.dark,
  },
  header: {
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: themeColors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: themeColors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.white,
    opacity: 0.9,
  },
  section: {
    width: '100%',
    marginBottom: 24,
    backgroundColor: themeColors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: themeColors.primary,
    marginBottom: 12,
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    gap: 12,
    paddingHorizontal: 0,
  },
  card: {
    width: CARD_WIDTH,
    minWidth: 120,
    maxWidth: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    borderWidth: 0,
  },
  cardFull: {
    width: '100%',
    minHeight: 90,
    borderRadius: 16,
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    borderWidth: 0,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  cardContent: {
    alignItems: 'center',
    padding: 6,
  },
  cardIconClean: {
    marginBottom: 4,
    backgroundColor: 'transparent',
    borderRadius: 32,
    padding: 0,
  },
  cardValueClean: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 1,
    textAlign: 'center',
  },
  cardSubtitleClean: {
    fontSize: 11,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: themeColors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: themeColors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 4,
  },
  modalPrimaryButton: {
    backgroundColor: themeColors.primary,
  },
  modalSecondaryButton: {
    backgroundColor: themeColors.secondary,
  },
  modalButtonText: {
    color: themeColors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  editProfileButton: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  alertBanner: {
    width: '100%',
    backgroundColor: '#fff4f4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  alertText: {
    color: themeColors.danger,
    fontWeight: '700',
  },
  comorbidityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  comorbChip: {
    backgroundColor: themeColors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  comorbText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  advisoryText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: themeColors.dark,
    marginBottom: 8,
  },
  headerActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    marginTop: -8,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: CARD_WIDTH - 8,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  planButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  planButton: {
    backgroundColor: themeColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  planButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
