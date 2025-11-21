import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComorbidityPlans from '../constants/ComorbidityPlans';
import Recipes from '../constants/Recipes';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const colors = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  success: '#4cc9f0',
  warning: '#f8961e',
  danger: '#f72585',
  light: '#f8f9fa',
  dark: '#212529',
  info: '#577590',
  white: '#ffffff',
};

const dietModels = {
  gain: {
    title: 'Dieta para Ganho de Peso',
    color: colors.success,
    icon: 'trending-up',
    description: 'Foque em refeições hipercalóricas, ricas em proteínas, carboidratos complexos e gorduras saudáveis. Inclua ovos, frango, arroz, batata-doce, azeite, abacate, castanhas e shakes nutritivos. Faça 5-6 refeições ao dia.',
    tips: [
      'Consuma proteína em todas as refeições',
      'Adicione gorduras saudáveis como azeite e castanhas',
      'Beba líquidos entre as refeições para não reduzir o apetite'
    ]
  },
  maintenance: {
    title: 'Dieta de Manutenção',
    color: colors.primary,
    icon: 'trending-neutral',
    description: 'Mantenha uma alimentação equilibrada, com variedade de legumes, verduras, frutas, proteínas magras e carboidratos integrais. Evite ultraprocessados e mantenha hidratação adequada.',
    tips: [
      'Varie os alimentos para garantir todos os nutrientes',
      'Mantenha horários regulares para as refeições',
      'Combine proteínas com carboidratos em cada refeição'
    ]
  },
  lightDeficit: {
    title: 'Dieta Leve para Emagrecimento',
    color: colors.warning,
    icon: 'trending-down',
    description: 'Reduza levemente as calorias, priorize vegetais, proteínas magras (frango, peixe, ovos), carboidratos integrais e gorduras boas. Evite frituras, doces e refrigerantes. Faça pequenas refeições ao longo do dia.',
    tips: [
      'Aumente o consumo de fibras para saciedade',
      'Prefira alimentos integrais aos refinados',
      'Mantenha-se hidratado para controlar a fome'
    ]
  },
  loss: {
    title: 'Dieta para Perda de Peso',
    color: colors.danger,
    icon: 'fire',
    description: 'Adote déficit calórico moderado, aumente o consumo de fibras, vegetais e proteínas. Evite açúcares, farinhas refinadas e alimentos industrializados. Considere acompanhamento nutricional.',
    tips: [
      'Priorize proteínas magras para preservar massa muscular',
      'Reduza gradualmente o tamanho das porções',
      'Planeje as refeições com antecedência para evitar deslizes'
    ]
  }
};

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const weeklyMenus = {
  gain: [
    { breakfast: ['Ovos mexidos com queijo', 'Pão integral', 'Vitamina de banana'], lunch: ['Arroz integral', 'Frango grelhado', 'Batata-doce'], dinner: ['Macarrão integral', 'Carne moída', 'Brócolis'] },
    { breakfast: ['Panqueca de aveia', 'Iogurte', 'Frutas'], lunch: ['Arroz', 'Peito de frango', 'Salada de abacate'], dinner: ['Quinoa', 'Ovos cozidos', 'Espinafre'] },
    { breakfast: ['Ovos mexidos', 'Tapioca', 'Mamão'], lunch: ['Arroz integral', 'Feijão', 'Frango grelhado'], dinner: ['Batata-doce', 'Atum', 'Salada'] },
    { breakfast: ['Pão integral', 'Queijo branco', 'Suco de laranja'], lunch: ['Macarrão integral', 'Carne moída', 'Brócolis'], dinner: ['Arroz', 'Ovos mexidos', 'Tomate'] },
    { breakfast: ['Ovos mexidos', 'Banana', 'Granola'], lunch: ['Arroz integral', 'Frango grelhado', 'Batata-doce'], dinner: ['Quinoa', 'Carne moída', 'Espinafre'] },
    { breakfast: ['Tapioca', 'Queijo', 'Vitamina de frutas'], lunch: ['Arroz', 'Peito de frango', 'Salada'], dinner: ['Batata-doce', 'Ovos cozidos', 'Brócolis'] },
    { breakfast: ['Ovos mexidos', 'Pão integral', 'Mamão'], lunch: ['Arroz integral', 'Frango grelhado', 'Batata-doce'], dinner: ['Macarrão integral', 'Carne moída', 'Brócolis'] },
  ],
  maintenance: [
    { breakfast: ['Iogurte natural', 'Granola', 'Frutas'], lunch: ['Quinoa', 'Peito de frango', 'Legumes'], dinner: ['Salmão', 'Purê de batata-doce', 'Aspargos'] },
    { breakfast: ['Pão integral', 'Queijo branco', 'Suco'], lunch: ['Arroz', 'Carne magra', 'Salada'], dinner: ['Omelete', 'Espinafre', 'Tomate'] },
    { breakfast: ['Ovos cozidos', 'Mamão', 'Granola'], lunch: ['Quinoa', 'Peito de frango', 'Legumes'], dinner: ['Salmão', 'Batata-doce', 'Aspargos'] },
    { breakfast: ['Iogurte', 'Frutas', 'Aveia'], lunch: ['Arroz', 'Carne magra', 'Salada'], dinner: ['Omelete', 'Espinafre', 'Tomate'] },
    { breakfast: ['Pão integral', 'Queijo', 'Suco'], lunch: ['Quinoa', 'Peito de frango', 'Legumes'], dinner: ['Salmão', 'Purê de batata-doce', 'Aspargos'] },
    { breakfast: ['Ovos mexidos', 'Mamão', 'Granola'], lunch: ['Arroz', 'Carne magra', 'Salada'], dinner: ['Omelete', 'Espinafre', 'Tomate'] },
    { breakfast: ['Iogurte', 'Frutas', 'Aveia'], lunch: ['Quinoa', 'Peito de frango', 'Legumes'], dinner: ['Salmão', 'Batata-doce', 'Aspargos'] },
  ],
  lightDeficit: [
    { breakfast: ['Omelete de claras', 'Pão integral', 'Tomate'], lunch: ['Arroz integral', 'Peixe grelhado', 'Legumes'], dinner: ['Sopa de legumes', 'Frango desfiado'] },
    { breakfast: ['Iogurte light', 'Mamão', 'Granola'], lunch: ['Quinoa', 'Peito de frango', 'Salada'], dinner: ['Omelete de claras', 'Espinafre', 'Tomate'] },
    { breakfast: ['Ovo cozido', 'Torrada integral', 'Chá verde'], lunch: ['Arroz integral', 'Peixe grelhado', 'Legumes'], dinner: ['Sopa de legumes', 'Frango desfiado'] },
    { breakfast: ['Omelete de claras', 'Pão integral', 'Tomate'], lunch: ['Quinoa', 'Peito de frango', 'Salada'], dinner: ['Omelete de claras', 'Espinafre', 'Tomate'] },
    { breakfast: ['Iogurte light', 'Mamão', 'Granola'], lunch: ['Arroz integral', 'Peixe grelhado', 'Legumes'], dinner: ['Sopa de legumes', 'Frango desfiado'] },
    { breakfast: ['Ovo cozido', 'Torrada integral', 'Chá verde'], lunch: ['Quinoa', 'Peito de frango', 'Salada'], dinner: ['Omelete de claras', 'Espinafre', 'Tomate'] },
    { breakfast: ['Omelete de claras', 'Pão integral', 'Tomate'], lunch: ['Arroz integral', 'Peixe grelhado', 'Legumes'], dinner: ['Sopa de legumes', 'Frango desfiado'] },
  ],
  loss: [
    { breakfast: ['Chá verde', 'Ovo cozido', 'Torrada integral'], lunch: ['Salada de folhas', 'Peito de frango', 'Quinoa'], dinner: ['Sopa de legumes', 'Omelete de claras'] },
    { breakfast: ['Iogurte light', 'Mamão', 'Granola'], lunch: ['Quinoa', 'Peito de frango', 'Salada'], dinner: ['Omelete de claras', 'Espinafre', 'Tomate'] },
    { breakfast: ['Ovo cozido', 'Torrada integral', 'Chá verde'], lunch: ['Salada de folhas', 'Peito de frango', 'Quinoa'], dinner: ['Sopa de legumes', 'Omelete de claras'] },
    { breakfast: ['Chá verde', 'Ovo cozido', 'Torrada integral'], lunch: ['Quinoa', 'Peito de frango', 'Salada'], dinner: ['Omelete de claras', 'Espinafre', 'Tomate'] },
    { breakfast: ['Iogurte light', 'Mamão', 'Granola'], lunch: ['Salada de folhas', 'Peito de frango', 'Quinoa'], dinner: ['Sopa de legumes', 'Omelete de claras'] },
    { breakfast: ['Ovo cozido', 'Torrada integral', 'Chá verde'], lunch: ['Quinoa', 'Peito de frango', 'Salada'], dinner: ['Omelete de claras', 'Espinafre', 'Tomate'] },
    { breakfast: ['Chá verde', 'Ovo cozido', 'Torrada integral'], lunch: ['Salada de folhas', 'Peito de frango', 'Quinoa'], dinner: ['Sopa de legumes', 'Omelete de claras'] },
  ],
};

export default function DietaScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [user, setUser] = useState<any>(null);
  const [selectedComorbidades, setSelectedComorbidades] = useState<string[]>([]);
  const [selectedComorbidadeOutros, setSelectedComorbidadeOutros] = useState<string>('');
  const [activeDay, setActiveDay] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    loadUser();
  }, []);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        // Prefer user's own comorbidity flags stored in the profile
        if (parsed.hasComorbidities) {
          setSelectedComorbidades(parsed.comorbidades || []);
          setSelectedComorbidadeOutros(parsed.comorbidadeOutros || '');
        } else {
          setSelectedComorbidades([]);
          setSelectedComorbidadeOutros('');
        }
      } catch (e) {
        setUser(null);
        setSelectedComorbidades([]);
        setSelectedComorbidadeOutros('');
      }
    }
  };


  const { imc, idealWeight, dietType } = useMemo(() => {
    if (!user) return { imc: null, idealWeight: null, dietType: null };
    const height = parseFloat(user.altura.replace(',', '.'));
    const weight = parseFloat(user.peso.replace(',', '.'));
    if (!height || !weight) return { imc: null, idealWeight: null, dietType: null };
    const imcValue = weight / (height * height);
    const idealWeightValue = user.genero === 'feminino' 
      ? 21.5 * (height * height) 
      : 23.5 * (height * height);
    let dietType: keyof typeof dietModels = 'maintenance';
    if (imcValue < 18.5 || weight < idealWeightValue * 0.97) {
      dietType = 'gain';
    } else if (imcValue < 25 && weight >= idealWeightValue * 0.97 && weight <= idealWeightValue * 1.03) {
      dietType = 'maintenance';
    } else if (imcValue < 30 || weight < idealWeightValue * 1.15) {
      dietType = 'lightDeficit';
    } else {
      dietType = 'loss';
    }
    return { imc: imcValue, idealWeight: idealWeightValue, dietType };
  }, [user]);

  // If user has comorbidities and there are weekly menus for them, merge into a combined menu
  const combinedWeeklyMenu = useMemo(() => {
    if (!selectedComorbidades || selectedComorbidades.length === 0) return null;
    const menus = selectedComorbidades.map((c) => (ComorbidityPlans as any)[(c === 'Outros' ? 'Outros' : c)]?.diet?.weeklyMenu).filter(Boolean);
    if (!menus || menus.length === 0) return null;
    const merged: Array<{ breakfast: string[]; lunch: string[]; dinner: string[] }> = [];
    for (let i = 0; i < 7; i++) {
      const breakfastSet = new Set<string>();
      const lunchSet = new Set<string>();
      const dinnerSet = new Set<string>();
      menus.forEach((m: any) => {
        const day = m[i];
        if (day) {
          (day.breakfast || []).forEach((it: string) => breakfastSet.add(it));
          (day.lunch || []).forEach((it: string) => lunchSet.add(it));
          (day.dinner || []).forEach((it: string) => dinnerSet.add(it));
        }
      });
      merged.push({ breakfast: Array.from(breakfastSet).slice(0, 8), lunch: Array.from(lunchSet).slice(0, 8), dinner: Array.from(dinnerSet).slice(0, 8) });
    }
    return merged;
  }, [selectedComorbidades]);

  if (!user || !dietType) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plano de Dieta</Text>
        <Text style={styles.text}>Preencha seus dados para receber uma sugestão personalizada.</Text>
      </View>
    );
  }

  const model = dietModels[dietType];

  const todayMenu = combinedWeeklyMenu ? combinedWeeklyMenu[activeDay] : (weeklyMenus[dietType][activeDay] || weeklyMenus[dietType][0]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={[model.color, colors.primary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate && onNavigate('Dashboard')}>
            <MaterialIcons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <FontAwesome5 name={model.icon as any} size={32} color="white" />
          <Text style={styles.headerTitle}>{model.title}</Text>
          <Text style={styles.headerSubtitle}>Plano alimentar personalizado</Text>
        </LinearGradient>
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          style={styles.summaryCard}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <MaterialIcons name="speed" size={24} color={colors.dark} />
              <Text style={styles.summaryLabel}>Seu IMC</Text>
              <Text style={styles.summaryValue}>{imc?.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialIcons name="star" size={24} color={colors.dark} />
              <Text style={styles.summaryLabel}>Peso Ideal</Text>
              <Text style={styles.summaryValue}>{idealWeight?.toFixed(1)} kg</Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>{model.description}</Text>
        </Animatable.View>
        {selectedComorbidades && selectedComorbidades.length > 0 && (
          <Animatable.View animation="fadeInUp" duration={600} delay={80} style={styles.tipsCard}>
            <Text style={styles.sectionTitle}>Planos por Comorbidade</Text>
            <Text style={{ color: colors.dark, marginBottom: 8 }}>Abaixo estão recomendações básicas por comorbidade. Elas são orientativas — procure sempre um profissional de saúde para adaptações individuais.</Text>
            {selectedComorbidades.map((c) => {
              const key = c === 'Outros' ? 'Outros' : c;
              const entry = (ComorbidityPlans as any)[key];
              return (
                <View key={c} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: '700', color: colors.dark }}>{c}</Text>
                  <Text style={{ color: colors.dark }}>{entry ? entry.diet.content : ComorbidityPlans.Outros.diet.content}</Text>
                  {/* Show today's menu for this comorbidity if available */}
                  {entry?.diet?.weeklyMenu ? (
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ fontWeight: '600' }}>Cardápio ({weekDays[activeDay]})</Text>
                      <View style={{ marginTop: 4 }}>
                        {(entry.diet.weeklyMenu[activeDay].breakfast || []).map((it: string, i: number) => (
                          <Text key={`b-${i}`} style={{ color: colors.dark, fontSize: 13 }}>• {it}</Text>
                        ))}
                        {(entry.diet.weeklyMenu[activeDay].lunch || []).map((it: string, i: number) => (
                          <Text key={`l-${i}`} style={{ color: colors.dark, fontSize: 13 }}>• {it}</Text>
                        ))}
                        {(entry.diet.weeklyMenu[activeDay].dinner || []).map((it: string, i: number) => (
                          <Text key={`d-${i}`} style={{ color: colors.dark, fontSize: 13 }}>• {it}</Text>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
            {selectedComorbidadeOutros ? (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: '700' }}>Observação (Outros)</Text>
                <Text>{selectedComorbidadeOutros}</Text>
              </View>
            ) : null}
          </Animatable.View>
        )}
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          delay={100}
          style={styles.tipsCard}
        >
          <Text style={styles.sectionTitle}>Dicas Nutricionais</Text>
          {model.tips.map((tip, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tipItem}
              onPress={() => setExpandedTip(expandedTip === index ? null : index)}
            >
              <MaterialIcons 
                name={expandedTip === index ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} 
                size={24} 
                color={model.color} 
              />
              <Text style={styles.tipText} numberOfLines={expandedTip === index ? undefined : 1}>
                {tip}
              </Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          delay={200}
          style={styles.menuCard}
        >
          <Text style={styles.sectionTitle}>Cardápio Semanal</Text>
          {combinedWeeklyMenu ? (
            <Text style={{ color: colors.dark, marginBottom: 8 }}>Menu combinado adaptado para: {selectedComorbidades.join(', ')}. Use o seletor para ver o cardápio diário correspondente.</Text>
          ) : null}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          >
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  activeDay === index && { backgroundColor: model.color }
                ]}
                onPress={() => setActiveDay(index)}
              >
                <Text style={[
                  styles.dayButtonText,
                  activeDay === index && { color: 'white' }
                ]}>
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.mealsContainer}>
            <View style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <MaterialIcons name="free-breakfast" size={20} color={model.color} />
                <Text style={styles.mealTitle}>Café da Manhã</Text>
              </View>
              {todayMenu.breakfast.map((item, index) => (
                <View key={index} style={styles.mealItem}>
                  <View style={[styles.bullet, { backgroundColor: model.color }]} />
                  <Text style={styles.mealText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <MaterialIcons name="lunch-dining" size={20} color={model.color} />
                <Text style={styles.mealTitle}>Almoço</Text>
              </View>
              {todayMenu.lunch.map((item, index) => (
                <View key={index} style={styles.mealItem}>
                  <View style={[styles.bullet, { backgroundColor: model.color }]} />
                  <Text style={styles.mealText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <MaterialIcons name="dinner-dining" size={20} color={model.color} />
                <Text style={styles.mealTitle}>Jantar</Text>
              </View>
              {todayMenu.dinner.map((item, index) => (
                <View key={index} style={styles.mealItem}>
                  <View style={[styles.bullet, { backgroundColor: model.color }]} />
                  <Text style={styles.mealText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animatable.View>
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          delay={300}
          style={styles.recipesCard}
        >
          <Text style={styles.sectionTitle}>Receitas Recomendadas</Text>
          {/** Build recommended recipes based on dietType and selected comorbidities */}
          {(function renderRecipes() {
            const recommended = Recipes.filter(r => {
              const tags = r.tags || [];
              if (tags.includes(dietType)) return true;
              for (const sc of selectedComorbidades) {
                if (tags.includes(sc)) return true;
              }
              // fallback: show recipes tagged 'maintenance' or without tags
              if (tags.length === 0 || tags.includes('maintenance')) return true;
              return false;
            }).slice(0, 6);

            return recommended.map((rec) => (
              <TouchableOpacity
                key={rec.id}
                style={styles.recipeItem}
                onPress={async () => {
                  await AsyncStorage.setItem('selectedRecipe', JSON.stringify(rec));
                  onNavigate && onNavigate('Recipe');
                }}
              >
                <MaterialIcons name="restaurant" size={20} color={model.color} />
                <Text style={styles.recipeTitle}>{rec.title}</Text>
                <Text style={styles.recipeDesc}>{rec.description}</Text>
              </TouchableOpacity>
            ));
          })()}
        </Animatable.View>
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
    paddingLeft: 64,
    alignItems: 'center',
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
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.dark,
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.dark,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  tipsCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  tipText: {
    fontSize: 15,
    color: colors.dark,
    marginLeft: 8,
    flex: 1,
  },
  menuCard: {
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
  daySelector: {
    paddingBottom: 12,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.light,
  },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 20,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  mealsContainer: {
    marginTop: 12,
  },
  mealSection: {
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 8,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 8,
  },
  mealText: {
    fontSize: 15,
    color: colors.dark,
    flex: 1,
  },
  recipesCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  recipeItem: {
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 28,
    marginTop: -20,
    marginBottom: 4,
  },
  recipeDesc: {
    fontSize: 14,
    color: colors.info,
    marginLeft: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: colors.dark,
  },
});
