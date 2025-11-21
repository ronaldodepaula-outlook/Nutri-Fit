import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';
import HomeScreen from './src/screens/HomeScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DietaScreen from './src/screens/DietaScreen';
import ExerciciosScreen from './src/screens/ExerciciosScreen';
import PesagemScreen from './src/screens/PesagemScreen';
import ConfiguracoesScreen from './src/screens/ConfiguracoesScreen';
import NutricionistaScreen from './src/screens/NutricionistaScreen';
import imc from './src/screens/imc';
import SideMenu from './src/components/SideMenu';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const headerColors: Record<string, string> = {
  Home: '#4361ee',
  Cadastro: '#3f37c9',
  Dashboard: '#4cc9f0',
  Dieta: '#f8961e',
  Exercicios: '#4895ef',
  Pesagem: '#f72585',
  Configuracoes: '#4361ee',
  Nutricionista: '#388e3c',
};

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [screen, setScreen] = useState('Home');
  const [registered, setRegistered] = useState(false);

  let ScreenComponent = HomeScreen;
  let screenProps = {};
  if (screen === 'Cadastro') ScreenComponent = CadastroScreen;
  if (screen === 'Dashboard') ScreenComponent = DashboardScreen;
  if (screen === 'Dashboard') screenProps = { onNavigate: setScreen };
  if (screen === 'Home') screenProps = { onNavigate: setScreen };
  if (screen === 'Cadastro') screenProps = { onNavigate: setScreen };
  if (screen === 'Dieta') screenProps = {};
  if (screen === 'Dieta') ScreenComponent = DietaScreen;
  if (screen === 'Dieta') screenProps = { onNavigate: setScreen };
  // Pass onNavigate to Recipe screen (defined dynamically)
  if (screen === 'Exercicios') screenProps = {};
  if (screen === 'Exercicios') ScreenComponent = ExerciciosScreen;
  if (screen === 'Exercicios') screenProps = { onNavigate: setScreen };
  if (screen === 'Recipe') screenProps = { onNavigate: setScreen };
  if (screen === 'Recipe') ScreenComponent = require('./src/screens/RecipeScreen').default;
  if (screen === 'Pessagem') screenProps = {};
  if (screen === 'Pesagem') ScreenComponent = PesagemScreen;
  if (screen === 'Configuracoes') screenProps = {};
  if (screen === 'Configuracoes') ScreenComponent = ConfiguracoesScreen;
  if (screen === 'Nutricionista') screenProps = {};
  if (screen === 'Nutricionista') ScreenComponent = NutricionistaScreen;
  if (screen === 'imc') screenProps = { onNavigate: setScreen };
  if (screen === 'imc') ScreenComponent = imc;

  const headerBg = headerColors[screen] || '#4361ee';

  // On mount, check whether user profile exists and appears filled.
  useEffect(() => {
    const check = async () => {
      try {
        const u = await AsyncStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u);
          const isRegistered = !!(parsed && parsed.nome && parsed.altura && parsed.peso);
          setRegistered(isRegistered);
          setScreen(isRegistered ? 'Dashboard' : 'Home');
          return;
        }
      } catch (e) {
        // ignore and leave on Home
      }
      setRegistered(false);
      setScreen('Home');
    };
    check();
  }, []);

  // Whenever screen changes, re-check registration so menu becomes available after signup
  useEffect(() => {
    const check = async () => {
      try {
        const u = await AsyncStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u);
          setRegistered(!!(parsed && parsed.nome && parsed.altura && parsed.peso));
        } else {
          setRegistered(false);
        }
      } catch (e) {
        setRegistered(false);
      }
    };
    check();
  }, [screen]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: headerBg }}>
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={[styles.header, { backgroundColor: headerBg }]}> 
          {registered ? (
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <MaterialIcons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.menuButton} />
          )}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{screen}</Text>
          </View>
        </View>
        <ScreenComponent {...screenProps} />
        <SideMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onNavigate={setScreen}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 38,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  menuButton: {
    marginRight: 10,
    padding: 8,
  },
  menuIcon: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 38,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
