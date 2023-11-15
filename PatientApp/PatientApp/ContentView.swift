//
//  ContentView.swift
//  PatientApp
//
//  Created by Benjamin Turney on 11/15/23.
//
import SwiftUI
import HealthKit

struct ContentView: View {
    
    private var healthStore: HealthStore?
    
    init() {
        healthStore = HealthStore()
    }
    
    private func updateUIFromStatistics( statisticCollection: HKStatisticsCollection) {
        let startDate = Calendar.current.date(byAdding: .day, value: -7, to: Date())!
        let endDate = Date()
        
        statisticCollection.enumerateStatistics(from: startDate, to: endDate) { (statistics, stop) in
            let count = statistics.sumQuantity()?.doubleValue(for: .count())
        }
    }
    
    var body: some View
    {
        VStack
        {
            Image(systemName: "heart")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, trvk!")
            
                .onAppear
            {
                if let healthStore = healthStore
                {
                    healthStore.requestAuthorization { success in
                        if success {
                            print("We got to success")
                            healthStore.calculateSteps { statisticsCollection in
                                if let statisticsCollection = statisticsCollection {
                                    // update the ui
                                    print("We got to statistics")
                                    print(statisticsCollection)
                                }
                            }
                        }
                    }
                }
            }
            Text("Hello, trvk!")
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
    }
}
