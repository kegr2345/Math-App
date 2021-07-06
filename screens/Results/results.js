import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Image
} from 'react-native'
import ResponsiveImage from 'react-native-responsive-image';
import { Icon, Card } from 'react-native-elements'
import Controller from './controller'
import * as Speech from 'expo-speech'
let image = require('../../Images/fireworks.gif')

export default class Results extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginRequest: null,
      resultTitle: '',
      resultMessage: '',
      showImage: false
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

  // logic is here to implement dynamic results screen based on previous sprint scores in the future
  renderResults = async () => {
    // let score = await AsyncStorage.getItem('score')
    // let numScore = parseInt(score)
    // if (numScore > 0.5) {
    //   this.setState({
    //     showImage: true,
    //     resultTitle: 'Congratulations!',
    //     resultMessage: 'You have improved since your last attempt!'
    //   })
    // } else {
    //   this.setState({
    //     showImage: false,
    //     resultTitle: 'Great Work!',
    //     resultMessage: 'Remember, practice makes perfect!'
    //   })
    // }
    this.setState({
      showImage: true,
      resultTitle: 'Great Work!',
      resultMessage: 'Remember, practice makes perfect!'
    })
  }

  renderImage () {
    if (this.state.showImage) {
      return (
        <View style={styles.logoContainer}>
          <ResponsiveImage
            initWidth='200'
            initHeight='200'
            source={ image }
          />
        </View>
        )
    } else {
      return null
    }
  }

  componentDidMount = async () => {
    await this.checkLogin()
    this.renderResults()
  }

  render () {
    Speech.stop()
    return (
      <View style={styles.container}>
        <Card>     
          {  
            this.renderImage()  
          }
          <Text style={styles.title}>
            {this.state.resultTitle}
          </Text>
          <Text style={styles.title}>
            {this.state.resultMessage}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('ExitSprint')}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#209eff',
    justifyContent: 'center',
    paddingBottom: 75
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#000',
    textAlign: 'center'
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    textShadowColor: 'black',
    textShadowRadius: 2,
    fontSize: 18
  },
  logoContainer: {
    alignItems: 'center'
  },
  button: {
    width: '100%',
    backgroundColor: '#614BF2',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 50
  },
  icon: {
    marginLeft: 10
  }
})
