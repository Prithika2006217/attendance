import React, { createContext, useContext, useState, useEffect } from "react";
import { apiUrl, authFetch } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student" | "mentor" | "hod";
  departmentId?: string;
  rollNumber?: string;
  subjects?: string[];
  faculty_department_sections?: Array<{ department_code: string; section_name: string }>;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: true } | { success: false; error: string }>;
  logout: () => void;
  switchRole: (role: "admin" | "faculty" | "student" | "mentor" | "hod") => void;
  /** Merge into the logged-in session (e.g. after profile email/name update). */
  updateSessionUser: (updates: Partial<Pick<User, "email" | "name">>) => void;
  isLoading: boolean;
  permissions: string[];
  accessibleTabs: string[];
  hasPermission: (permission: string) => boolean;
  hasTabAccess: (tab: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [accessibleTabs, setAccessibleTabs] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("attendanceUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      refreshPermissionsForUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const refreshPermissionsForUser = async (currentUser: User | null) => {
    if (!currentUser) {
      setPermissions([]);
      setAccessibleTabs([]);
      return;
    }

    try {
      const token = currentUser.accessToken || localStorage.getItem('accessToken');
      const response = await fetch(apiUrl("/api/user-permissions-summary/"), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions || []);
        setAccessibleTabs(data.accessible_tabs || []);
      }
    } catch (error) {
      console.error("Failed to load permissions:", error);
      setPermissions([]);
      setAccessibleTabs([]);
    }
  };

  const refreshPermissions = async () => {
    await refreshPermissionsForUser(user);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasTabAccess = (tab: string): boolean => {
    return accessibleTabs.includes(tab);
  };

  // 🔥 LOGIN CONNECTED TO DJANGO WITH JWT TOKENS
const login = async (
  email: string,
  password: string
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    console.log("Login attempt started");
    const response = await fetch(apiUrl("/api/login/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json().catch(() => ({}));
    console.log("Login response status:", response.status);

    if (!response.ok) {
      const message = getFirstError(data);
      console.error("Login failed:", message);
      return { success: false, error: message };
    }

    const loggedUser: User = {
      id: data.id != null ? String(data.id) : data.username,
      name: data.full_name || data.username,
      email: data.email,
      role: data.role,
      departmentId: data.department ?? "",
      rollNumber: data.username,
      faculty_department_sections: data.faculty_department_sections || [],
      accessToken: data.access,
      refreshToken: data.refresh,
    };

    console.log("Login successful, storing tokens. Auto-detected role:", data.role);
    setUser(loggedUser);
    localStorage.setItem("attendanceUser", JSON.stringify(loggedUser));
    
    // Load permissions after successful login
    await refreshPermissionsForUser(loggedUser);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error. Is the backend running?" };
  }
};

function getFirstError(data: Record<string, unknown>): string {
  if (!data || typeof data !== "object") return "Invalid credentials.";
  const key = Object.keys(data)[0];
  if (!key) return "Invalid credentials.";
  const val = data[key];
  if (Array.isArray(val) && val.length) return String(val[0]);
  if (typeof val === "string") return val;
  return "Invalid credentials.";
}



  const logout = () => {
    setUser(null);
    setPermissions([]);
    setAccessibleTabs([]);
    localStorage.removeItem("attendanceUser");
  };

  const updateSessionUser = (updates: Partial<Pick<User, "email" | "name">>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      localStorage.setItem("attendanceUser", JSON.stringify(next));
      return next;
    });
  };

  // Temporary demo role switch (optional)
  const switchRole = (role: "admin" | "faculty" | "student" | "mentor" | "hod") => {
    let demoUser: User;

    switch (role) {
      case "admin":
        demoUser = {
          id: "admin1",
          name: "System Administrator",
          email: "admin@university.edu",
          role: "admin",
        };
        break;
      case "faculty":
        demoUser = {
          id: "fac1",
          name: "Dr. Faculty",
          email: "faculty@university.edu",
          role: "faculty",
        };
        break;
      case "mentor":
        demoUser = {
          id: "mentor1",
          name: "Demo Mentor",
          email: "mentor@university.edu",
          role: "mentor",
        };
        break;
      case "hod":
        demoUser = {
          id: "hod1",
          name: "HOD",
          email: "hod@university.edu",
          role: "hod",
        };
        break;
      case "student":
      default:
        demoUser = {
          id: "std1",
          name: "Demo Student",
          email: "demo@student.edu",
          role: "student",
        };
        break;
    }

    setUser(demoUser);
    localStorage.setItem("attendanceUser", JSON.stringify(demoUser));
    refreshPermissionsForUser(demoUser);
  };

  const value = {
    user,
    login,
    logout,
    switchRole,
    updateSessionUser,
    isLoading,
    permissions,
    accessibleTabs,
    hasPermission,
    hasTabAccess,
    refreshPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
