import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import Controller from './controller'

export default class NewClass extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loginRequest: null,
      library: null,
      name: ''
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
    let library = JSON.parse(await AsyncStorage.getItem('library'))
    this.setState({library: library})
  }

  render () {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Formik
              initialValues={{ name: '' }}
              validationSchema={
                yup.object({
                  name: yup.string()
                    .required('Required field')
                })
              }
              onSubmit={(values, formikActions) => {

                let classRequest = {
                  name: values.name,
                  library_id: this.state.library.id
                }

                Controller.create(Object.assign(this.state.loginRequest, classRequest))
                  .then((class_) => {
                    if (class_) {
                      this.props.navigation.state.params.onNavigateBack()
                      this.props.navigation.goBack()
                    } else {
                      Alert.alert('ERROR: Class couldn\'t be created.')
                    }
                  })
              }
            }
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
                    <Text style={styles.buttonText}>ADD CLASS</Text>
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
