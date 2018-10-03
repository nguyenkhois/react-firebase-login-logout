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
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log('The user is logged in!');
                this.setState({
                    userInfo: { userId: user.uid },
                    loginStatus: true
                });
            } else {
                // No user is signed in.
                console.log('The user is not logged in!');
            }
        });
    }

    handleLogin = (e) => {
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
                        this.setState({
                            message: {
                                content: 'Login successfully!',
                                style: 'message-success'
                            }
                        });
                    })
                    .catch((error) => {
                        this.setState({
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
        this.setState({ loginInfo: newState });
    }

    handleLogout = (e) => {
        e.preventDefault();
        firebase.auth().signOut()
            .then(() => {
                // Sign-out successful.
                this.setState({
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

    render() {
        const loginFormPart = (
            <div>
                <h3>LOGIN</h3>
                <p>
                    Using the test account:
                    test@email.com (123456)
                </p>

                <form action="#">
                    <input type="text" name="email"
                        placeholder="@your-email-address"
                        onChange={e => this.handleInputChange(e)}
                    />

                    <br />

                    <input type="password" name="password"
                        placeholder="password"
                        onChange={e => this.handleInputChange(e)}
                    />

                    <br />

                    <button type="button"
                        onClick={(e) => this.handleLogin(e)}
                    >
                        Login
                    </button>
                </form>

                <p className={this.state.message.style}>{this.state.message.content}</p>
            </div>
        );

        const userInfoPart = (
            <div>
                <h3>INFORMATION</h3>
                <p className={this.state.message.style}>{this.state.message.content}</p>
                <p>UserID: {this.state.userInfo.userId}</p>
                <button type="button"
                    onClick={(e)=>this.handleLogout(e)}
                >
                    Logout
                </button>
            </div>
        );

        // Main
        if (this.state.loginStatus) {
            return userInfoPart
        }
        return loginFormPart
    }
}