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

export default class StudentSettings extends Component {
  constructor(props) {
      super(props)

      this.state = {
        loginRequest: null,
        student: this.props.navigation.state.params.student,
        name: this.props.navigation.state.params.student.name,
        sprintLength: this.props.navigation.state.params.student.sprint_length_sec.toString(),
        betweenProblemDelay: this.props.navigation.state.params.student.intervention_between_problem_delay_sec.toString()
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


  async setStudent (values) {
    let studentRequest = {
      name: values.name,
      intervention_between_problem_delay_sec: values.betweenProblemDelay,
      sprint_length_sec: values.sprintLength
    }
    
    let success = await Controller.setStudent(Object.assign(this.state.loginRequest, studentRequest), this.state.student.id)

    if (success) {
      let newStudent = { ...this.state.student }
      newStudent.name = values.name
      newStudent.sprint_length_sec = values.sprintLength
      newStudent.intervention_between_problem_delay_sec = values.betweenProblemDelay
  
      this.setState({student: newStudent})
    } else {      
      return false
    }
    return true
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View style={styles.container}>
            <Formik
              initialValues={ this.state }
              validationSchema={
                yup.object({
                  name: yup.string()
                    .required('Required field'),
                  sprintLength: yup.number()
                    .required('Required field')
                    .min(0, 'Can\'t have a negative delay.')
                    .max(300, 'Too long'),
                  betweenProblemDelay: yup.number()
                    .required('Required field')
                    .min(0, 'Can\'t have a negative delay.')
                    .max(30, 'Too long')
                })
              }
              onSubmit={(values, formikActions) => {
                this.setStudent(values)
                  .then((success) => {
                    if (success) {
                      this.props.navigation.navigate('SetManager', { title: values.name, student: this.state.student })
                    } else {                            
                      Alert.alert('ERROR: Something went wrong. Try again')
                    }
                  })
              }}
            >
              {props => (
                <View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Student Name:</Text>
                    <TextInput
                        placeholder='Student Name'
                        style={styles.input}
                        onChangeText={props.handleChange('name')}
                        onBlur={props.handleBlur('name')}
                        value={props.values.name}
                    />
                    {props.touched.name && props.errors.name ? (
                      <Text style={styles.error}>{props.errors.name}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Sprint Length (in seconds):</Text>
                    <TextInput
                      placeholder='Sprint Length (in seconds)'
                      style={styles.input}
                      onChangeText={props.handleChange('sprintLength')}
                      onBlur={props.handleBlur('sprintLength')}
                      value={props.values.sprintLength}
                      keyboardType='number-pad'
                    />
                    {props.touched.sprintLength && props.errors.sprintLength ? (
                      <Text style={styles.error}>{props.errors.sprintLength}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Delay Between Intervention Problems:</Text>
                    <TextInput
                      placeholder='Delay Between Problems (in seconds)'
                      style={styles.input}
                      onChangeText={props.handleChange('betweenProblemDelay')}
                      onBlur={props.handleBlur('betweenProblemDelay')}
                      value={props.values.betweenProblemDelay}
                      keyboardType='number-pad'
                    />
                    {props.touched.betweenProblemDelay && props.errors.betweenProblemDelay ? (
                      <Text style={styles.error}>{props.errors.betweenProblemDelay}</Text>
                    ) : null}
                  </View>
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
      fontSize: 17,
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
