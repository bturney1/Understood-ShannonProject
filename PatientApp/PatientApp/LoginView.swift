//
//  LoginView.swift
//  PatientApp
//
//  Created by Benjamin Turney on 11/29/23.
//

import SwiftUI
import Firebase

struct LoginView: View {
    @State private var alertText = ""
    @State private var userAccess = false
    @FocusState private var userFieldIsFocused: Bool
    @FocusState private var passFieldIsFocused: Bool
    @State private var username: String = ""
    @State private var password: String = ""
    
    var body: some View {
        ZStack {
            if Auth.auth().currentUser != nil || userAccess {
                ContentView()
            } else {
                VStack {
                    VStack {
                        Image("shannonLogo")
                            .renderingMode(.original)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 256, height: 256)
                            .padding(.bottom)
                    }
                    VStack {
                        HStack(spacing: 0) {
                            Text("Username: ")
                                .frame(width: 100, height: 30)
                                .multilineTextAlignment(.trailing)
                            TextField("Username", text: $username, prompt:Text("Username"))
                                .focused($userFieldIsFocused)
                                .onSubmit {checkUser()}
                                .textInputAutocapitalization(.never)
                                .disableAutocorrection(true)
                                .textFieldStyle(.roundedBorder)
                                .frame(width:200, height: 30)
                        }
                        HStack(spacing: 0) {
                            Text("Password: ")
                                .frame(width: 100, height: 30)
                                .multilineTextAlignment(.trailing)
                            SecureField("Password", text:$password, prompt:Text("Password"))
                                .focused($passFieldIsFocused)
                                .onSubmit {checkUser()}
                                .textInputAutocapitalization(.never)
                                .disableAutocorrection(true)
                                .textContentType(.password)
                                .textFieldStyle(.roundedBorder)
                                .frame(width: 200, height: 30)
                        }
                        VStack {
                            Text(alertText)
                            Button(action: {checkUser()}) {
                                Text("Login")
                                    .padding()
                                    .foregroundColor(.black)
                                    .background(Color.white)
                                    .cornerRadius(8)
                            }
                        }
                        Spacer()
                    }
                }
            }
        }
    }
    
    private func checkUser() {
        let db = Firestore.firestore()
        let patientsCollection = db.collection("Patients")
        // Query the patients to see if the email exist
        patientsCollection.whereField("email", isEqualTo: username)
            .getDocuments{(querySnapshot, error) in
                if let error = error {
                    print("Error getting documents: (error)")
                } else {
                    if let document = querySnapshot?.documents.first {
                        // Email exists in the "Patients" collection
                        Auth.auth().signIn(withEmail: username, password: password) { (authResult, error) in
                            if let error = error {
                                print("Error signing in: \(error?.localizedDescription)")
                                // Handle login error
                                alertText = "Username/password is incorrect."
                                userAccess = false
                                UserDefaults.standard.set("", forKey:"patientID")
                            } else {
                                // User signed in successfully
                                print("User signed in successfully")
                                // You can navigate to the next screen or perform any other necessary actions
                                userAccess = true
                                UserDefaults.standard.set(document.documentID, forKey:"patientID")
                            }
                        }
                    } else {
                        alertText = "No user found."
                    }
                }
            }
    }
}
