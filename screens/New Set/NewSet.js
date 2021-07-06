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
  Switch,
  AsyncStorage
} from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import Controller from './controller'

export default class NewSet extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      name: '',
      delay: '',
      student: this.props.navigation.state.params.student,
      inSprint: true,
      inIntervention: false,
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

  // const [isEnabled, setIsEnabled] = useState(false)
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
              initialValues={{ name: '', delay: '1', inSprint: true, inIntervention: false }}
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
                let setRequest = {
                  student_id: this.state.student.id,
                  name: values.name,
                  intervention_problem_delay_sec: values.delay,
                  is_active_intervention: this.state.inIntervention,
                  is_active_sprint: this.state.inSprint
                }

                Controller.create(Object.assign(this.state.loginRequest, setRequest))
                  .then((set) => {
                    if (set) {
                      this.props.navigation.state.params.onNavigateBack()
                      this.props.navigation.goBack()
                    } else {
                      Alert.alert('ERROR: Set couldn\'t be created.')
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
                      keyboardType='numeric'
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
                    <Text style={styles.buttonText}>ADD SET</Text>
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
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    height: 40,
    marginTop: 10,
    color: '#000',
    borderRadius: 8,
    borderColor: '#888E9B',
    borderWidth: 1
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