import React from 'react';
import './App.css';
import { useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAq6MgRcB30S9GcGuBfbmnzHX617afPebM",
  authDomain: "chatapp-d5330.firebaseapp.com",
  projectId: "chatapp-d5330",
  storageBucket: "chatapp-d5330.appspot.com",
  messagingSenderId: "58530434917",
  appId: "1:58530434917:web:55030037649af7317e5b8c",
  measurementId: "G-50GP6NRFM8"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

// app should display login when not logged in, and app + logout when user is logged in
function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;

export const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export const SignOut = () => {
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  );
}

export const ChatRoom = () => {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(100); 

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => { // runs function when submit is clicked
    e.preventDefault(); // stops page submit

    const { uid, photoUrl } = auth.currentUser; // gets user id and photo from current user logged in
    // pretty sure photoUrl is something that google should have like uid?
    await messagesRef.add({ // writes a new document with values submitted
      text: formValue,
      // uid: auth.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), // sets time posted
      uid
      // photoUrl // unsupported?
    });

    setFormValue(''); // sets form back to empty
  }

  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>
    <div>
      {/* when form type submit sent, triggers function */}
      <form onSubmit={sendMessage}> 
      {/* input listens for changes here and triggers state change for formValue */}
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">BUTTON</button>
      </form>
    </div>
    </>
  )
}

export const ChatMessage = (props) => {
  const { text, uid, photoUrl } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  // return <p>{text}</p>
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoUrl} />
      <p>{text}</p>
    </div>
  )
}
