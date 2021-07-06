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

export default class ClassSettings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      class: this.props.navigation.state.params.class,
      name: this.props.navigation.state.params.class.name
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

  async setClass (values) {
    let classRequest = {
      name: values.name
    }
    let success = await Controller.setClass(Object.assign(this.state.loginRequest, classRequest), this.state.class.id)

    if (success) {
      let newClass = {...this.state.class}
      newClass.name = values.name
  
      this.setState({class: newClass})
    } else {
      return false
    }
    return true
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
              initialValues={ this.state }
              validationSchema={
                yup.object({
                  name: yup.string()
                    .required('Required field')
                })
              }
              onSubmit={(values, formikActions) => {
                this.setClass(values)
                  .then((success) => {
                    if (success) {
                      this.props.navigation.navigate('StudentManager', { title: values.name, class: this.state.class })
                    } else {                      
                      Alert.alert('ERROR: Something went wrong. Try again')
                    }
                  })
              }}
            >
              {props => (
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Name:</Text>
                  <TextInput
                    placeholder='Name'
                    style={styles.input}
                    onChangeText={props.handleChange('name')}
                    onBlur={props.handleBlur('name')}
                    value={props.values.name}
                  />
                  {props.touched.name && props.errors.name ? (
                    <Text style={styles.error}>{props.errors.name}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={props.handleSubmit}
                    mode='contained'
                    loading={props.isSubmitting}
                  >
                    <Text style={styles.buttonText}>SAVE</Text>
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
    marginTop: 20,
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
    paddingBottom: 0
  }
})
