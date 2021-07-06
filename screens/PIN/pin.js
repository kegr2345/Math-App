import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Formik } from 'formik'
import * as yup from 'yup'
import Controller from './controller'

export default class Pin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loginRequest: null,
      pin: '',
      student: this.props.navigation.state.params.student,
      teacher: null
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

  async checkPin(pin) {    
    let teacher = JSON.parse(await AsyncStorage.getItem('teacher'))
    return teacher.pin == pin
  }

  render () {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.formContainer}>
              <Text style={styles.text}>Enter your PIN:</Text>
              <Formik
                initialValues={{pin: ''}}
                validationSchema={
                  yup.object({
                    pin: yup.string()
                      .required('Required field')
                      .length(4, 'Required length of 4.')
                  })
                }
                onSubmit={(values, formikActions) => {
                  this.checkPin(values.pin)
                    .then((success) => {
                      if (success) {
                        this.props.navigation.navigate('InitiationScreen')
                      } else {
                        Alert.alert('ERROR: Pin does not match.')
                      }
                    })
                }}
              >
                {props => (
                  <View>
                    <TextInput
                      placeholder='Pin'
                      keyboardType='number-pad'
                      style={styles.input}
                      onChangeText={props.handleChange('pin')}
                      onBlur={props.handleBlur('pin')}
                      value={props.values.pin}
                      secureTextEntry
                    />
                    {props.touched.pin && props.errors.pin ? (
                      <Text style={styles.error}>{props.errors.pin}</Text>
                    ) : null}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={props.handleSubmit}
                      mode='contained'
                      loading={props.isSubmitting}
                    >
                      <Text style={styles.buttonText}>Submit PIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.props.navigation.navigate('ResetPin')}
                    >
                      <Text style={styles.buttonText}>Forgot PIN</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  text: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 30,
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  input: {
    width: 300,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
    marginTop: 20,
    color: '#000',
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#888E9B'
  },
  button: {
    width: 300,
    backgroundColor: '#614BF2',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    textShadowColor: 'black',
    textShadowRadius: 2,
    fontSize: 18
  },
  error: {
    fontSize: 18,
    color: 'yellow',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 5,
    textShadowColor: 'black',
    textShadowRadius: 2
  },
})
