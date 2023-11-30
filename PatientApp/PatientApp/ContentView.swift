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
    
    @Binding var patientID: String // Replace with the actual patient ID
    @State private var timer: Timer?
    @State private var heartRate: Double?
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
            })
        } else {
            LoginView()
        }
    }
    
    func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) {_ in
                        self.requestHeartRate()
                    }
    }
        
    func sendData() {
        let data: [String: Any] = [
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
        heartDataCollection.addDocument(data: data) { error in
            if let error = error {
                print("Error adding document to subcollection: (error)")
            } else {
                print("Document added to subcollection successfully!")
            }
        }
    }
    
    //Authenticating the use of HealthKit
    func requestHKAuth() {
        if HKHealthStore.isHealthDataAvailable() {
            let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
            
            let typesToRead: Set<HKObjectType> = [heartRateType]
            healthStore.requestAuthorization(toShare: nil, read: typesToRead) { (success, error) in
                if success {
                    print("HealthKit authorization successful")
                    // If authorization is successful, request the heart rate immediately
                    self.requestHeartRate()
                } else {
                    // Handle error or user denying access
                    print("Error requesting health data authorization: \(String(describing: error?.localizedDescription))")
                }
            }
        }
        requestHeartRate()
    }
    
    //Grabbing current heart rate
    func requestHeartRate() {
        if HKHealthStore.isHealthDataAvailable() {
            let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
            
            let query = HKSampleQuery(sampleType: heartRateType, predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: nil){ (query, results, error) in
                if let samples = results as? [HKQuantitySample] {
                    if let latestHeartRateSample = samples.last {
                        let heartRate = latestHeartRateSample.quantity.doubleValue(for: HKUnit.count().unitDivided(by:HKUnit.minute()))
                        self.heartRate = heartRate
                    }
                }
            }
            
            healthStore.execute(query)
        }
    }
    
    //Grabbing fall events
    func requestFallEvents() {
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
            
            healthStore.execute(query)
        }
    }
    
    func logOut() {
        do {
            try Auth.auth().signOut()
            isLoggedIn = false
        } catch {
            print("Error signing out: (error.localizedDescription)")
        }
    }
}
