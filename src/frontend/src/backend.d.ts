import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface Promotion {
    id: bigint;
    title: string;
    body: string;
    createdAt: Time;
    imageUrl?: string;
}
export interface MealLog {
    date: string;
    note: string;
    imageUrl?: string;
    mealType: string;
}
export type Time = bigint;
export interface WeightLogEntry {
    weight: number;
    date: string;
    absent: boolean;
}
export interface FitnessClassView {
    id: bigint;
    enrolled: Array<Principal>;
    date: string;
    name: string;
    description: string;
    zoomLink?: string;
    capacity: bigint;
}
export interface UserProfile {
    name: string;
    gender: Gender;
}
export enum Gender {
    female = "female",
    male = "male"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClass(name: string, description: string, date: string, capacity: bigint, zoomLink: string | null): Promise<bigint>;
    createPromotion(title: string, body: string, imageUrl: string | null): Promise<bigint>;
    deleteClass(classId: bigint): Promise<void>;
    deletePromotion(promotionId: bigint): Promise<void>;
    enrollInClass(classId: bigint): Promise<void>;
    getAllPromotions(): Promise<Array<Promotion>>;
    getAllUserMealLogs(user: Principal, date: string): Promise<Array<MealLog>>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClass(classId: bigint): Promise<FitnessClassView | null>;
    getMeasurementLogs(user: Principal): Promise<Array<BodyMeasurement> | null>;
    getTodayMealLogs(date: string): Promise<Array<MealLog>>;
    getUpcomingClasses(): Promise<Array<FitnessClassView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeightLogs(user: Principal): Promise<Array<WeightLogEntry> | null>;
    isCallerAdmin(): Promise<boolean>;
    logMeasurements(date: string, leftBicep: number, rightBicep: number, chest: number, waist: number, hips: number, leftThigh: number, rightThigh: number): Promise<void>;
    logWeight(date: string, weight: number): Promise<void>;
    logWeightAbsent(date: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMealLog(mealType: string, note: string, imageUrl: string | null, date: string): Promise<void>;
}
