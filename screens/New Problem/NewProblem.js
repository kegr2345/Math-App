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
  Alert,
  AsyncStorage
} from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Icon, Card, Divider } from 'react-native-elements'
import Controller from './controller'

export default class NewProblem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      problem: '',
      answer: '',
      library: null
    }
    this.isDisabled = false
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

  changeProblem (curProblem) {
    this.setState({
      problem: curProblem
    })
  }

  changeAnswer (curAnswer) {
    this.setState({
      answer: curAnswer
    })
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
              initialValues={{ problem: '', answer: '' }}
              validationSchema={
                yup.object({
                  problem: yup.string()
                    .required('Required field'),
                  answer: yup.string()
                    .required('Required field')
                })
              }
              onSubmit={(values, formikActions) => {
                var regex = /^[0-9]{1}(\+|-|\*|\/){1}[0-9]{1}$/
                if (regex.test(values.problem)) {                    
                  let problemRequest = {
                    problem: values.problem,
                    answer: values.answer,
                    library_id: this.state.library.id
                  }

                  Controller.create(Object.assign(this.state.loginRequest, problemRequest))
                    .then((problem) => {
                      if (problem) {
                        this.props.navigation.state.params.onNavigateBack()
                        this.props.navigation.goBack()
                      } else {
                        Alert.alert('ERROR: Problem couldn\'t be created.')
                      }
                    })
                } else {
                  Alert.alert('Problem is not in the correct format, ex: 4*5=')
                }
              }}
            >
              {props => (
                <View>
                  <Card containerStyle={styles.questionCanvas}>
                    <Text style={styles.text}>Your problem:</Text>
                    <Text style={styles.text}>{props.values.problem} = {props.values.answer}</Text>
                    <Text style={styles.buttonText}>ADD PROBLEM</Text>
                    <TextInput
                      placeholder='Problem'
                      style={styles.input}
                      onChangeText={props.handleChange('problem')}
                      onBlur={props.handleBlur('problem')}
                      value={props.values.problem}
                      keyboardType='numbers-and-punctuation'
                      onSubmitEditing={() => {
                        this.answerInput.focus()
                      }}
                    />
                    {props.touched.problem && props.errors.problem ? (
                      <Text style={styles.error}>{props.errors.problem}</Text>
                    ) : null}
                    <TextInput
                      placeholder='Answer'
                      style={styles.input}
                      onChangeText={props.handleChange('answer')}
                      onBlur={props.handleBlur('answer')}
                      value={props.values.answer}
                      keyboardType='numeric'
                      ref={el => this.answerInput = el}
                    />
                    {props.touched.answer && props.errors.answer ? (
                      <Text style={styles.error}>{props.errors.answer}</Text>
                    ) : null}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={props.handleSubmit}
                      mode='contained'
                      loading={props.isSubmitting}
                      disabled={this.isDisabled}
                    >
                      <Text style={styles.buttonText}>ADD PROBLEM</Text>
                    </TouchableOpacity>
                  </Card>
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
    borderColor: 'gray'
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
    fontSize: 18
  },
  text: {
    textAlign: 'center',
    color: '#000',
    fontSize: 35,
    marginTop: 20,
    
  },
  smallText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 12,
    marginTop: 20
  },
  error: {
    fontSize: 20,
    color: 'yellow',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 5,
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  questionCanvas: {
    borderRadius: 8,
    padding: 20
  }
})
