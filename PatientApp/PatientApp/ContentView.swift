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
    @State private var heartRate: Int?
    @State private var bloodOxygen: Int?
    @State private var ecgData: Data?
    @State private var fallEvents: [String] = [] // Array to store fall events
    @State private var isLoggedIn = true
    @State private var userInput = ""
    
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
                    Text("Heart Rate: " + String(heartRate ?? -1) + " BPM")
                    Text("Oxygen Level: " + String(bloodOxygen ?? -1) + "%")
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
                    self.getOxygenSaturation()
                    self.getFallEvents()
                    self.getECG()
                } else {
                    // Handle error or user denying access
                    print("Error getting health data authorization: \(String(describing: error?.localizedDescription))")
                }
            }
        }
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
        // Reference to the Patients collection
        let patientsCollection = db.collection("Patients")
        
        // Reference to the specific patient document
        let patientDocument = patientsCollection.document(patientID)
        
        // Refrence to the Notification collection
        let notificationsCollection = db.collection("Notifications")
        
        if(heartRate != nil) {
            let heartRateData : [String: Any] = [
                "HeartRate": heartRate,
                "TimeStamp": FieldValue.serverTimestamp()
            ]
            
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
            
            patientDocument.getDocument { (document, error) in
                if let error = error {
                    print("Error getting document: \(error)")
                } else {
                    if let document = document, document.exists {
                        // Document data is available
                        if let data = document.data() {
                            // Now you can access the data dictionary
                            if let hrHigh = data["HRhigh"] as? Int,
                               let hrLow = data["HRlow"] as? Int {
                                // Use hrHigh and hrLow safely
                                if(hrHigh > 0 && hrLow > 0) {
                                    if let uwHeartRate = heartRate {
                                        if(uwHeartRate < hrLow || hrHigh < uwHeartRate) {
                                            let notificationData: [String: Any] = [
                                                "Message": "\(getPatientName(document: data))'s heart rate of \(uwHeartRate) deviates from the set range.",
                                                "p_ID": patientID,
                                                "TimeStamp": FieldValue.serverTimestamp()
                                            ]
                                            
                                            notificationsCollection.addDocument(data: notificationData) { error in
                                                if let error = error {
                                                    print("Error sending notification: (error.localizedDescription)")
                                                } else {
                                                    print("Notification sent successfully")
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                print("Error: HRhigh or HRlow not present or not a Double")
                            }
                        } else {
                            print("Error: Document does not contain data")
                        }
                    } else {
                        print("Error: Patient document does not exist")
                    }
                }
            }
        } else {
            print("No heart rate data to send.")
        }
        
        if(bloodOxygen != nil) {
            let bloodOxygenData : [String: Any] = [
                "BloodOxygen": bloodOxygen,
                "TimeStamp": FieldValue.serverTimestamp()
            ]
            
            // Refrence to the bloodOxygen subcollection
            let bloodOxygenCollection = patientDocument.collection("OxygenData")
            
            // Add a new document to the OxygenData subcollection
            bloodOxygenCollection.addDocument(data: bloodOxygenData) { error in
                if let error = error {
                    print("Error adding document to subcollection: (error)")
                } else {
                    print("Document added to subcollection successfully!")
                }
            }
            
            patientDocument.getDocument { (document, error) in
                if let error = error {
                    print("Error getting document: \(error)")
                } else {
                    if let document = document, document.exists {
                        // Document data is available
                        if let data = document.data() {
                            // Now you can access the data dictionary
                            if let boLow = data["BOlow"] as? Int{
                                // Use hrHigh and hrLow safely
                                if(boLow > 0 && boLow < 101) {
                                    if let uwBloodOxygen = bloodOxygen {
                                        if(uwBloodOxygen < boLow) {
                                            let notificationData: [String: Any] = [
                                                "Message": "\(getPatientName(document: data))'s blood oxygen level of \(uwBloodOxygen)% deviates from the set range.",
                                                "p_ID": patientID,
                                                "TimeStamp": FieldValue.serverTimestamp()
                                            ]
                                            
                                            notificationsCollection.addDocument(data: notificationData) { error in
                                                if let error = error {
                                                    print("Error sending notification: (error.localizedDescription)")
                                                } else {
                                                    print("Notification sent successfully")
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                print("Error: HRhigh or HRlow not present or not a Double")
                            }
                        } else {
                            print("Error: Document does not contain data")
                        }
                    } else {
                        print("Error: Patient document does not exist")
                    }
                }
            }
        } else {
            print("No oxygen level data to send.")
        }
    }
    
    // Grab the patients name for use in notifications and alerts
    func getPatientName(document: [String: Any]) -> String {
        var patientName = ""
        if let firstName = document["firstName"] as? String,
           let lastName = document["lastName"] as? String {
            patientName = lastName + ", " + firstName
        } else {
            print("No patient name on file.")
        }
        print("Patient name is: \(patientName)")
        return patientName
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
                        self.heartRate = Int(heartRate)
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
                    print(sample.quantity.doubleValue(for: HKUnit.percent()))
                    let bloodOxygen = sample.quantity.doubleValue(for: HKUnit.percent())
                    self.bloodOxygen = Int(bloodOxygen * 100)
                } else {
                    print("No oxygen level data found.")
                }
            }
            healthStore.execute(query)
        }
        self.bloodOxygen = 80
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
            healthStore.execute(query)
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
            healthStore.execute(query)
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
            print("Error signing out: \(error.localizedDescription)")
        }
    }
}
