import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComorbidityPlans from '../constants/ComorbidityPlans';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

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
  white: '#fff',
};

// Tipos auxiliares
interface Activity {
  name: string;
  details: string;
  icon: string;
}
interface DayPlan {
  day: string;
  activities: Activity[];
}
interface ExercisePlan {
  description: string;
  intensity: string;
  duration: string;
  focus: string;
  icon: string;
  color: string;
  week: DayPlan[];
}

const exercisePlans: Record<string, ExercisePlan> = {
  'Sedentário': {
    description: 'Plano leve para criar hábito e melhorar a saúde geral',
    intensity: 'Baixa',
    duration: '20-30 min/dia',
    focus: 'Saúde geral e mobilidade',
    icon: 'directions-walk',
    color: '#4cc9f0',
    week: [
      { day: 'Segunda', activities: [ { name: 'Caminhada leve', details: '30 minutos em ritmo confortável', icon: 'directions-walk' }, { name: 'Alongamento básico', details: '10 minutos focando em grandes grupos musculares', icon: 'self-improvement' } ] },
      { day: 'Terça', activities: [ { name: 'Yoga iniciante', details: '20 minutos de posturas básicas e respiração', icon: 'self-improvement' } ] },
      { day: 'Quarta', activities: [ { name: 'Caminhada moderada', details: '30 minutos com pequenas variações de ritmo', icon: 'directions-walk' } ] },
      { day: 'Quinta', activities: [ { name: 'Alongamento ativo', details: '15 minutos com foco em respiração e postura', icon: 'self-improvement' } ] },
      { day: 'Sexta', activities: [ { name: 'Bicicleta leve', details: '20 minutos em terreno plano', icon: 'directions-bike' } ] },
      { day: 'Sábado', activities: [ { name: 'Caminhada social', details: '30 minutos com acompanhante para motivação', icon: 'groups' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Alongamento leve ou passeio ao ar livre', icon: 'nature-people' } ] },
    ]
  },
  'Ativo': {
    description: 'Plano para quem já pratica atividades e quer manter o ritmo',
    intensity: 'Moderada',
    duration: '30-45 min/dia',
    focus: 'Manutenção e condicionamento',
    icon: 'directions-run',
    color: '#4895ef',
    week: [
      { day: 'Segunda', activities: [ { name: 'Corrida moderada', details: '40 minutos em ritmo constante (70% FCmax)', icon: 'directions-run' }, { name: 'Abdominais básicos', details: '3 séries de 15 repetições com descanso de 30s', icon: 'fitness-center' } ] },
      { day: 'Terça', activities: [ { name: 'Treino funcional', details: 'Circuito com agachamento, flexão, prancha e polichinelo (3 rounds)', icon: 'fitness-center' } ] },
      { day: 'Quarta', activities: [ { name: 'Bicicleta intervalada', details: '40 minutos alternando 2min forte / 2min leve', icon: 'directions-bike' } ] },
      { day: 'Quinta', activities: [ { name: 'Natação recreativa', details: '30 minutos alternando estilos livre e costas', icon: 'pool' } ] },
      { day: 'Sexta', activities: [ { name: 'Caminhada rápida', details: '40 minutos mantendo passos acelerados', icon: 'directions-walk' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento dinâmico', details: '15 minutos focando em flexibilidade e mobilidade', icon: 'self-improvement' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Passeio de bicicleta ou caminhada leve', icon: 'nature-people' } ] },
    ]
  },
  'Fitness': {
    description: 'Plano para quem busca evolução física e definição muscular',
    intensity: 'Alta',
    duration: '45-60 min/dia',
    focus: 'Força e hipertrofia',
    icon: 'fitness-center',
    color: '#f8961e',
    week: [
      { day: 'Segunda', activities: [ { name: 'Musculação - Superior', details: 'Supino, remada, desenvolvimento (4x10)', icon: 'fitness-center' }, { name: 'Cardio leve', details: '20 minutos de corrida ou bike (60% FCmax)', icon: 'directions-run' } ] },
      { day: 'Terça', activities: [ { name: 'Musculação - Inferior', details: 'Agachamento, leg press, stiff (4x10)', icon: 'fitness-center' } ] },
      { day: 'Quarta', activities: [ { name: 'HIIT', details: '20 minutos de sprints (30s/30s)', icon: 'directions-run' } ] },
      { day: 'Quinta', activities: [ { name: 'Musculação - Core', details: 'Prancha, abdominal, oblíquos (4x15)', icon: 'fitness-center' } ] },
      { day: 'Sexta', activities: [ { name: 'Funcional avançado', details: 'Circuito multiarticular com peso corporal', icon: 'fitness-center' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento profundo', details: '20 minutos focando em recuperação muscular', icon: 'self-improvement' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso total', details: 'Recuperação, hidratação e alimentação balanceada', icon: 'local-florist' } ] },
    ]
  },
  'Atleta Amador': {
    description: 'Plano para atletas amadores que buscam performance',
    intensity: 'Muito alta',
    duration: '60-90 min/dia',
    focus: 'Performance e resistência',
    icon: 'sports',
    color: '#f72585',
    week: [
      { day: 'Segunda', activities: [ { name: 'Treino de força', details: 'Supino, agachamento, levantamento terra (4x8-10)', icon: 'fitness-center' }, { name: 'HIIT', details: '20 minutos de sprints (400m com trote de recuperação)', icon: 'directions-run' } ] },
      { day: 'Terça', activities: [ { name: 'Corrida longa', details: '60 minutos em ritmo forte (80% FCmax)', icon: 'directions-run' } ] },
      { day: 'Quarta', activities: [ { name: 'Funcional avançado', details: 'Circuito multiarticular com carga', icon: 'fitness-center' } ] },
      { day: 'Quinta', activities: [ { name: 'Natação técnica', details: '45 minutos alternando estilos com foco em técnica', icon: 'pool' } ] },
      { day: 'Sexta', activities: [ { name: 'Musculação - Resistência', details: 'Séries com mais repetições e menos descanso', icon: 'fitness-center' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento dinâmico', details: '20 minutos focando em flexibilidade', icon: 'self-improvement' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Caminhada leve ou pedal recreativo', icon: 'nature-people' } ] },
    ]
  },
  'Atleta de Alto Rendimento': {
    description: 'Plano avançado para atletas de alta performance',
    intensity: 'Máxima',
    duration: '90-120 min/dia',
    focus: 'Performance competitiva',
    icon: 'sports-score',
    color: '#3a0ca3',
    week: [
      { day: 'Segunda', activities: [ { name: 'Força máxima', details: 'Exercícios compostos com cargas elevadas (5x5)', icon: 'fitness-center' }, { name: 'Pliometria', details: 'Saltos e exercícios de explosão muscular', icon: 'directions-run' } ] },
      { day: 'Terça', activities: [ { name: 'Corrida intervalada', details: 'Sprints de 400m com recuperação ativa', icon: 'directions-run' } ] },
      { day: 'Quarta', activities: [ { name: 'Treino técnico', details: 'Movimentos específicos do esporte principal', icon: 'sports' } ] },
      { day: 'Quinta', activities: [ { name: 'Natação intensa', details: 'Séries de tiros e trabalho de resistência', icon: 'pool' } ] },
      { day: 'Sexta', activities: [ { name: 'Musculação - Potência', details: 'Exercícios focados em explosão e velocidade', icon: 'fitness-center' } ] },
      { day: 'Sábado', activities: [ { name: 'Funcional avançado', details: 'Circuito de alta intensidade com cargas', icon: 'fitness-center' } ] },
      { day: 'Domingo', activities: [ { name: 'Recuperação ativa', details: 'Massagem, alongamento profundo e hidroterapia', icon: 'local-florist' } ] },
    ]
  }
};

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

function normalizeProfile(profile: string | undefined): string {
  if (!profile) return 'Sedentário';
  profile = profile.toLowerCase();
  if (profile.includes('amador')) return 'Atleta Amador';
  if (profile.includes('auto') || profile.includes('rendimento')) return 'Atleta de Alto Rendimento';
  if (profile.includes('ativo')) return 'Ativo';
  if (profile.includes('fitness')) return 'Fitness';
  return 'Sedentário';
}

const validMaterialIcons = [
  'fitness-center', 'directions-run', 'sports-soccer', 'pool', 'local-florist', 'directions-walk', 'self-improvement', 'park', 'groups', 'timer', 'speed', 'track-changes', 'chevron-right', 'check-circle', 'nature-people', 'sports-score', 'sports'
];
function getValidMaterialIcon(icon: string): string {
  if (validMaterialIcons.includes(icon)) return icon;
  return 'fitness-center';
}

export default function ExerciciosScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [user, setUser] = useState<any>(null);
  const [selectedComorbidades, setSelectedComorbidades] = useState<string[]>([]);
  const [selectedComorbidadeOutros, setSelectedComorbidadeOutros] = useState<string>('');
  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          setUser(parsed);
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
    loadUser();
  }, []);

  const userProfile = normalizeProfile(user?.estado);
  const plan = exercisePlans[userProfile] || exercisePlans['Sedentário'];

  // If user selected comorbidities, try to build a combined weekly exercise plan
  const combinedWeeklyExercises = React.useMemo(() => {
    if (!selectedComorbidades || selectedComorbidades.length === 0) return null;
    const weeks = selectedComorbidades
      .map((c) => (ComorbidityPlans as any)[(c === 'Outros' ? 'Outros' : c)]?.exercise?.weeklyExercise)
      .filter(Boolean);
    if (!weeks || weeks.length === 0) return null;
    const merged: Array<{ day: string; activities: Activity[] }> = [];
    for (let i = 0; i < 7; i++) {
      const dayName = weekDays[i] || `Dia ${i + 1}`;
      const activitiesMap = new Map<string, Activity>();
      weeks.forEach((w: any) => {
        const day = w[i];
        if (day && day.activities) {
          day.activities.forEach((a: any) => {
            if (!activitiesMap.has(a.name)) activitiesMap.set(a.name, { name: a.name, details: a.details, icon: 'fitness-center' });
          });
        }
      });
      merged.push({ day: dayName, activities: Array.from(activitiesMap.values()) });
    }
    return merged;
  }, [selectedComorbidades]);

  const weekSource = combinedWeeklyExercises || plan.week;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate && onNavigate('Dashboard')}>
          <MaterialIcons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <LinearGradient
          colors={[plan.color, colors.primary]}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialIcons name={getValidMaterialIcon(plan.icon) as any} size={32} color="white" />
          <Text style={styles.profileTitle}>Plano de Treino - {userProfile}</Text>
        </LinearGradient>
        <View style={styles.profileDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="speed" size={20} color={colors.dark} />
            <Text style={styles.detailText}>Intensidade: {plan.intensity}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="timer" size={20} color={colors.dark} />
            <Text style={styles.detailText}>Duração: {plan.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="track-changes" size={20} color={colors.dark} />
            <Text style={styles.detailText}>Foco: {plan.focus}</Text>
          </View>
        </View>
        <Text style={styles.description}>{plan.description}</Text>
      </Animatable.View>
      {selectedComorbidades && selectedComorbidades.length > 0 && (
        <Animatable.View animation="fadeInUp" duration={600} style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Ajustes por Comorbidade</Text>
          <Text style={{ color: colors.dark, marginBottom: 8 }}>Recomendações básicas por comorbidade (orientativas). Consulte um profissional para adaptações seguras.</Text>
          {selectedComorbidades.map((c) => {
            const key = c === 'Outros' ? 'Outros' : c;
            const entry = (ComorbidityPlans as any)[key];
            return (
              <View key={c} style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: '700', color: colors.dark }}>{c}</Text>
                <Text style={{ color: colors.dark }}>{entry ? entry.exercise.content : ComorbidityPlans.Outros.exercise.content}</Text>
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
      {weekSource.map((day: DayPlan, index: number) => (
        <Animatable.View 
          key={day.day}
          animation="fadeInUp"
          duration={600}
          delay={index * 100}
          style={styles.dayCard}
        >
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{day.day}</Text>
            <View style={[styles.dayBadge, { backgroundColor: plan.color }]}> 
              <Text style={styles.dayBadgeText}>{day.activities.length} {day.activities.length > 1 ? 'atividades' : 'atividade'}</Text>
            </View>
          </View>
          {day.activities.map((activity: Activity, activityIndex: number) => (
            <TouchableOpacity 
              key={activityIndex} 
              style={styles.activityCard}
            >
              <View style={styles.activityIcon}>
                <MaterialIcons name={getValidMaterialIcon(activity.icon) as any} size={24} color={plan.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityDetails}>{activity.details}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </Animatable.View>
      ))}
      <Animatable.View animation="fadeInUp" delay={700} style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Dicas para seu treino</Text>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={18} color={colors.success} />
          <Text style={styles.tipText}>Mantenha-se hidratado durante os exercícios</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={18} color={colors.success} />
          <Text style={styles.tipText}>Respeite os períodos de descanso</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={18} color={colors.success} />
          <Text style={styles.tipText}>Aqueça por 5-10 minutos antes de começar</Text>
        </View>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: colors.light,
  },
  header: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
    paddingLeft: 64,
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
  profileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 12,
  },
  profileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  detailText: {
    fontSize: 13,
    color: colors.dark,
    marginLeft: 6,
  },
  description: {
    fontSize: 15,
    color: colors.dark,
    padding: 16,
    paddingTop: 0,
    lineHeight: 22,
  },
  dayCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  dayBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 13,
    color: colors.info,
  },
  tipsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
    flex: 1,
  },
});
