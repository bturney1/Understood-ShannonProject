//
//  LoginScreen.swift
//  LearningSwift
//
//  Created by Benjamin Turney on 10/5/23.
//

import Foundation
import SwiftUI


struct SontentView: View {
    @State private var username: String = " "
    @State private var password: String = " "
    @FocusState private var userFieldIsFocused: Bool
    @FocusState private var passFieldIsFocused: Bool
    var body: some View {
        ZStack{
            Color("Background")
                .edgesIgnoringSafeArea(.all)
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
                        TextField("Username", text: $username, prompt: Text("Username"))
                            .focused($userFieldIsFocused)
                            .onSubmit {}
                            .textInputAutocapitalization(.never)
                            .disableAutocorrection(true)
                            .textFieldStyle(.roundedBorder)
                            .frame(width:200, height: 30)
                    }
                    HStack(spacing: 0) {
                        Text("Password: ")
                            .frame(width: 100, height: 30)
                            .multilineTextAlignment(.trailing)
                        TextField("Password", text: $password, prompt: Text("Password"))
                            .focused($passFieldIsFocused)
                            .onSubmit {}
                            .textInputAutocapitalization(.never)
                            .disableAutocorrection(true)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 200, height: 30)
                    }
                    VStack {
                        Text("We got a username: " + username)
                            .frame(width:300, height:30, alignment: .leading)
                            
                        Text("We got a password: " + password)
                            .frame(width:300, height:30, alignment: .leading)
                    }
                    Spacer()
                }
            }
        }
    }
}

struct Previews_LoginScreen_Previews: PreviewProvider {
    static var previews: some View {
        SontentView()
    }
}
