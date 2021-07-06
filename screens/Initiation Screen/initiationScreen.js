import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage
} from 'react-native'
import { Card } from 'react-native-elements'
import Controller from './controller'


export default class InitiationScreen extends Component {
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
  }

  render () {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Card containerStyle={styles.canvas}>
            <Text style={styles.header1}>Are you ready for your math sprint?</Text>
            <Text style={styles.header3}>Press the button when ready!</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { this.props.navigation.navigate('Sprint') }}
            >
              <Text style={styles.buttonText}>Start Sprint</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#209eff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100
  },
  header1: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000'
  },
  header2: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000'
  },
  header3: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000'
  },
  canvas: {
    width: '60%',
    height: '60%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    backgroundColor: '#b2fcff',
    paddingHorizontal: 10,
    height: 40,
    marginTop: 20,
    color: '#000',
    borderRadius: 8
  },
  button: {
    width: 200,
    alignSelf: 'center',
    backgroundColor: '#614BF2',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 50
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    textShadowColor: 'black',
    textShadowRadius: 2
  }
})
