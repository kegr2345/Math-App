import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'

import { Icon } from 'react-native-elements'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'

import Login from '../screens/Login/login'
import TeacherPortal from '../screens/Teacher Portal/teacherPortal'
import ClassManager from '../screens/Class Manager/classManager'
import SetProblemManager from '../screens/Set Problem Manager/setProblemManager'
import ProblemManager from '../screens/Problem Manager/problemManager'
import ClassPicker from '../screens/Class Picker/classPicker'
import StudentPicker from '../screens/Student Picker/studentPicker'
import StudentManager from '../screens/Student Manager/studentManager'
import SetManager from '../screens/Set Manager/setManager'
import ClassSettings from '../screens/Class Settings/classSettings'
import StudentSettings from '../screens/Student Settings/studentSettings'
import SetSettings from '../screens/Set Settings/setSettings'
import Pin from '../screens/PIN/pin'
import Intervention from '../screens/Intervention/intervention'
import Sprint from '../screens/Sprint/sprint'
import Results from '../screens/Results/results'
import NewClass from '../screens/New Class/NewClass'
import NewStudent from '../screens/New Student/NewStudent'
import NewSet from '../screens/New Set/NewSet'
import NewProblem from '../screens/New Problem/NewProblem'
import ResetPin from '../screens/Reset Pin/ResetPin'
import TransitionScreen from '../screens/Transition Screen/TransitionScreen'
import InitiationScreen from '../screens/Initiation Screen/initiationScreen'
import ExitSprint from '../screens/Exit Sprint/ExitSprint'
import SetPin from '../screens/Set Pin/SetPin'

const screens = {
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  },
  TeacherPortal: {
    screen: TeacherPortal,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Teacher Portal',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => null,
      gestureEnabled: false
    })
  },
  Pin: {
    screen: Pin,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Start Sprint and Intervention',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      gestureEnabled: false,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  Intervention: {
    screen: Intervention,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Math Practice',
      headerShown: false
    })
  },
  Sprint: {
    screen: Sprint,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Math Sprint',
      headerShown: false
    })
  },
  Results: {
    screen: Results,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Results',
      headerShown: false
    })
  },
  ClassPicker: {
    screen: ClassPicker,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Select A Class',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  StudentPicker: {
    screen: StudentPicker,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Select A Student',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  ClassManager: {
    screen: ClassManager,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Class Manager',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  StudentManager: {
    screen: StudentManager,
    navigationOptions: ({ navigate, navigation }) => ({
      title: `${navigation.state.params.title}`,
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.state.params.onNavigateBack()
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () =>
        <TouchableOpacity
          style={styles.headerButtonRight}
          onPress={() => {
            navigation.navigate('ClassSettings', { title: navigation.state.params.title, class: navigation.state.params.class })
          }}
        >
          <Text style={styles.headerTextRight}>Settings</Text>
          <Icon
            name='cog'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconRight}
          />
        </TouchableOpacity>
    })
  },
  SetManager: {
    screen: SetManager,
    navigationOptions: ({ navigate, navigation }) => ({
      title: `${navigation.state.params.title}`,
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.state.params.onNavigateBack()
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () =>
        <TouchableOpacity
          style={styles.headerButtonRight}
          onPress={() => navigation.navigate('StudentSettings', { title: navigation.state.params.title, student: navigation.state.params.student })}
        >
          <Text style={styles.headerTextRight}>Settings</Text>
          <Icon
            name='cog'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconRight}
          />
        </TouchableOpacity>
    })
  },
  SetProblemManager: {
    screen: SetProblemManager,
    navigationOptions: ({ navigate, navigation }) => ({
      title: `${navigation.state.params.title}`,
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.state.params.onNavigateBack()
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () =>
        <TouchableOpacity
          style={styles.headerButtonRight}
          onPress={() => navigation.navigate('SetSettings', { title: navigation.state.params.title, set: navigation.state.params.set })}
        >
          <Text style={styles.headerTextRight}>Settings</Text>
          <Icon
            name='cog'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconRight}
          />
        </TouchableOpacity>
    })
  },
  ProblemManager: {
    screen: ProblemManager,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Problem Manager',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  ClassSettings: {
    screen: ClassSettings,
    navigationOptions: ({ navigate, navigation }) => ({
      title: `${navigation.state.params.title} Settings`,
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  StudentSettings: {
    screen: StudentSettings,
    navigationOptions: ({ navigate, navigation }) => ({
      title: `${navigation.state.params.title} Settings`,
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  SetSettings: {
    screen: SetSettings,
    navigationOptions: ({ navigate, navigation }) => ({
      title: `${navigation.state.params.title} Settings`,
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  NewClass: {
    screen: NewClass,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'New Class',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  NewStudent: {
    screen: NewStudent,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'New Student',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  NewSet: {
    screen: NewSet,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'New Set',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  NewProblem: {
    screen: NewProblem,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'New Problem',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  ResetPin: {
    screen: ResetPin,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Reset PIN',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  TransitionScreen: {
    screen: TransitionScreen,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Transition Screen',
      headerShown: false
    })
  },
  InitiationScreen: {
    screen: InitiationScreen,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Start Sprint',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.navigate('ExitSprint')
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  ExitSprint: {
    screen: ExitSprint,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Exit Sprint',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon
            name='chevron-left'
            type='font-awesome'
            color='#fff'
            size={25}
            containerStyle={styles.headerIconLeft}
          />
          <Text style={styles.headerTextRight}>Back</Text>
        </TouchableOpacity>
      )
    })
  },
  SetPin: {
    screen: SetPin,
    navigationOptions: ({ navigate, navigation }) => ({
      title: 'Set PIN',
      headerStyle: { backgroundColor: '#614BF2' },
      headerTitleStyle: { color: '#FFF', textShadowColor: 'black', textShadowRadius: 2 },
      headerLeft: () => { null }
    })
  }
}

const styles = StyleSheet.create({
  headerTextRight: {
    color: '#fff',
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  headerButtonRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    paddingLeft: 8,
    justifyContent: 'center'
  },
  headerIconRight: {
    marginLeft: 10,
    marginRight: 25
  },
  headerTextLeft: {
    color: '#fff',
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  headerButtonLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    paddingRight: 8,
    justifyContent: 'center',
    textShadowColor: 'black',
    textShadowRadius: 2
  },
  headerIconLeft: {
    marginRight: 10
  }
})

const RoutingStack = createStackNavigator(screens)

export default createAppContainer(RoutingStack)
