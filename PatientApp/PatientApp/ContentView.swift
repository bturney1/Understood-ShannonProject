//
//  ContentView.swift
//  PatientApp
//
//  Created by Benjamin Turney on 11/15/23.
//
import SwiftUI
import HealthKit
import Firebase

struct ContentView: View {
    
    let db = Firestore.firestore()
    let healthStore = HKHealthStore()
    
    @State private var patientID = "" // Replace with the actual patient ID
    @State private var timer: Timer?
    @State private var heartRate: Double?
    @State private var oxygenLevel: Double?
    @State private var ecgData: Data?
    @State private var fallEvents: [String] = [] // Array to store fall events
    @State private var isLoggedIn = true
    
    var body: some View {
        if isLoggedIn {
            ZStack {
                VStack {
                    HStack {
                        Spacer()
                        Button(action: {logOut()}) {
                            Text("Log out")
                                .padding()
                                .foregroundColor(.black)
                                .background(Color.white)
                                .cornerRadius(8)
                        }
                        .padding()
                    }
                    Spacer()
                    Image(systemName: "heart")
                        .imageScale(.large)
                        .foregroundStyle(.tint)
                    Text("Click button to send heart rate")
                    Text("Heart Rate: \(heartRate.map { String(format: "%.0f", $0) } ?? "N/A") BPM")
                    Text("Oxygen Level: \(oxygenLevel.map { String(format: "%.0f", $0) } ?? "N/A") Rate(?)")
                    Button(action: {sendData()}) {
                        Text("Send data")
                            .padding()
                            .foregroundColor(.black)
                            .background(Color.white)
                            .cornerRadius(8)
                    }
                    Spacer()
                }
            }
            .onAppear(perform: {
                self.requestHKAuth()
                self.startTimer()
                patientID = UserDefaults.standard.string(forKey: "patientID") ?? ""
            })
        } else {
            // User not logged in, direct back to log in
            LoginView()
        }
    }
    
    // Authenticating the use of HealthKit
    func requestHKAuth() {
        if HKHealthStore.isHealthDataAvailable() {
            // Define the heart rate type
            let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
            // Define the blood oxygen saturation type
            let oxygenSaturationType = HKObjectType.quantityType(forIdentifier: .oxygenSaturation)!
            
            let typesToRead: Set<HKObjectType> = [heartRateType, oxygenSaturationType]
            healthStore.requestAuthorization(toShare: nil, read: typesToRead) { (success, error) in
                if success {
                    print("HealthKit authorization successful")
                    // If authorization is successful, get the heart rate immediately
                    self.getHeartRate()
                } else {
                    // Handle error or user denying access
                    print("Error getting health data authorization: \(String(describing: error?.localizedDescription))")
                }
            }
        }
        getHeartRate()
        getOxygenSaturation()
        getFallEvents()
        getECG()
    }
    
    // Want to update the values every 30 seconds
    func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) {_ in
            self.getHeartRate()
            self.getOxygenSaturation()
            self.getFallEvents()
            self.getECG()
        }
    }
    
    // Send data into the database
    func sendData() {
        if(heartRate != nil) {
            let heartRateData : [String: Any] = [
                "HeartRate": heartRate,
                "TimeStamp": FieldValue.serverTimestamp()
            ]
            
            // Reference to the Patients collection
            let patientsCollection = db.collection("Patients")
            
            // Reference to the specific patient document
            let patientDocument = patientsCollection.document(patientID)
            
            // Reference to the HeartData subcollection
            let heartDataCollection = patientDocument.collection("HeartData")
            
            // Add a new document to the HeartData subcollection
            heartDataCollection.addDocument(data: heartRateData) { error in
                if let error = error {
                    print("Error adding document to subcollection: (error)")
                } else {
                    print("Document added to subcollection successfully!")
                }
            }
        } else {
            print("No heart rate data to send.")
        }
    }
    
    // Grabbing current heart rate
    func getHeartRate() {
        if HKHealthStore.isHealthDataAvailable() {
            let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
            
            let query = HKSampleQuery(sampleType: heartRateType,
                                      predicate: nil,
                                      limit: HKObjectQueryNoLimit,
                                      sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]){ (query, results, error) in
                if let samples = results as? [HKQuantitySample] {
                    if let latestHeartRateSample = samples.last {
                        let heartRate = latestHeartRateSample.quantity.doubleValue(for: HKUnit.count().unitDivided(by:HKUnit.minute()))
                        self.heartRate = heartRate
                    } else {
                        print("No heart rate data found.")
                    }
                }
            }
            
            healthStore.execute(query)
        }
    }
    
    // Grabbing current oxygen level
    func getOxygenSaturation() {
        if HKHealthStore.isHealthDataAvailable() {
            let oxygenSaturationType = HKQuantityType.quantityType(forIdentifier: .oxygenSaturation)!
            
            let query = HKSampleQuery(sampleType: oxygenSaturationType,
                                      predicate: nil,
                                      limit: HKObjectQueryNoLimit,
                                      sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { (query, results, error) in
                if let sample = results?.first as? HKQuantitySample {
                    // Access blood oxygen data
                    let oxygenLevel = sample.quantity.doubleValue(for: HKUnit.percent())
                    self.oxygenLevel = oxygenLevel
                } else {
                    print("No oxygen level data found.")
                }
            }
        }
    }
    
    // Grabbing the ECG
    func getECG() {
        if HKHealthStore.isHealthDataAvailable() {
            let ecgType = HKObjectType.electrocardiogramType()
            
            let query = HKSampleQuery(sampleType: ecgType,
                                      predicate: nil,
                                      limit: HKObjectQueryNoLimit,
                                      sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]) { (query, results, error) in
                if let sample = results?.first as? HKElectrocardiogram {
                    // Access ECG data
                } else {
                    // Handle error
                    print("Error: \(error?.localizedDescription ?? "Unknown error")")
                }
            }
        }
    }
    
    // Grabbing fall events
    func getFallEvents() {
        if HKHealthStore.isHealthDataAvailable() {
            let fallEventType = HKObjectType.categoryType(forIdentifier: .appleStandHour)!
            
            let query = HKSampleQuery(sampleType: fallEventType, predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: nil){ (query, results, error) in
                if let samples = results as? [HKCategorySample] {
                    for sample in samples {
                        let eventMessage = "Fall event detected at \(sample.startDate)"
                        print(eventMessage)
                        
                        // Append the event message to the array for display
                        fallEvents.append(eventMessage)
                    }
                }
            }
        }
    }
    
    // Log the current user out, if logged in
    func logOut() {
        do {
            // Logout
            try Auth.auth().signOut()
            // Delete stored patientID
            UserDefaults.standard.removeObject(forKey: patientID)
            isLoggedIn = false
        } catch {
            // Error
            print("Error signing out: \(error?.localizedDescription)")
        }
    }
}
