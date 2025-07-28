import { AuthFormData, AuthResponse } from "../types/auth";

export async function REGISTER_USER(formData: AuthFormData): Promise<AuthResponse> {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/register`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    throw new Error(data.error || 'Registration failed');
  } catch (err) {
    console.error("Failed to register user:", err);
    throw err;
  }
}

export async function LOGIN_USER(formData: Omit<AuthFormData, 'name'>): Promise<AuthResponse> {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    throw new Error(data.error || 'Login failed');
  } catch (err) {
    console.error("Failed to login user:", err);
    throw err;
  }
}

export async function fetchExpenseCategorySummary() {
  const token = localStorage.getItem("expToken");
  const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/categories/summary`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch expense summary');
  return data.data;
}

export async function fetchIncomeCategorySummary() {
  const token = localStorage.getItem("expToken");
  const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/income/categories/summary`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch income summary');
  return data.data;
}

export async function fetchExpenseMonthlySummary() {
  const token = localStorage.getItem("expToken");
  const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/monthly/summary`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch expense monthly summary');
  return data.data;
}

export async function fetchIncomeMonthlySummary() {
  const token = localStorage.getItem("expToken");
  const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/income/monthly/summary`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch income monthly summary');
  return data.data;
}

export async function fetchRecentExpenses() {
  const token = localStorage.getItem("expToken");
  const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/recent`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch recent expenses');
  return data.data;
}