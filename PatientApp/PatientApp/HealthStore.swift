//
//  HealthStore.swift
//  PatientApp
//
//  Created by Benjamin Turney on 11/15/23.
//
import Foundation
import HealthKit

extension Date
{
    static func mondayAt12AM() -> Date
    {
        return Calendar(identifier: .iso8601).date(from: Calendar(identifier: .iso8601).dateComponents([.yearForWeekOfYear, .weekOfYear], from: Date()))!
    }
}

class HealthStore {
    var healthStore: HKHealthStore?
    var query: HKStatisticsCollectionQuery?
    init() {
        if HKHealthStore.isHealthDataAvailable() {
            healthStore = HKHealthStore()
        }
    }
    
    func calculateSteps(completion: @escaping (HKStatisticsCollection?) -> Void) {
        let stepType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.stepCount)!
        
        let startDate = Calendar.current.date(byAdding: .day, value: -7, to: Date())
        
        let anchorDate = Date.mondayAt12AM()
        
        let updateInterval = DateComponents(minute: 10)
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: .strictStartDate)
        
        query = HKStatisticsCollectionQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum, anchorDate: anchorDate, intervalComponents: updateInterval)
        
        query!.initialResultsHandler = { query, statisticsCollection, error in
            completion(statisticsCollection)
            print("We queried")
        }
        print("Calculate was called")
    }
    
    func requestAuthorization(completion: @escaping (Bool) -> Void)
    {
        let stepType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.stepCount)!
        
        guard let healthStore = self.healthStore else { return completion(false) }
        
        healthStore.requestAuthorization(toShare: [], read: [stepType])
        {
            (success, error) in
            completion(success)
        }
    }
}
