import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useWeightLogs(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["weightLogs", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const result = await actor.getWeightLogs(principal);
      return result ?? [];
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useLogWeight() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ date, weight }: { date: string; weight: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.logWeight(date, weight);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weightLogs"] }),
  });
}

export function useMeasurementLogs(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["measurementLogs", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const result = await actor.getMeasurementLogs(principal);
      return result ?? [];
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useLogMeasurements() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      date: string;
      leftBicep: number;
      rightBicep: number;
      chest: number;
      waist: number;
      hips: number;
      leftThigh: number;
      rightThigh: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.logMeasurements(
        data.date,
        data.leftBicep,
        data.rightBicep,
        data.chest,
        data.waist,
        data.hips,
        data.leftThigh,
        data.rightThigh,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["measurementLogs"] }),
  });
}

export function useUpcomingClasses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["upcomingClasses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEnrollInClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (classId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.enrollInClass(classId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["upcomingClasses"] }),
  });
}

export function useCreateClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      date: string;
      capacity: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createClass(
        data.name,
        data.description,
        data.date,
        data.capacity,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["upcomingClasses"] }),
  });
}

export function useAllPromotions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPromotions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePromotion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPromotion(title, body);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}
