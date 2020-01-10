import React, { useState, useEffect } from "react";
import "./App.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "rbx/index.css";
import { Button, Container, Title, Message } from "rbx";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import CourseList from "./components/CourseList";
import { addScheduleTimes } from "./components/Course/times";

const firebaseConfig = {
  apiKey: "AIzaSyCwxox0RAzZC-koV6-1DgHBSbhO4nZU6TY",
  authDomain: "quick-react-1ed4b.firebaseapp.com",
  databaseURL: "https://quick-react-1ed4b.firebaseio.com",
  projectId: "quick-react-1ed4b",
  storageBucket: "quick-react-1ed4b.appspot.com",
  messagingSenderId: "408600554808",
  appId: "1:408600554808:web:83ea53e9da72db7d0425cd"
};

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    {user ? <Welcome user={user} /> : <SignIn />}
    <Title>{title || "[loading...]"}</Title>
  </React.Fragment>
);

const App = () => {
  // initializes trackable state as schedule var, and function to update the state
  const [schedule, setSchedule] = useState({ title: "", courses: [] });
  const [user, setUser] = useState(null);

  //useEffect usually runs on every render, but w/empty list, only runs on mount
  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on("value", handleData, error => alert(error)); // checks for db changes periodically
    return () => db.off("value", handleData); // cb runs on unmount
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser); // sets user as authenticated user
  }, []);

  return (
    <Container>
      <Banner title={schedule.title} user={user} />
      <CourseList courses={schedule.courses} user={user} />
    </Container>
  );
};

export default App;
