import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5 } from '@expo/vector-icons';

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
  background: '#f1f3f5',
};

const HomeScreen = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  return (
    <View style={styles.container}>
      <Animatable.View animation="zoomIn" duration={800} style={styles.logoContainer}>
            <FontAwesome5 name="heartbeat" size={80} color={colors.primary} />
            <Text style={styles.brandName}>Vida Saudável</Text>
            <Text style={styles.appName}>Nutri&Fit</Text>
          </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.content}>
        <Text style={styles.title}>Seu Guia para uma Vida Mais Saudável</Text>

        <Text style={styles.subtitle}>
          O Nutri&Fit ajuda você a acompanhar seu peso, calcular seu IMC e receber sugestões personalizadas de dietas e exercícios.
        </Text>

         <TouchableOpacity
          style={styles.button}
          onPress={() => onNavigate && onNavigate('Cadastro')}
        >
          <Text style={styles.buttonText}>Começar Agora</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.info,
    marginTop: 6,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 12,
    letterSpacing: 0.6,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.info,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HomeScreen;
