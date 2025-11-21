import React, { createContext, useContext } from 'react';

// Tipos básicos do usuário
export interface User {
  nome: string;
  altura: string; // em metros, ex: '1.75'
  peso: string;   // em kg, ex: '70'
  genero: 'masculino' | 'feminino';
}

// Usuário mock para testes
const mockUser: User = {
  nome: 'Usuário Exemplo',
  altura: '1.75',
  peso: '70',
  genero: 'masculino',
};

interface UserContextType {
  user: User;
}

const UserContext = createContext<UserContextType>({ user: mockUser });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Aqui você pode integrar lógica real de usuário
  return (
    <UserContext.Provider value={{ user: mockUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}
