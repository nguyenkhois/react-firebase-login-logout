import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginInfo: {
                email: '',
                password: ''
            },
            userInfo: {
                userId: ''
            },
            loginStatus: false,
            message: {
                content: '',
                style:''
            }
        };
    }

    componentDidMount() {
        this.mounted = true;
        console.log('componentDidMount');

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log('The user is logged in!');
                this.handleSetState({
                    userInfo: { userId: user.uid },
                    loginStatus: true,
                    message: {
                        content: 'You are logged in!',
                        style: 'message-success'
                    }
                });
            } else {
                // No user is signed in.
                console.log('The user is not logged in!');
            }
        });
    }

    componentWillUnmount() {
        this.mounted = false;
        console.log('componentWillUnmount');
    }
    
    handleSetState = (payload) => {
        this.mounted ? this.setState(payload) : null;
    }
    
    handleSignInWithEmailPassword = (e) => {
        e.preventDefault();

        // Handle input data
        const email = this.state.loginInfo.email;
        const password = this.state.loginInfo.password;

        // Handle session
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                // Handle login
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userInfo) => {
                        console.log('The UserId:', userInfo.user.uid);
                    })
                    .catch((error) => {
                        this.handleSetState({
                            message: {
                                content: error.code + ': ' + error.message,
                                style: 'message-unsuccess'
                            }
                        });
                    });
                // End of handling login
            })
            .catch();
        // End of handling session
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const newState = { ...this.state.loginInfo, [name]: value };
        this.handleSetState({ loginInfo: newState });
    }

    handleSignOut = (e) => {
        e.preventDefault();
        firebase.auth().signOut()
            .then(() => {
                // Sign-out successful.
                this.handleSetState({
                    loginStatus: false,
                    message: {
                        content: 'You are logged out!',
                        style: 'message-success'
                    }
                });
            })
            .catch((error) => {
                // An error happened.
                console.log(error);
            });
    }

    handleSignInWithGoogle = (e) => {
        e.preventDefault();

        // The redirect method is preferred on mobile devices
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);

        firebase.auth().getRedirectResult()
            .then((result) => {
                if (result.credential) {
                    console.log('Access token:',result.credential.accessToken)
                }
                console.log(result.user);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    render() {
        const loginFormPart = (
            <div>
                <h3>LOGIN</h3>
                <p>
                    Using the test account:
                    test@email.com (123456)
                </p>

                <p className={this.state.message.style}>{this.state.message.content}</p>

                <form action="#">
                    <input type="text" name="email"
                        maxLength="30"
                        placeholder="@your-email-address"
                        onChange={(e) => this.handleInputChange(e)}
                    />

                    <br />

                    <input type="password" name="password"
                    maxLength="30"
                        placeholder="password"
                        onChange={(e) => this.handleInputChange(e)}
                    />

                    <br />

                    <button type="button"
                        onClick={(e) => this.handleSignInWithEmailPassword(e)}
                    >
                        Sign in with email
                    </button>

                    <br/>

                    <button type="button"
                        onClick={(e) => this.handleSignInWithGoogle(e)}
                    >
                        <img src="./images/google-logo.png" alt=""/>
                        Sign in with Google 
                    </button>
                </form>

            </div>
        );

        const userInfoPart = (
            <div>
                <h3>INFORMATION</h3>
                <p className={this.state.message.style}>{this.state.message.content}</p>
                <p>UserID: {this.state.userInfo.userId}</p>
                <button type="button"
                    onClick={(e)=>this.handleSignOut(e)}
                >
                    Sign out
                </button>
            </div>
        );

        // Main part
        if (this.state.loginStatus) {
            return userInfoPart
        }
        return loginFormPart
    }
}