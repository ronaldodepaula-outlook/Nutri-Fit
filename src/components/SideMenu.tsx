import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

// Adiciona Pesagem ao menu lateral
const menuItems = [
  { label: 'Início', screen: 'Home', icon: <FontAwesome5 name="home" size={18} color="#4361ee" style={{ marginRight: 10 }} /> },
  { label: 'Cadastro', screen: 'Cadastro', icon: <MaterialIcons name="person-outline" size={20} color="#3f37c9" style={{ marginRight: 10 }} /> },
  { label: 'Dashboard', screen: 'Dashboard', icon: <FontAwesome5 name="chart-bar" size={18} color="#4cc9f0" style={{ marginRight: 10 }} /> },
  { label: 'Dieta', screen: 'Dieta', icon: <MaterialIcons name="restaurant" size={20} color="#f8961e" style={{ marginRight: 10 }} /> },
  { label: 'Exercícios', screen: 'Exercicios', icon: <MaterialIcons name="fitness-center" size={20} color="#4895ef" style={{ marginRight: 10 }} /> },
  { label: 'Pesagem', screen: 'Pesagem', icon: <MaterialIcons name="monitor-weight" size={20} color="#f72585" style={{ marginRight: 10 }} /> },
  { label: 'Nutricionista', screen: 'Nutricionista', icon: <FontAwesome5 name="user-md" size={20} color="#388e3c" style={{ marginRight: 10 }} /> },
  { label: 'IMC', screen: 'imc', icon: <MaterialIcons name="calculate" size={20} color="#577590" style={{ marginRight: 10 }} /> },
  { label: 'Configurações', screen: 'Configuracoes', icon: <MaterialIcons name="settings" size={20} color="#4361ee" style={{ marginRight: 10 }} /> },
];

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, onNavigate }) => {
  if (!visible) return null;
  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.menu}>
        <Text style={styles.title}>Menu</Text>
        <View style={{ marginTop: 32 }}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.screen} style={styles.item} onPress={() => { onNavigate(item.screen); onClose(); }}>
              {item.icon}
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  menu: {
    width: 230,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 18,
    color: '#4361ee',
    alignSelf: 'center',
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    borderRadius: 6,
    marginBottom: 2,
    paddingLeft: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default SideMenu;
