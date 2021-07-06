import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import Controller from './controller'


export default class StudentPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginRequest: null,
      data: null,
      deleteToggle: false,
      update: 0,
      teacher: null
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
    let teacher = JSON.parse(await AsyncStorage.getItem('teacher'))
    this.setState({ teacher: teacher})
    let classes = await Controller.getByTeacher(this.state.loginRequest, teacher.id)
    if (classes != null && classes != undefined) {
      let i = 0

      classes.forEach(element => {
        element['key'] = (i++).toString()
      })
      this.setState({
        data: classes
      })
    } else {
      await AsyncAlert('ERROR', 'Something went wrong. Try again.')
      this.props.navigation.goBack()      
    }
  }

  renderItem = (data, extraData, rowMap, rowKey) => (
    <ListItem
      title={data.item.name}
      leftAvatar={{ source: { uri: `https://ui-avatars.com/api/?name=${data.item.name}`}}}
      onPress={() => this.props.navigation.navigate("StudentPicker", {title: data.item.name, class: data.item, teacher: this.state.teacher})}
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
