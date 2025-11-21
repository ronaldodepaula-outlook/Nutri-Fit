import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const r = await AsyncStorage.getItem('selectedRecipe');
      if (r) setRecipe(JSON.parse(r));
    };
    load();
  }, []);

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Receita</Text>
        <Text>Selecione uma receita para ver os detalhes.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {recipe.ingredients.map((ing: string, idx: number) => (
          <Text key={idx} style={styles.listItem}>• {ing}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de Preparo</Text>
        {recipe.steps.map((s: string, idx: number) => (
          <Text key={idx} style={styles.listItem}>{idx + 1}. {s}</Text>
        ))}
      </View>

      {recipe.heating ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aquecer / Tempo de Forno</Text>
          {recipe.heating.oven ? <Text style={styles.listItem}>Forno: {recipe.heating.oven}</Text> : null}
          {recipe.heating.airfryer ? <Text style={styles.listItem}>Airfryer: {recipe.heating.airfryer}</Text> : null}
          {recipe.heating.microwave ? <Text style={styles.listItem}>Micro-ondas: {recipe.heating.microwave}</Text> : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => onNavigate && onNavigate('Dieta')}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 14, color: '#444', marginBottom: 12 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  listItem: { fontSize: 14, color: '#333', marginBottom: 6 },
  actions: { marginTop: 12, alignItems: 'flex-start' },
  button: { backgroundColor: '#4361ee', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
