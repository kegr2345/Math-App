import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
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
      await AsyncAlert('ERROR', 'Something went wrong. Reload page.')
      this.props.navigation.goBack()
    }
  }

  deleteRow = async (data, key) => {
    let success = await Controller.del(this.state.loginRequest, data.item.id)

    if (success) {
      const newData = [...this.state.data];
      const prevIndex = this.state.data.findIndex(item => item.key === key);
      newData.splice(prevIndex, 1);
      this.setState({ data: newData });
    } else {
      await AsyncAlert('ERROR', 'Something went wrong. Try again.')
    }
  };

  renderItem = (data, extraData, rowMap, rowKey) => (
    <ListItem
      title={data.item.name}
      leftAvatar={{ source: { uri: `https://ui-avatars.com/api/?name=${data.item.name}`}}}
      onPress={() => this.props.navigation.navigate("SetManager", {title: data.item.name, student: data.item, onNavigateBack: this.handleOnNavigateBack})}
      bottomDivider
      rightElement = {this.state.deleteToggle ? 
        <Icon
          reverse
          name='ios-trash'
          type='ionicon'
          color='#ff9999'
          size={10}
          onPress={() => this.deleteRow(data, data.item.key)}
        /> : null
      }
      chevron
    />
  )

  renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
        <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => this.deleteRow(data, data.item.key)}
        >
            <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
    </View>
  );

  deleteToggle = () => {
    this.setState({ deleteToggle: !this.state.deleteToggle});
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
              extraData={this.state}
              renderItem={this.renderItem}
              renderHiddenItem={this.renderHiddenItem}
              rightOpenValue={-75}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
          />
        </View>       
        <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <TouchableOpacity 
                style={styles.footerButton}                      
                onPress={this.deleteToggle}           
              >
                <Text style={styles.footerText}>Delete Students</Text>
                <Icon
                  name='ios-trash'
                  type='ionicon'
                  color='#fff'
                  size={25}
                  containerStyle={styles.footerIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.footerRight}>
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={() => 
                  this.props.navigation.navigate('NewStudent', {
                    onNavigateBack: this.handleOnNavigateBack, class: this.state.class
                  })}
              >
                <Text style={styles.footerText}>New Student</Text>
                <Icon
                  name='ios-add-circle-outline'
                  type='ionicon'
                  color='#fff'
                  size={25}
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
