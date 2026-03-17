import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  include MixinStorage();

  // Data models
  public type UserProfile = {
    name : Text;
  };

  type WeightLogEntry = {
    date : Text;
    weight : Float;
    absent : Bool;
  };

  type BodyMeasurement = {
    date : Text;
    leftBicep : Float;
    rightBicep : Float;
    chest : Float;
    waist : Float;
    hips : Float;
    leftThigh : Float;
    rightThigh : Float;
  };

  type FitnessClass = {
    id : Nat;
    name : Text;
    description : Text;
    date : Text;
    capacity : Nat;
    enrolled : List.List<Principal>;
    zoomLink : ?Text;
  };

  type FitnessClassView = {
    id : Nat;
    name : Text;
    description : Text;
    date : Text;
    capacity : Nat;
    enrolled : [Principal];
    zoomLink : ?Text;
  };

  module FitnessClassView {
    public func compareByDate(class1 : FitnessClassView, class2 : FitnessClassView) : Order.Order {
      Text.compare(class1.date, class2.date);
    };
  };

  type Promotion = {
    id : Nat;
    title : Text;
    body : Text;
    createdAt : Time.Time;
    imageUrl : ?Text;
  };

  type MealLog = {
    mealType : Text;
    note : Text;
    imageUrl : ?Text;
    date : Text;
  };

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent data structures using enhanced collections
  let userProfiles = Map.empty<Principal, UserProfile>();
  let weightLogs = Map.empty<Principal, List.List<WeightLogEntry>>();
  let measurementLogs = Map.empty<Principal, List.List<BodyMeasurement>>();
  let classes = Map.empty<Nat, FitnessClass>();
  let promotions = Map.empty<Nat, Promotion>();
  let mealLogs = Map.empty<Principal, Map.Map<Text, Map.Map<Text, MealLog>>>();

  // Counter for IDs
  var nextClassId = 1;
  var nextPromotionId = 1;

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Logging weight
  public shared ({ caller }) func logWeight(date : Text, weight : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log weight");
    };

    let existingLogs = switch (weightLogs.get(caller)) {
      case (null) { List.empty<WeightLogEntry>() };
      case (?logs) { logs };
    };
    let newEntry : WeightLogEntry = { date; weight; absent = false };
    existingLogs.add(newEntry);
    weightLogs.add(caller, existingLogs);
  };

  // Logging weight absent
  public shared ({ caller }) func logWeightAbsent(date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log weight");
    };

    let existingLogs = switch (weightLogs.get(caller)) {
      case (null) { List.empty<WeightLogEntry>() };
      case (?logs) { logs };
    };
    let newEntry : WeightLogEntry = { date; weight = 0.0; absent = true };
    existingLogs.add(newEntry);
    weightLogs.add(caller, existingLogs);
  };

  // Logging body measurements
  public shared ({ caller }) func logMeasurements(date : Text, leftBicep : Float, rightBicep : Float, chest : Float, waist : Float, hips : Float, leftThigh : Float, rightThigh : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log measurements");
    };

    let measurement : BodyMeasurement = {
      date;
      leftBicep;
      rightBicep;
      chest;
      waist;
      hips;
      leftThigh;
      rightThigh;
    };

    let existingLogs = switch (measurementLogs.get(caller)) {
      case (null) { List.empty<BodyMeasurement>() };
      case (?logs) { logs };
    };
    existingLogs.add(measurement);
    measurementLogs.add(caller, existingLogs);
  };

  // Creating a fitness class (coach only)
  public shared ({ caller }) func createClass(name : Text, description : Text, date : Text, capacity : Nat, zoomLink : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only coaches can create classes");
    };

    let classId = nextClassId;
    nextClassId += 1;

    let classData : FitnessClass = {
      id = classId;
      name;
      description;
      date;
      capacity;
      enrolled = List.empty<Principal>();
      zoomLink;
    };
    classes.add(classId, classData);
    classId;
  };

  // Deleting a fitness class (coach only)
  public shared ({ caller }) func deleteClass(classId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only coaches can delete classes");
    };
    ignore classes.remove(classId);
  };

  // Enrolling in a class
  public shared ({ caller }) func enrollInClass(classId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enroll in classes");
    };

    switch (classes.get(classId)) {
      case (null) { Runtime.trap("Class not found") };
      case (?fitnessClass) {
        if (fitnessClass.enrolled.size() >= fitnessClass.capacity) {
          Runtime.trap("Class is full");
        };

        let alreadyEnrolled = fitnessClass.enrolled.any(func(p) { p == caller });
        if (alreadyEnrolled) {
          Runtime.trap("Already enrolled in this class");
        };

        fitnessClass.enrolled.add(caller);
        classes.add(classId, fitnessClass);
      };
    };
  };

  // Creating a promotion (coach only)
  public shared ({ caller }) func createPromotion(title : Text, body : Text, imageUrl : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only coaches can create promotions");
    };

    let promotionId = nextPromotionId;
    nextPromotionId += 1;

    let promotion : Promotion = {
      id = promotionId;
      title;
      body;
      createdAt = Time.now();
      imageUrl;
    };

    promotions.add(promotionId, promotion);
    promotionId;
  };

  // Deleting a promotion (coach only)
  public shared ({ caller }) func deletePromotion(promotionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only coaches can delete promotions");
    };
    ignore promotions.remove(promotionId);
  };

  // Meal check-in functionality
  public shared ({ caller }) func saveMealLog(mealType : Text, note : Text, imageUrl : ?Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log meals");
    };

    let mealLog : MealLog = {
      mealType;
      note;
      imageUrl;
      date;
    };

    let userMeals = switch (mealLogs.get(caller)) {
      case (null) {
        let dayToMeals = Map.empty<Text, MealLog>();
        dayToMeals.add(mealType, mealLog);

        let dateToDayMeals = Map.empty<Text, Map.Map<Text, MealLog>>();
        dateToDayMeals.add(date, dayToMeals);
        dateToDayMeals;
      };
      case (?dateToDayMeals) {
        let dayToMeals = switch (dateToDayMeals.get(date)) {
          case (null) { Map.empty<Text, MealLog>() };
          case (?existingDayToMeals) { existingDayToMeals };
        };

        dayToMeals.add(mealType, mealLog);
        dateToDayMeals.add(date, dayToMeals);
        dateToDayMeals;
      };
    };

    mealLogs.add(caller, userMeals);
  };

  public query ({ caller }) func getTodayMealLogs(date : Text) : async [MealLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view meal logs");
    };

    switch (mealLogs.get(caller)) {
      case (null) { [] };
      case (?userMeals) {
        switch (userMeals.get(date)) {
          case (null) { [] };
          case (?dayToMeals) { dayToMeals.values().toArray() };
        };
      };
    };
  };

  // Query endpoints

  public query ({ caller }) func getWeightLogs(user : Principal) : async ?[WeightLogEntry] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own weight logs");
    };

    switch (weightLogs.get(user)) {
      case (null) { null };
      case (?logs) { ?logs.toArray() };
    };
  };

  public query ({ caller }) func getMeasurementLogs(user : Principal) : async ?[BodyMeasurement] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own measurement logs");
    };

    switch (measurementLogs.get(user)) {
      case (null) { null };
      case (?logs) { ?logs.toArray() };
    };
  };

  func toFitnessClassView(fitnessClass : FitnessClass) : FitnessClassView {
    {
      id = fitnessClass.id;
      name = fitnessClass.name;
      description = fitnessClass.description;
      date = fitnessClass.date;
      capacity = fitnessClass.capacity;
      enrolled = fitnessClass.enrolled.toArray();
      zoomLink = fitnessClass.zoomLink;
    };
  };

  public query ({ caller }) func getClass(classId : Nat) : async ?FitnessClassView {
    switch (classes.get(classId)) {
      case (null) { null };
      case (?fitnessClass) { ?toFitnessClassView(fitnessClass) };
    };
  };

  public query ({ caller }) func getUpcomingClasses() : async [FitnessClassView] {
    let now = Time.now();
    classes.values().toArray().map(toFitnessClassView).filter(func(classData) { true }).sort(FitnessClassView.compareByDate);
  };

  public query ({ caller }) func getAllPromotions() : async [Promotion] {
    let now = Time.now();
    promotions.values().toArray().filter(func(p) { p.createdAt <= now });
  };

  // Admin-only endpoints

  // Get all users who have a profile
  public query ({ caller }) func getAllUsers() : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.keys().toArray();
  };

  // Get all meal logs for a specific user and date (admin only)
  public query ({ caller }) func getAllUserMealLogs(user : Principal, date : Text) : async [MealLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all user meal logs");
    };

    switch (mealLogs.get(user)) {
      case (null) { [] };
      case (?userMeals) {
        switch (userMeals.get(date)) {
          case (null) { [] };
          case (?dayToMeals) { dayToMeals.values().toArray() };
        };
      };
    };
  };
};
