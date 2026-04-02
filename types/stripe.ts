import type { PlanKey } from "@/lib/stripe/config";

export interface UserSubscription {
  plan: PlanKey;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}
