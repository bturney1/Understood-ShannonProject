//
//  LearningSwiftApp.swift
//  LearningSwift
//
//  Created by Benjamin Turney on 9/30/23.
//

import SwiftUI

@main
struct LearningSwiftApp: App {
    var body: some Scene {
        WindowGroup {
            SontentView()
        }
    }
}

struct ContentView_Previews:
    PreviewProvider {
        static var previews: some View {
            SontentView()
        }
    }
