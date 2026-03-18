import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserRole, WeightLogEntry } from "../backend";
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
    mutationFn: async ({ name, gender }: { name: string; gender: string }) => {
      if (!actor) throw new Error("No actor");
      const backendGender =
        gender?.toLowerCase() === "female" ? { female: null } : { male: null };
      return actor.saveCallerUserProfile({
        name,
        gender: backendGender as any,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useWeightLogs(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<WeightLogEntry[]>({
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

export function useLogWeightAbsent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error("No actor");
      return actor.logWeightAbsent(date);
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
      zoomLink: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createClass(
        data.name,
        data.description,
        data.date,
        data.capacity,
        data.zoomLink,
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
    mutationFn: async ({
      title,
      body,
      imageUrl,
    }: {
      title: string;
      body: string;
      imageUrl: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPromotion(title, body, imageUrl);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}

export function useDeleteClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (classId: bigint) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).deleteClass(classId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["upcomingClasses"] }),
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (promotionId: bigint) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).deletePromotion(promotionId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}
