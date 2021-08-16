import React from 'react';
import logo from './logo.svg';
import './App.css';
const sanitizer = require('string-sanitizer');

interface IEmailFormState {
  email?: string;
}

class EmailForm extends React.Component<IEmailFormState> {
  state: IEmailFormState;

  constructor(props: any) {
    super(props);
    this.state = { email: '' };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email address:
          <input
            type="text"
            name="emailAddress"
            onChange={this.handleChangeEmail}
            value={this.state.email}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }

  handleChangeEmail(event: any) {
    this.setState({ email: event.target.value });
  }

  handleSubmit() {
    if (!sanitizer.validate.isEmail(this.state.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    const emailAddress = this.state.email;
    console.log(`Sending email to ${emailAddress}.`);
    fetch('http://localhost:5000/send_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'emailAddress': emailAddress }),
    });
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <EmailForm> emailForm </EmailForm>
      </header>
    </div>
  );
}

export default App;
