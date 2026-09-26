"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/services/api";
import type { Company } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY_ACTIVE = "bizia_active_company_id";

export function cleanCompanyName(name?: string | null): string {
  if (!name || typeof name !== "string") return "Mon Entreprise";
  let cleaned = name.trim();
  while (/^entreprise\s+entreprise/i.test(cleaned)) {
    cleaned = cleaned.replace(/^entreprise\s+/i, "");
  }
  return cleaned.trim() || "Mon Entreprise";
}

const DEFAULT_COMPANY: Company = {
  id: "default-comp",
  name: "Mon Entreprise",
  currency: "FCFA",
  category: "Commerce Général",
  role: "owner",
  created_at: new Date().toISOString(),
};

type CompanyContextValue = {
  companies: Company[];
  currentCompany: Company;
  loading: boolean;
  switchCompany: (companyId: string) => void;
  createCompany: (name: string, category?: string) => Promise<Company>;
  refreshCompanies: () => Promise<void>;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
};

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const refreshCompanies = useCallback(async () => {
    if (!isAuthenticated) {
      setCompanies([]);
      setCurrentCompanyId("");
      return;
    }
    setLoading(true);
    try {
      const res = await api.companies.list();
      const rawItems = res.items ?? [];
      const items = rawItems.map((c) => ({
        ...c,
        name: cleanCompanyName(c.name),
      }));

      if (items.length > 0) {
        setCompanies(items);
        const storedActiveId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY_ACTIVE) : null;
        if (storedActiveId && items.some((c) => c.id === storedActiveId)) {
          setCurrentCompanyId(storedActiveId);
        } else {
          setCurrentCompanyId(items[0].id);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_ACTIVE, items[0].id);
          }
        }
      } else {
        const rawUser = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "";
        const fallbackName = rawUser
          ? cleanCompanyName(rawUser.toLowerCase().startsWith("entreprise") ? rawUser : `Entreprise ${rawUser}`)
          : "Mon Entreprise";
        const fallback: Company = { ...DEFAULT_COMPANY, name: fallbackName };
        setCompanies([fallback]);
        setCurrentCompanyId(fallback.id);
      }
    } catch {
      const rawUser = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "";
      const fallbackName = rawUser
        ? cleanCompanyName(rawUser.toLowerCase().startsWith("entreprise") ? rawUser : `Entreprise ${rawUser}`)
        : "Mon Entreprise";
      const fallback: Company = { ...DEFAULT_COMPANY, name: fallbackName };
      setCompanies([fallback]);
      setCurrentCompanyId(fallback.id);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    void refreshCompanies();
  }, [isAuthenticated, refreshCompanies]);

  const switchCompany = useCallback((companyId: string) => {
    setCurrentCompanyId(companyId);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ACTIVE, companyId);
      // Dispatch storage event so other components know the company changed
      window.dispatchEvent(new Event("storage"));
    }
  }, []);

  const createCompany = useCallback(
    async (name: string, category?: string) => {
      try {
        const res = await api.companies.create({
          name: name.trim(),
          category: category?.trim() || "Commerce Général",
          currency: "FCFA",
        });
        const created = res.company;
        setCompanies((prev) => {
          const updated = [...prev.filter((c) => c.id !== "default-comp"), created];
          return updated;
        });
        setCurrentCompanyId(created.id);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_ACTIVE, created.id);
        }
        setIsCreateModalOpen(false);
        return created;
      } catch (err) {
        // Mode dégradé si backend non accessible
        const localCreated: Company = {
          id: `comp-${Date.now()}`,
          name: name.trim(),
          currency: "FCFA",
          category: category?.trim() || "Commerce Général",
          role: "owner",
          created_at: new Date().toISOString(),
        };
        setCompanies((prev) => [...prev, localCreated]);
        setCurrentCompanyId(localCreated.id);
        setIsCreateModalOpen(false);
        return localCreated;
      }
    },
    []
  );

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const currentCompany = useMemo(() => {
    const found = companies.find((c) => c.id === currentCompanyId) ?? companies[0] ?? DEFAULT_COMPANY;
    return {
      ...found,
      name: cleanCompanyName(found.name),
    };
  }, [companies, currentCompanyId]);

  const value = useMemo(
    () => ({
      companies,
      currentCompany,
      loading,
      switchCompany,
      createCompany,
      refreshCompanies,
      isCreateModalOpen,
      openCreateModal,
      closeCreateModal,
    }),
    [
      companies,
      currentCompany,
      loading,
      switchCompany,
      createCompany,
      refreshCompanies,
      isCreateModalOpen,
      openCreateModal,
      closeCreateModal,
    ]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany doit être utilisé au sein d'un CompanyProvider.");
  }
  return ctx;
}
