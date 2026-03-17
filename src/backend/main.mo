import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data models
  public type UserProfile = {
    name : Text;
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
    date : Text; // e.g. "2024-04-10"
    capacity : Nat;
    enrolled : List.List<Principal>;
  };

  type FitnessClassView = {
    id : Nat;
    name : Text;
    description : Text;
    date : Text;
    capacity : Nat;
    enrolled : [Principal];
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
  };

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent data structures using enhanced collections
  let userProfiles = Map.empty<Principal, UserProfile>();
  let weightLogs = Map.empty<Principal, List.List<{ date : Text; weight : Float }>>();
  let measurementLogs = Map.empty<Principal, List.List<BodyMeasurement>>();
  let classes = Map.empty<Nat, FitnessClass>();
  let promotions = Map.empty<Nat, Promotion>();

  // Counters for IDs
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
      case (null) { List.empty<{ date : Text; weight : Float }>() };
      case (?logs) { logs };
    };
    let newEntry = { date; weight };
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
  public shared ({ caller }) func createClass(name : Text, description : Text, date : Text, capacity : Nat) : async Nat {
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
    };
    classes.add(classId, classData);
    classId;
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
  public shared ({ caller }) func createPromotion(title : Text, body : Text) : async Nat {
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
    };

    promotions.add(promotionId, promotion);
    promotionId;
  };

  // Query endpoints
  public query ({ caller }) func getWeightLogs(user : Principal) : async ?[{ date : Text; weight : Float }] {
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
};
