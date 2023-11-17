//
//  ContentView.swift
//  PatientApp
//
//  Created by Benjamin Turney on 11/15/23.
//
import SwiftUI
import HealthKit

struct ContentView: View {
    
    let healthStore = HKHealthStore()
    
    @State private var heartRate: Double?
    @State private var fallEvents: [String] = [] // Array to store fall events
    var body: some View
    {
        VStack
        {
            Image(systemName: "heart")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, trvk!")
                .onAppear(perform: {
                    requestHKAuth()
                })
                
            Text("Heart Rate: \(heartRate.map { String(format: "%.0f", $0) } ?? "N/A") BPM")
            List(fallEvents, id: \.self) { event in
                            Text(event)
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

            let query = HKSampleQuery(sampleType: heartRateType, predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { (query, results, error) in
                if let samples = results as? [HKQuantitySample] {
                    if let latestHeartRateSample = samples.last {
                        let heartRate = latestHeartRateSample.quantity.doubleValue(for: HKUnit.count().unitDivided(by: HKUnit.minute()))
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
            
            let query = HKSampleQuery(sampleType: fallEventType, predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { (query, results, error) in
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
}
