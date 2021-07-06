import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage
} from 'react-native'
import { Card } from 'react-native-elements'
import Controller from './controller'

export default class TransitionScreen extends Component {
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
            <Text style={styles.header1}>Great job on the math sprint.</Text>
            <Text style={styles.header2}>Time to start your practice run!</Text>
            <Text style={styles.header3}>Press the button to begin.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { this.props.navigation.navigate('Intervention') }}
            >
              <Text style={styles.buttonText}>Start Practice Run</Text>
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
    paddingBottom: 75
  },
  header1: {
    fontSize: 35,
    textAlign: 'center',
    color: '#000'
  },
  header2: {
    fontSize: 30,
    textAlign: 'center',
    color: '#000'
  },
  header3: {
    fontSize: 30,
    textAlign: 'center',
    color: '#000'
  },
  canvas: {
    width: '80%',
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
    width: 300,
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
