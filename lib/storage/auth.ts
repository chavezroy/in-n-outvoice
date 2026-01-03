import { User } from "@/types/user";
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from "./utils";

/**
 * Simple password hashing (for MVP - use proper hashing in production)
 */
function hashPassword(password: string): string {
  // Simple hash for MVP - in production, use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Register a new user
 */
export function registerUser(
  email: string,
  password: string,
  name?: string
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "User with this email already exists" };
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store user with hashed password
  const userWithPassword = {
    ...newUser,
    passwordHash: hashPassword(password),
  };

  users.push(userWithPassword);
  setStorageItem(STORAGE_KEYS.USERS, users);

  // Auto-login after registration
  setStorageItem(STORAGE_KEYS.CURRENT_USER, newUser.id);

  return { success: true, user: newUser };
}

/**
 * Login a user
 */
export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const passwordHash = hashPassword(password);
  if ((user as any).passwordHash !== passwordHash) {
    return { success: false, error: "Invalid email or password" };
  }

  // Set current user
  setStorageItem(STORAGE_KEYS.CURRENT_USER, user.id);

  // Return user without password hash
  const { passwordHash: _, ...userWithoutPassword } = user as any;
  return { success: true, user: userWithoutPassword as User };
}

/**
 * Logout current user
 */
export function logoutUser(): void {
  removeStorageItem(STORAGE_KEYS.CURRENT_USER);
}

/**
 * Get current logged-in user
 */
export function getCurrentUser(): User | null {
  const userId = getStorageItem<string>(STORAGE_KEYS.CURRENT_USER);
  if (!userId) return null;

  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  
  if (!user) return null;
  
  // Return user without password hash
  const { passwordHash: _, ...userWithoutPassword } = user as any;
  return userWithoutPassword as User;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Get all users (for internal use)
 */
function getUsers(): any[] {
  return getStorageItem<any[]>(STORAGE_KEYS.USERS) || [];
}

