import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Promotion {
    id: bigint;
    title: string;
    body: string;
    createdAt: Time;
}
export interface BodyMeasurement {
    rightThigh: number;
    leftThigh: number;
    date: string;
    hips: number;
    chest: number;
    rightBicep: number;
    waist: number;
    leftBicep: number;
}
export type Time = bigint;
export interface FitnessClassView {
    id: bigint;
    enrolled: Array<Principal>;
    date: string;
    name: string;
    description: string;
    capacity: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClass(name: string, description: string, date: string, capacity: bigint): Promise<bigint>;
    createPromotion(title: string, body: string): Promise<bigint>;
    enrollInClass(classId: bigint): Promise<void>;
    getAllPromotions(): Promise<Array<Promotion>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClass(classId: bigint): Promise<FitnessClassView | null>;
    getMeasurementLogs(user: Principal): Promise<Array<BodyMeasurement> | null>;
    getUpcomingClasses(): Promise<Array<FitnessClassView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeightLogs(user: Principal): Promise<Array<{
        weight: number;
        date: string;
    }> | null>;
    isCallerAdmin(): Promise<boolean>;
    logMeasurements(date: string, leftBicep: number, rightBicep: number, chest: number, waist: number, hips: number, leftThigh: number, rightThigh: number): Promise<void>;
    logWeight(date: string, weight: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
