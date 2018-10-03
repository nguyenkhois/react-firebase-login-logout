import React, { Component } from 'react';
import firebase from 'firebase/app';

import { firebaseConfig } from './config';
import { Login } from './components/login';

firebase.initializeApp(firebaseConfig);

export default class App extends Component {
    render() {
        return (
            <div>
                <Login/>
            </div>
        )
    }
};
