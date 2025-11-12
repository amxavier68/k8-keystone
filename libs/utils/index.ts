import { Button } from "@k8/ui";
import { InsightGenerator } from "@k8/seo";

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const logInfo = (context: string, message: string): void => {
  console.log(`[${new Date().toISOString()}] [${context}] ${message}`);
};