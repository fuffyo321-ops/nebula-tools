import { Plan, SubscriptionStatus, Role } from "@prisma/client";

export type { Plan, SubscriptionStatus, Role };

export interface UserWithSubscription {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  banned: boolean;
  createdAt: Date;
  subscription: {
    plan: Plan;
    status: SubscriptionStatus;
    stripeCurrentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export interface ToolWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDesc: string | null;
  icon: string | null;
  image: string | null;
  url: string;
  tags: string[];
  requiredPlan: Plan;
  featured: boolean;
  trending: boolean;
  active: boolean;
  usageCount: number;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  priceIdMonthly?: string;
  priceIdYearly?: string;
}

export interface DashboardStats {
  toolsUsed: number;
  toolsLimit: number;
  favoritesCount: number;
  currentPlan: Plan;
  apiUsageThisMonth: number;
  joinedDate: Date;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  totalTools: number;
  newUsersToday: number;
  totalRevenue: number;
}
