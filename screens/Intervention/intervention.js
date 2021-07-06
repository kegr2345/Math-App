import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native';
import { Card } from 'react-native-elements'
import Controller from './controller'
import * as Speech from 'expo-speech'


const AsyncAlert = (title, msg) => new Promise((resolve) => {
  Alert.alert(
    title,
    msg,
    [
      {
        text: 'Okay',
        onPress: () => {
          resolve('YES');
        },
      },
    ],
    { cancelable: false },
  );
}); 

export default class Intervention extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loginRequest: null,
      curProblem: '',
      curAnswer: '',
      curProbIndex: 0,
      maxNumProblems: null,
      inputAnswer: '',
      isCorrect: false,
      openTheKeyboard: false,
      startTimer: false,
      student: null,
      teacher: null,
      problems: [{}]
    }
    this.intervalId = null
    this.pauseId = null
    this.nextProbDelay = null
    this.timeToAnswerDelay = null
    this.totalProblemTime = null
    this.delayArray = []
    this.setLength = []
    this.previousLength = 0
  }
  
  shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
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

  sortSets = (a, b) => {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  componentDidMount = async () => {
    await this.checkLogin()

    let student = JSON.parse(await AsyncStorage.getItem('student'))
    let teacher = JSON.parse(await AsyncStorage.getItem('teacher'))

    this.setState({student: student})
    this.setState({teacher: teacher})
    this.nextProbDelay = student.intervention_between_problem_delay_sec
    
    let sets = await Controller.getSetByStudent(this.state.loginRequest, student.id)

    if (sets != null && sets != undefined && sets != []) {
      sets.sort(this.sortSets)
      
      let setProblems = []

      // This could be simplified/optimized by a SQL query, didn't have time to figure out how the query would look
      num_repeats = 0 //initialize the number of times the set has repeated
      //while loop controls the number of times the set repeats
      while (num_repeats < 3){ //will want to change the 4 to an input variable at some point.
        for (set of sets) { //this is creating the set
          if (set.is_active_intervention && set.id_superceded_by == null) {
            let problems = []          
            let setHasProblems = await Controller.getSetHasProblemBySet(this.state.loginRequest, set.id)
            if (setHasProblems != null && setHasProblems != undefined) {        //if the set has problems in it
              for (setHasProblem of setHasProblems) {
                let problem = await Controller.getProblem(this.state.loginRequest, setHasProblem.problem_id)
                if (problem != null && problem != undefined) {
                  problems.push(Object.assign(problem[0], set))     
                } else {
                  await AsyncAlert('ERROR', 'Something went wrong. Try again.')
                  this.props.navigation.goBack()
                }     
              }
              this.shuffle(problems)                                            //shuffle the set
              setProblems.push(problems)                                        //pushes the problem onto the screen
              this.timeToAnswerDelay = set.intervention_problem_delay_sec
              this.delayArray.push(this.timeToAnswerDelay)                      // add delay to an array to apply later
              this.setLength.push(problems.length)
            } else {
              await AsyncAlert('ERROR', 'Something went wrong. Try again.')
              this.props.navigation.goBack()
            }
          }
        }
        num_repeats++  //increment the repeat count
      }
      
      
      var array = this.setLength                // create an array of each delay corresponding with the index
      var newArray = []                         // of the problem from each set for the intervention
      var k = 0
      for (delay in this.delayArray) {
        for (var j = 0; j < array[k]; j++) {
          newArray.push(this.delayArray[delay])
        }
        k++
      }
      this.delayArray = newArray
      
      let problems = []
  
      for (set of setProblems) {
        for (problem of set) {
          problems.push(problem)
        }
      }
      console.log(problems.length)
      
      
      if (problems.length > 0) {
        this.setState({ problems: problems, maxNumProblems: problems.length})  
        this.setState({ openTheKeyboard: true })

        this.speechMapping(0)

      } else {        
        this.props.navigation.navigate('Results')
      }
        
        
    } else {
      await AsyncAlert('ERROR', 'Something went wrong. Try again.')
      this.props.navigation.goBack()
    }
  }

  componentDidUpdate () {
    if (this.state.openTheKeyboard) {
      this.textInput.focus()
      this.setState({ openTheKeyboard: false })
    }
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  speechMapping (curIndex) {
    var problems = this.state.problems
    var problem = problems[curIndex].problem
    var answerToSay = problems[curIndex].answer

    let options = {
      pitch: 1,
      rate: 0.85,
      onDone: () => {
        var delayId = setTimeout( () => {
          this.nextProblem()
        }, this.nextProbDelay * 1000)    // time between answer spoken and next problem
      }
    }
    let options1 = {
      pitch: 1,
      rate: 0.85,
      onDone: () => {
        var pauseId = setTimeout( () => {     // time between problem and answer
          Speech.speak(answerToSay, options)
        }, this.delayArray[curIndex] * 1000)
      }
    }

    if (problem.includes('-')) {
      var problemToSay = problem.replace('-', 'minus')
    } else if (problem.includes('*')) {
      var problemToSay = problem.replace('*', 'times')
    } else if (problem.includes('/')) {
      var problemToSay = problem.replace('/', 'divided by')
    } else if (problem.includes('+')) {
      var problemToSay = problem
    }
    
    var thingToSay = problemToSay
    Speech.speak(thingToSay + '=', options1)
    
  }

  initializeState = () => {
    this.setState({
      inputAnswer: '',
      isCorrect: false
    })
  }

  handleAnswer = (answer) => {
    this.setState({
      inputAnswer: answer
    })
  }

  isCorrect = () => {
    var inputAnswer = this.state.inputAnswer
    var problems = this.state.problems
    var newIndex = this.state.curProbIndex
    if (inputAnswer === problems[newIndex].answer) {
      console.log('correct')
    } else {
      console.log('incorrect')
    }
  }

  nextProblem = () => {
    this.isCorrect()
    
    if (this.state.curProbIndex === (this.state.maxNumProblems - 1)) {
      this.setState({ openTheKeyboard: false })
      clearInterval(this.intervalId)
      Speech.stop()
      this.props.navigation.navigate('Results')
    } else {
      this.initializeState()
      var index = this.state.curProbIndex
      index++
      this.setState({
        curProbIndex: index
      })
      this.speechMapping(index)
    }
  }

  render () {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Card containerStyle={styles.titleCanvas}>
              <Text style={styles.title}>
                {this.state.problems[this.state.curProbIndex].problem} = {this.state.inputAnswer}
              </Text>
            </Card>

            {/* <Card containerStyle={styles.canvas} /> space for handwriting recognition in the future */}

            <Card containerStyle={styles.submitCanvas}>
              <TextInput
                placeholder='Type Answer'
                style={styles.input}
                keyboardType='number-pad'
                onChangeText={(answer) => this.handleAnswer(answer)}
                keyboardAppearance='dark'
                value={this.state.inputAnswer}
                ref={el => this.textInput = el}
              />
            </Card>
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
    paddingTop: 20
  },
  content: {
    padding: 50,
    backgroundColor: '#000',
    marginBottom: 130
  },
  canvas: {
    flex: 0.5,
    borderRadius: 8
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#000',
    textAlign: 'center',
    borderRadius: 50
  },
  input: {
    width: '100%',
    paddingHorizontal: 10,
    height: 60,
    color: '#000',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 50,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 10
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 40
  },
  button: {
    width: 300,
    backgroundColor: '#3e64ff',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  icon: {
    marginLeft: 10
  },
  titleCanvas: {
    borderRadius: 50
  },
  submitCanvas: {
    borderRadius: 8
  }
})