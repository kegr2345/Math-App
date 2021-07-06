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
import { Formik } from 'formik'
import * as yup from 'yup'
import Controller from './controller'

export default class SetPin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      newPin: '',
      confirmPin: '',
      password: ''
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

  async resetPin (values) {
    let teacher = JSON.parse(await AsyncStorage.getItem('teacher'))
		
		let teacherReq = {
			pin: values.newPin
		}
		
		let teacherSuccess = await Controller.setPin(Object.assign(this.state.loginRequest, teacherReq), teacher.id)

		if (teacherSuccess) {
			let newTeacher = {...teacher}
			newTeacher.pin = values.newPin   
			await AsyncStorage.setItem('teacher', JSON.stringify(newTeacher))
			return true
		} else {
			return null
		}
  }

  render () {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Formik
              initialValues={{ newPin: '', confirmPin: '' }}
              validationSchema={
                yup.object({
                  newPin: yup.string()
                    .length(4, 'PIN must be length 4')
                    .required('Required field'),
                  confirmPin: yup.string()
                    .oneOf([yup.ref('newPin'), null], 'PIN fields must match')
                    .required('PIN confirmation is required'),
                })
              }
              onSubmit={(values, formikActions) => {
                this.resetPin(values)
                  .then((success) => {
                    if (success) {
                      this.props.navigation.navigate('TeacherPortal')
                    } else if (success == null) {
											Alert.alert('ERROR: PIN could not be set. Try setting it on the website.')
                    }
                  })
              }}
            >
              {props => (
                <View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>New PIN:</Text>
                    <TextInput
                      placeholder='New PIN'
                      style={styles.input}
                      onChangeText={props.handleChange('newPin')}
                      onBlur={props.handleBlur('newPin')}
                      value={props.values.newPin}
                      keyboardType='number-pad'
                      secureTextEntry
                      onSubmitEditing={() => {
                        this.confirmInput.focus()
                      }}
                    />
                    {props.touched.newPin && props.errors.newPin ? (
                      <Text style={styles.error}>{props.errors.newPin}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Confirm PIN:</Text>
                    <TextInput
                      placeholder='Confirm PIN'
                      style={styles.input}
                      onChangeText={props.handleChange('confirmPin')}
                      onBlur={props.handleBlur('confirmPin')}
                      value={props.values.confirmPin}
                      keyboardType='number-pad'
                      secureTextEntry
                      ref={el => this.confirmInput = el}
                    />
                    {props.touched.confirmPin && props.errors.confirmPin ? (
                      <Text style={styles.error}>{props.errors.confirmPin}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={props.handleSubmit}
                    mode='contained'
                    loading={props.isSubmitting}
                  >
                    <Text style={styles.buttonText}>SAVE NEW PIN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
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
    paddingBottom: 150
  },
  input: {
    width: 300,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
    marginTop: 10,
    color: '#000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888E9B'
  },
  button: {
    width: 300,
    backgroundColor: '#614BF2',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 50
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
  inputLabel: {
    color: '#FFF',
    fontSize: 30,
    alignContent: 'center',
    alignSelf: 'center',
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  inputBox: {
    paddingBottom: 15
  },
  inputContainer: {
    paddingBottom: 10
  },
})
