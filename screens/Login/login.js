import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native'
import ResponsiveImage from 'react-native-responsive-image';
import * as WebBrowser from 'expo-web-browser'
import { Formik } from 'formik'
import * as yup from 'yup'
import Controller from './controller'


export default class Login extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      email: '',
      password: ''
    }
  }
  
  login = async (values) => {
    let loginRequest = {
      email: values.email,
      password: values.password
    }       

    let login = await this.getLogin(loginRequest)

    if (!login) {
      this.incorrectInput()
      return false
    }

    let teacherRequest = {
      id: login.id,
      token: login.token
    }

    let teacher = await this.getTeacher(teacherRequest, login.id)

    if (!teacher) {
      this.accessDenied()
      return false
    }
    
    let libraryRequest = {
      id: login.id,
      token: login.token
    }      
    
    let library = await this.getLibrary(libraryRequest, teacher.id)

    if (!library) {
      this.accessDenied()
      return false
    }

    if (teacher.deleted === 0) {
      if (teacher.pin != -1) {
        this.props.navigation.navigate('TeacherPortal')
      } else {
        this.props.navigation.navigate('SetPin')
      }
    } else {
      this.accessDenied()
      return false
    }
  }

  getLogin = async (request) => {
    let login = await Controller.login(request)
    await AsyncStorage.setItem('login', JSON.stringify(login))
    return login
  }

  getTeacher = async (request, accountId) => {
    let teacher = await Controller.getTeacher(request, accountId)
    await AsyncStorage.setItem('teacher', JSON.stringify(teacher))
    return teacher
  }

  getLibrary = async (request, teacherId) => {
    let libraries = await Controller.getLibraryByTeacher(request, teacherId)
    for (let library of libraries) {
      if (library.owner_teacher_id == teacherId) {
        await AsyncStorage.setItem('library', JSON.stringify(library))
        return library
      }
    }
    return null
  }

  accessDenied = () => {
    Alert.alert('This account does not have access to the functionality of this app.')
  }

  incorrectInput = () => {
    Alert.alert('Incorrect username or password. Try again.')
  }

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync('http://tapedproblems.com:3001/recover/')
  }
  passwordInput = null
  render () {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <ResponsiveImage
                initWidth='250'
                initHeight='250'
                source={require('../../Images/logo.png')}
              />
              <Text style={styles.title}>Taped Problems Intervention</Text>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={yup.object({
                  email: yup.string()
                    .required('Required field')
                    .email('Invalid email'),
                  password: yup.string()
                    .required('Required field')
                })}
                onSubmit={async (values, formikActions) => {                 
                  await this.login(values)
                }}
              >
                {props => (
                  <View>
                    <View style={styles.inputBox}>
                      <Text style={styles.inputLabel}>Email:</Text>
                      <TextInput // need to set input to state
                        placeholder='Email'
                        onChangeText={props.handleChange('email')}
                        onBlur={props.handleBlur('email')}
                        value={props.values.email}
                        style={styles.input}
                        onSubmitEditing={() => {
                          this.passwordInput.focus()
                        }}
                        keyboardType='email-address'
                      />
                      {props.touched.email && props.errors.email ? (
                        <Text style={styles.error}>{props.errors.email}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputBox}>
                      <Text style={styles.inputLabel}>Password:</Text>
                      <TextInput
                        placeholder='Password'
                        onChangeText={props.handleChange('password')}
                        onBlur={props.handleBlur('password')}
                        value={props.values.password}
                        style={styles.input}
                        secureTextEntry
                        ref={el => this.passwordInput = el}
                      />
                      {props.touched.password && props.errors.password ? (
                        <Text style={styles.error}>{props.errors.password}</Text>
                      ) : null}
                    </View>
                    <TouchableOpacity 
                      onPress={props.handleSubmit}
                      color='black'
                      mode='contained'
                      loading={props.isSubmitting}
                      style={styles.button}
                      >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={this._handleOpenWithWebBrowser}
                    >
                      <Text style={styles.buttonText}>Forgot Password</Text>
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
    paddingBottom: 15
  },
  logoContainer: {
    alignItems: 'center'
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 300,
    height: 50,
    paddingHorizontal: 8,
    borderColor: '#888E9B',
    color: '#000',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  error: {
    fontSize: 14,
    color: 'yellow',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 5,
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  button: {
    width: 300,
    backgroundColor: '#614BF2',
    paddingVertical: 15,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 50
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'black',
    textShadowRadius: 2,
    fontSize: 18
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 25,
    alignContent: 'center',
    alignSelf: 'center',
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  inputBox: {
    paddingBottom: 10
  },
  title: {
    fontSize: 33,
    color: '#fff',
    alignSelf: 'center',
    alignContent: 'center',
    marginBottom: 25,
    shadowColor: 'black',
    shadowRadius: 3,
    textShadowColor: 'black',
    textShadowRadius: 2
  }
})
