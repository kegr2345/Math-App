import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
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

export default class SetProblemManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginRequest: null,
      teacher: null,
      data: null,
      filterToggle: false,
      set: this.props.navigation.state.params.set
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
    
    let teacher = JSON.parse(await AsyncStorage.getItem('teacher'))
    this.setState({teacher: teacher})

    await this.fetchNewData()
  }

  fetchNewData = async () => {
    let problems = await Controller.getProblemByTeacher(this.state.loginRequest, this.state.teacher.id)
    if (problems != null && problems != undefined) {
      let i = 0

      let setHasProblems = await Controller.getSetHasProblemBySet(this.state.loginRequest, this.state.set.id)
  
      for (let problem of problems) {
        problem['key'] = (i++).toString()
        problem.checked = false
  
        for (let setHasProblem of setHasProblems) {
          if (problem.id == setHasProblem.problem_id) {
            problem.checked = true
            problem.set_has_problem_id = setHasProblem.id
          }
        }
      }
  
      if (this.state.filterToggle) {
        for (let i=0; i<problems.length; i++) {
          if (!problems[i].checked){
            problems.splice(i,1)
            i--
          }
        }
      }
  
      this.setState({
        data: problems
      })
    } else {
      await AsyncAlert('ERROR', 'Something went wrong. Reload page.')
      this.props.navigation.goBack()
    }
  }

  checkItem = async (checkedItem) => {

    if (checkedItem.checked) {
      await Controller.deleteSetHasProblem(this.state.loginRequest, checkedItem.set_has_problem_id)

    } else {

      let setHasProblemReq = {
        set_id: this.state.set.id,
        problem_id: checkedItem.id
      }

      await Controller.createSetHasProblem(Object.assign(this.state.loginRequest, setHasProblemReq))      
    }
    
    await this.fetchNewData()
  }

  renderItem = (data, extraData, rowMap, rowKey) => (
    <ListItem
      title={'Problem: ' + data.item.problem}
      subtitle={'Answer: ' + data.item.answer}
      leftAvatar={{ source: { uri: `https://ui-avatars.com/api/?name=${data.item.answer}`}}}
      bottomDivider
      checkBox={{ 
        checked: data.item.checked, 
        onPress: () => this.checkItem(data.item)
      }}
    />
  )

  filterToggle = () => {
      this.setState({ filterToggle: !this.state.filterToggle });
      this.fetchNewData()
  }

  handleOnNavigateBack = async () => {
    this.fetchNewData()
  }

  render() {
    return (
      <View style={styles.container}>     
        <View style={styles.content}>
          <SwipeListView
              data={this.state.data}
              // this line forces component to rerender after any change in state
              extraData={this.state}
              renderItem={this.renderItem}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
          />
        </View>       
        <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <TouchableOpacity 
                style={styles.footerButton}                      
                onPress={this.filterToggle}           
              >
                <Text style={styles.footerText}>Filter Problems</Text>
                <Icon
                  name='filter'
                  type='font-awesome'
                  color='#fff'
                  size={40}
                  containerStyle={styles.footerIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.footerRight}>
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={() =>  
                  this.props.navigation.navigate('NewProblem', {
                    onNavigateBack: this.handleOnNavigateBack, set: this.state.set
                  })}  
              >
                <Text style={styles.footerText}>New Problem</Text>
                <Icon
                  name='ios-add-circle-outline'
                  type='ionicon'
                  color='#fff'
                  size={40}
                  containerStyle={styles.footerIcon}
                />
              </TouchableOpacity>
            </View>
        </View>
      </View>
    )
  } 
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#209eff',
    flex: 1,
  },
  content: {
    marginBottom: 60
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#614BF2'
  },
  footerLeft: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footerRight: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerText: {
    color: '#fff',
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  footerButton: {
    flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      width: 100,
      paddingLeft: 8,
      justifyContent: "center"
  },
  footerIcon: {
    marginLeft: 10
  },
  backTextWhite: {
      color: '#FFF',
  },
  rowFront: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 50,
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#DDD',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },
  backRightBtnLeft: {
      backgroundColor: 'blue',
      right: 75,
  },
  backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
  },
  button: {
    height: 60
  }
})
