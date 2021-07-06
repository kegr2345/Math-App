import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import Controller from './controller'


export default class StudentManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginRequest: null,
      data: null,
      deleteToggle: false,
      class: this.props.navigation.state.params.class
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
    await this.fetchNewData()
  }

  fetchNewData = async () => {
    let students = await Controller.getByClass(this.state.loginRequest, this.state.class.id)
    
    if (students != null && students != undefined) {      
      let i = 0

      students.forEach(element => {
        element['key'] = (i++).toString()
      })
      this.setState({
        data: students
      })
    } else {      
      await AsyncAlert('ERROR', 'Something went wrong. Try again.')
      this.props.navigation.goBack()
    }
  }

  setStudent = async (student) => {
    await AsyncStorage.setItem('student', JSON.stringify(student))
  }

  renderItem = (data, extraData, rowMap, rowKey) => (
    <ListItem
      title={data.item.name}
      leftAvatar={{ source: { uri: `https://ui-avatars.com/api/?name=${data.item.name}`}}}
      onPress={() => {
        this.setStudent(data.item)
          .then(() => this.props.navigation.navigate("Pin", {title: data.item.name, student: data.item}))        
      }}
      bottomDivider
      chevron
    />
  )

  render() {

    return (
      <View style={styles.container}>     
        <SwipeListView
            data={this.state.data}
            extraData={this.state}
            renderItem={this.renderItem}
        />
      </View>
    )
  } 
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#209eff',
    flex: 1,
  }
})
