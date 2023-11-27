//
//  PatientAppApp.swift
//  PatientApp
//
//  Created by Benjamin Turney on 11/15/23.
//

import SwiftUI

@main
struct PatientAppApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
