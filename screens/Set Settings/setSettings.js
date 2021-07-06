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
  AsyncStorage,
  Switch
} from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import Controller from './controller'

export default class SetSettings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      name: this.props.navigation.state.params.set.name,
      delay: this.props.navigation.state.params.set.intervention_problem_delay_sec.toString(),
      set: this.props.navigation.state.params.set,
      inSprint: !!this.props.navigation.state.params.set.is_active_sprint,
      inIntervention: !!this.props.navigation.state.params.set.is_active_intervention
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

  async setSet (values) {
    let setRequest = {
      name: values.name,
      intervention_problem_delay_sec: values.delay,
      student_id: this.state.set.student_id,
      is_active_intervention: this.state.inIntervention,
      is_active_sprint: this.state.inSprint,
    }
    
    let newSet = await Controller.setSet(Object.assign(this.state.loginRequest, setRequest), this.state.set.id)   
    
    if (newSet) {
      this.setState({set: newSet[0]})
    } else {      
      return false
    }
    return true
  }

  toggleSprint = (value) => {
    this.setState({
      inSprint: value,
    })
  }

  toggleIntervention = (value) => {
    this.setState({
      inIntervention: value,
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
              initialValues={{ name: this.state.name, delay: this.state.delay, inSprint: this.state.inSprint, inIntervention: this.state.inIntervention }}
              validationSchema={
                yup.object({
                  name: yup.string()
                    .required('Required field'),
                  delay: yup.number()
                    .required('Required field')
                    .min(0, 'Can\'t have a negative delay.')
                    .max(30, 'Too long')
                })
              }
              onSubmit={(values, formikActions) => {
                this.setSet(values)
                  .then((success) => {
                    if (success) {
                      this.props.navigation.navigate('SetProblemManager', { title: values.name, set: this.state.set})
                    } else {
                      Alert.alert('ERROR: Something went wrong. Try again')
                    }
                  })
              }}
            >
              {props => (
                <View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Set Name:</Text>
                    <TextInput
                      placeholder='Set Name'
                      style={styles.input}
                      onChangeText={props.handleChange('name')}
                      onBlur={props.handleBlur('name')}
                      value={props.values.name}
                      onSubmitEditing={() => {
                        this.delayInput.focus()
                      }}
                    />
                    {props.touched.name && props.errors.name ? (
                      <Text style={styles.error}>{props.errors.name}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Delay (in seconds):</Text>
                    <TextInput
                      placeholder='Delay (in seconds)'
                      style={styles.input}
                      onChangeText={props.handleChange('delay')}
                      onBlur={props.handleBlur('delay')}
                      value={props.values.delay}
                      keyboardType='number-pad'
                      ref={el => this.delayInput = el}
                    />
                    {props.touched.delay && props.errors.delay ? (
                      <Text style={styles.error}>{props.errors.delay}</Text>
                    ) : null}
                  </View>
                  <View style={styles.labelBox}>
                    <Text style={styles.inputLabel}>Include in:</Text>
                  </View>
                  <View style={styles.switchField}>
                    <View style={styles.individualSwitch}>
                      <Text style={styles.inputLabel}>Sprint </Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#green" }}
                        thumbColor={this.state.inSprint ? "#fff" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleSprint}
                        value={this.state.inSprint}
                      />
                    </View>
                    <View style={styles.individualSwitch}>
                      <Text style={styles.inputLabel}>Intervention </Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#green" }}
                        thumbColor={this.state.inIntervention ? "#fff" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleIntervention}
                        value={this.state.inIntervention}
                      />
                    </View>
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
    fontSize: 20,
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
  switchField: {
    alignSelf: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBox: {
    color: '#FFF',
    fontSize: 20,
    alignContent: 'center',
    alignSelf: 'center',
    paddingBottom: 10
  },
  individualSwitch: {
    flexDirection: 'row',
    paddingRight: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  }
})
