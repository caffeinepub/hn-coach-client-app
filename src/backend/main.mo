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
  public type Gender = { #male; #female };

  public type UserProfile = {
    name : Text;
    gender : Gender;
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

  public type ActivityComment = {
    activityKey : Text;
    comment : Text;
    createdAt : Time.Time;
  };

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent data structures
  let userProfiles = Map.empty<Principal, UserProfile>();
  let weightLogs = Map.empty<Principal, List.List<WeightLogEntry>>();
  let measurementLogs = Map.empty<Principal, List.List<BodyMeasurement>>();
  let classes = Map.empty<Nat, FitnessClass>();
  let promotions = Map.empty<Nat, Promotion>();
  let mealLogs = Map.empty<Principal, Map.Map<Text, Map.Map<Text, MealLog>>>();

  // Activity comments: keyed by user principal -> activityKey -> comment
  let activityComments = Map.empty<Principal, Map.Map<Text, ActivityComment>>();

  // Track all users who have saved a profile
  let registeredUsers = List.empty<Principal>();

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

  // Get any user profile - accessible by any authenticated user (for admin panel)
  public query func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);

    // Only add user to registeredUsers if not already present
    let alreadyRegistered = registeredUsers.any(func(p) { p == caller });
    if (not alreadyRegistered) {
      registeredUsers.add(caller);
    };
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
    let alreadyReg1 = registeredUsers.any(func(p) { p == caller });
    if (not alreadyReg1) { registeredUsers.add(caller); };
  };

  // Logging weight absent
  public shared ({ caller }) func logWeightAbsent(date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log weight absence");
    };

    let existingLogs = switch (weightLogs.get(caller)) {
      case (null) { List.empty<WeightLogEntry>() };
      case (?logs) { logs };
    };
    let newEntry : WeightLogEntry = { date; weight = 0.0; absent = true };
    existingLogs.add(newEntry);
    weightLogs.add(caller, existingLogs);
    let alreadyReg2 = registeredUsers.any(func(p) { p == caller });
    if (not alreadyReg2) { registeredUsers.add(caller); };
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
    let alreadyReg3 = registeredUsers.any(func(p) { p == caller });
    if (not alreadyReg3) { registeredUsers.add(caller); };
  };

  // Creating a fitness class - accessible by any authenticated user (password gate is in frontend)
  public shared ({ caller }) func createClass(name : Text, description : Text, date : Text, capacity : Nat, zoomLink : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to create classes");
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

  // Deleting a fitness class - accessible by any authenticated user (password gate is in frontend)
  public shared ({ caller }) func deleteClass(classId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to delete classes");
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

  // Creating a promotion - accessible by any authenticated user (password gate is in frontend)
  public shared ({ caller }) func createPromotion(title : Text, body : Text, imageUrl : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to create promotions");
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

  // Deleting a promotion - accessible by any authenticated user (password gate is in frontend)
  public shared ({ caller }) func deletePromotion(promotionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to delete promotions");
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
    let alreadyReg4 = registeredUsers.any(func(p) { p == caller });
    if (not alreadyReg4) { registeredUsers.add(caller); };
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

  // Query endpoints - open to any caller for admin panel access

  public query func getWeightLogs(user : Principal) : async ?[WeightLogEntry] {
    switch (weightLogs.get(user)) {
      case (null) { null };
      case (?logs) { ?logs.toArray() };
    };
  };

  public query func getMeasurementLogs(user : Principal) : async ?[BodyMeasurement] {
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

  public query func getClass(classId : Nat) : async ?FitnessClassView {
    switch (classes.get(classId)) {
      case (null) { null };
      case (?fitnessClass) { ?toFitnessClassView(fitnessClass) };
    };
  };

  public query func getUpcomingClasses() : async [FitnessClassView] {
    classes.values().toArray().map(toFitnessClassView).sort(FitnessClassView.compareByDate);
  };

  public query func getAllPromotions() : async [Promotion] {
    promotions.values().toArray();
  };

  // Get all registered users - accessible by any caller (for admin panel)
  public query func getAllUsers() : async [Principal] {
    registeredUsers.toArray();
  };

  // Get all meal logs for a specific user and date (for admin panel)
  public query func getAllUserMealLogs(user : Principal, date : Text) : async [MealLog] {
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

  // Activity comments - coach saves a comment for a user's activity
  // activityKey format: "weight-{date}", "meal-{date}-{mealType}", "measurement-{date}"
  public shared ({ caller }) func saveActivityComment(user : Principal, activityKey : Text, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to comment");
    };

    let userComments = switch (activityComments.get(user)) {
      case (null) { Map.empty<Text, ActivityComment>() };
      case (?existing) { existing };
    };

    let newComment : ActivityComment = {
      activityKey;
      comment;
      createdAt = Time.now();
    };

    userComments.add(activityKey, newComment);
    activityComments.add(user, userComments);
  };

  // Get all activity comments for a user - open query (for user dashboard and admin panel)
  public query func getActivityComments(user : Principal) : async [ActivityComment] {
    switch (activityComments.get(user)) {
      case (null) { [] };
      case (?userComments) { userComments.values().toArray() };
    };
  };
};
