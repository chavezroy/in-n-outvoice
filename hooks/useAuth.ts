import { useState, useCallback, useEffect } from "react";
import { User } from "@/types/user";
import {
  registerUser as registerUserStorage,
  loginUser as loginUserStorage,
  logoutUser as logoutUserStorage,
  getCurrentUser,
  isAuthenticated as checkAuthenticated,
} from "@/lib/storage";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load current user on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = loginUserStorage(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = registerUserStorage(email, password, name);
        if (result.success && result.user) {
          // Auto-login after registration
          const loginResult = loginUserStorage(email, password);
          if (loginResult.success && loginResult.user) {
            setUser(loginResult.user);
          }
        } else {
          setError(result.error || "Registration failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    logoutUserStorage();
    setUser(null);
  }, []);

  return {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    isAuthenticated: checkAuthenticated(),
  };
}
