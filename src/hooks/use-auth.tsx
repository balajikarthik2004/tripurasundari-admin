import * as React from 'react'

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  user: string | null;
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(() => {
    return localStorage.getItem('temple_user')
  })

  const login = React.useCallback((username: string) => {
    localStorage.setItem('temple_user', username)
    setUser(username)
  }, [])

  const logout = React.useCallback(() => {
    localStorage.removeItem('temple_user')
    setUser(null)
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
