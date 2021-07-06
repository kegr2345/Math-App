import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  AsyncStorage
} from 'react-native'
import { Icon, Card } from 'react-native-elements'
import Controller from './controller'

// await AsyncAlert('ERROR', 'Something went wrong. Try again.')
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

export default class Sprint extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      curProblem: '',
      correctAnswer: '',
      curProbIndex: 0,
      curSetIndex: 0,
      maxNumProblems: null,
      inputAnswer: '',
      openTheKeyboard: false,
      isDisabled: false,
      setIndex: 0,
      problems: [{}],
      student: null,
      teacher: null,
      sessionId: null
    }
    this.sprintLength = 0
    this.digitsCorrect = 0
    this.totalDigitsCorrect = 0
    this.totalAnswerDigits = 0
    this.nextProblem.bind(this)
    this.isCorrect.bind(this)
    this.handleAnswer.bind(this)
    this.initializeState.bind(this)
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
    
    let sessionReq = {
      student_id: student.id,
      proctor_teacher_id: teacher.id,
      student_sprint_length_sec: student.sprint_length_sec,
      student_intervention_between_problem_delay_sec: student.intervention_between_problem_delay_sec
    }

    let sessionId = await Controller.createSession(Object.assign(this.state.loginRequest, sessionReq))

    if (sessionId != null && sessionId != undefined) {
      this.setState({student: student})
      this.setState({teacher: teacher})
      this.setState({sessionId: sessionId[0]})
      
      let sets = await Controller.getSetByStudent(this.state.loginRequest, student.id)

      if (sets != null && sets != undefined && sets != []) {
        sets.sort(this.sortSets)
        
        let setProblems = []
        let countProblems = 0

        // This could be simplified by a SQL query, didn't have time to figure out how the query would look
        
        for (set of sets) {
          if (set.is_active_sprint && set.id_superceded_by == null) {
            let problems = []          
            let setHasProblems = await Controller.getSetHasProblemBySet(this.state.loginRequest, set.id)
            if (setHasProblems != null && setHasProblems != undefined) {
              if (setHasProblems.length > 0) {
                for (setHasProblem of setHasProblems) {
                  let problem = await Controller.getProblem(this.state.loginRequest, setHasProblem.problem_id)
                  if (problem != null && problem != undefined) {
                    set.set_id = set.id
                    problem[0].problem_id = problem[0].id  
                    problems.push(Object.assign(problem[0], set))
                    countProblems++
                  } else {                  
                      await AsyncAlert('ERROR', 'Something went wrong. Try again.')
                      this.props.navigation.goBack()
                    }
                }  
                setProblems.push(problems)
              }
            } else {
              await AsyncAlert('ERROR', 'Something went wrong. Try again.')
              this.props.navigation.goBack()
            }
          }
        }
        
        if (countProblems > 0) {
          problems = setProblems[0]
          this.shuffle(problems)
    
          this.setState({problems: problems, maxNumProblems: Object.keys(problems).length})        
            
          this.setState({ openTheKeyboard: true })

          // I will admit, the below solution is pretty hacky but it works 
          var i = 0
          var j = 0
          var pause = false
          var timeoutId = setInterval(async () => {
            if (!pause) {
              i++
            } 
            if (i >= this.state.student.sprint_length_sec * setProblems.length) {
              clearInterval(timeoutId)
              var score = this.totalDigitsCorrect / this.totalAnswerDigits
              var stringScore = score.toString()
              await AsyncStorage.setItem('score', stringScore)
              await AsyncAlert('Time\'s up! Good Work!')
              this.props.navigation.navigate('TransitionScreen')
            } else if (i % this.state.student.sprint_length_sec === 0 && i != 0 && !pause){
              pause = true
              this.initializeState()
              await AsyncAlert('Good job!', 'Press okay to go to the next sprint!')
              pause = false
              j++
              await this.shuffle(setProblems[j])
              await this.setState({problems: setProblems[j], maxNumProblems: Object.keys(setProblems[j]).length})
            }
          }, 1000)
        } else {          
            await AsyncAlert('ERROR', 'No problems found. Check that sets and problems are configured correctly.')
            this.props.navigation.navigate('ExitSprint')
          }
          
        
                 
      } else {
        await AsyncAlert('ERROR', 'Something went wrong. Try again.')
        this.props.navigation.goBack()
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

  initializeState () {
    this.setState({
      inputAnswer: '',
      isCorrect: false
    })
  }

  handleAnswer (answer) {
    if (this.state.isDisabled) {
      this.setState({ isDisabled: false, inputAnswer: answer })
    } else {
      this.setState({
        inputAnswer: answer
      })
    }
  }

  isCorrect = () => {
    var problems = this.state.problems
    var index = this.state.curProbIndex
    var studentAnswer = this.state.inputAnswer
    var correctAnswer = problems[index].answer
    var correctLength = correctAnswer.length
    this.totalAnswerDigits = this.totalAnswerDigits + correctLength

    this.digitsCorrect = 0
    if (studentAnswer === correctAnswer) {
      this.digitsCorrect = correctLength
    } else {
      for (let i = 0; i < correctLength; i++) {
        if (studentAnswer.charAt(i) === correctAnswer.charAt(i)) {
          this.digitsCorrect++
        }
      }   
    }
    this.totalDigitsCorrect = this.totalDigitsCorrect + this.digitsCorrect

    return this.digitsCorrect
  }

  nextProblem = async () => {
    if (this.state.inputAnswer === '') {
      this.setState({ isDisabled: true })
      Alert.alert('Don\'t leave a blank answer, type something in!')
    } else {
      let digitsCorrect = this.isCorrect()   
      let problem = this.state.problems[this.state.curProbIndex % this.state.problems.length]

      let attemptReq = {
        session_id: this.state.sessionId,
        set_id: problem.set_id,
        problem_id: problem.problem_id,
        input: this.state.inputAnswer,
        interpretation: digitsCorrect == problem.answer.length,
        digits_correct: digitsCorrect
      }
    
      let attempt = await Controller.createAttempt(Object.assign(this.state.loginRequest, attemptReq))
      
      if (attempt) {
        this.initializeState()

        var newIndex = this.state.curProbIndex
        newIndex++

        this.setState({
          curProbIndex: newIndex
        })

        if (this.state.curProbIndex === this.state.problems.length) {            
          newIndex = 0
          this.setState({ curProbIndex: 0 })
        }
      } else {          
        await AsyncAlert('ERROR', 'Something went wrong. Try again.')
      }
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
            <Card containerStyle={styles.titleCanvas}>
              <Text style={styles.title}>
                {this.state.problems[this.state.curProbIndex % this.state.problems.length].problem} = {this.state.inputAnswer}
              </Text>
            </Card>

            {/* <Card containerStyle={styles.canvas} /> space for handwriting recognition in the future */}

            <Card containerStyle={styles.submitCanvas}>
              <TextInput
                placeholder='Type Answer'
                onChangeText={(answer) => this.handleAnswer(answer)}
                style={styles.input}
                keyboardType='number-pad'
                keyboardAppearance='dark'
                value={this.state.inputAnswer}
                ref={el => this.textInput = el}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.nextProblem()}
                disabled={this.state.isDisabled}
              >
                <Text style={styles.buttonText}>Next Problem</Text>
                <Icon
                  name='ios-arrow-forward'
                  type='ionicon'
                  color='#fff'
                  size={25}
                  containerStyle={styles.icon}
                />
              </TouchableOpacity>
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
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#000',
    textAlign: 'center',
    paddingBottom: 5,
    paddingTop: 5
  },
  input: {
    width: '100%',
    paddingHorizontal: 10,
    height: 60,
    color: '#000',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 50,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
    textAlign: 'center'
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 40
  },
  button: {
    width: 300,
    backgroundColor: '#614BF2',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    alignSelf: 'center',
    height: 70
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
