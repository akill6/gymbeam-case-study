import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Automatické obnovenie relácie z úložiska localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Funkcia prihlásenia
  const login = (username) => {
    const newUser = { name: username };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    router.push("/products");
  };

  // Výstupná funkcia
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Háčik na rýchly prístup ku kontextu
export const useAuth = () => useContext(AuthContext);

