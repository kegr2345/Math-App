import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  AsyncStorage
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import Controller from './controller'

export default class TeacherPortal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loginRequest: null
    }
  }
  
  checkLogin = async () => {
    let login = JSON.parse(await AsyncStorage.getItem('login'))

    let loginRequest = {
      id: login.id,
      token: login.token
    }

    await this.setState({loginRequest: loginRequest})

    let authorized = await Controller.authorize(this.state.loginRequest)

    if (!authorized) {
      this.props.navigation.navigate('Login')
    }
  }

  componentDidMount = async () => {
    await this.checkLogin()
    
    let teacher = JSON.parse(await AsyncStorage.getItem('teacher'))

    // Check if pin is set
    if (!teacher.pin == -1) {        
      this.props.navigation.navigate('ResetPin')
    }
  }

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync('http://www.google.com')
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choose Navigation Option: </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('ClassManager')}
        >
          <Text style={styles.buttonText}>Class Manager</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('ProblemManager')}
        >
          <Text style={styles.buttonText}>Problem Manager</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('ClassPicker')}
        >
          <Text style={styles.buttonText}>Student Portal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#209eff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 150
  },
  button: {
    width: '70%',
    backgroundColor: '#614BF2',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 50
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FFF',
    textShadowColor: 'black',
    textShadowRadius: 2
  }
})
