import React, { Fragment } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/tweets";

class App extends React.Component {
  state = {
    tweetBody: "",
    tweetUser: "",
    tweets: []
  };

  listAllTweets = () => {
    fetch(API_URL)
    .then(response=>response.json())
    .then(tweets => {
      tweets.reverse();
      this.setState({tweets});
    });
  }

  handleTweetChange = (event) => {
    this.setState({
      tweetBody: event.target.value,
    });
  };

  handleUserChange = (event) => {
    this.setState({
      tweetUser: event.target.value,
    });
  };

  handleSubmit = (event) => {
    const { tweetBody, tweetUser } = this.state;
    const tweet = {
      tweetUser,
      tweetBody,
    };

    // TODO: Hide Form on Tweet and ReEnable or Just Clear Form.

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(tweet),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((createdTweet) => this.listAllTweets());
    event.preventDefault();
  };

  componentDidMount() {
    this.listAllTweets();
  }

  render() {
    return (
      <Fragment>
        <header>
          <h1 className="title"> React Twitter Clone App </h1>
        </header>
        <main>
          <form className="tweet-form">
            <div className="form-group">
              <label htmlFor="name"> User </label>
              <input
                onChange={this.handleUserChange}
                className="form-control"
                type="text"
                id="user"
                name="user"
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="tweet"> Tweet what you want </label>
              <textarea
                onChange={this.handleTweetChange}
                className="form-control"
                type="text"
                id="tweet"
                name="tweet"
              ></textarea>
            </div>
            <button
              onClick={this.handleSubmit}
              type="submit"
              className="btn btn-primary"
            >
              Send your Tweet!
            </button>
          </form>
        </main>
        <div className="tweets">
          {this.state.tweets.map(tweet=> (
            <Fragment>
                <div>
                <h3 key={tweet.created}>{tweet.tweetUser}</h3>
                <p key={tweet._d}>{tweet.tweetBody}</p>
                <small key={tweet._id}>{new Date(tweet.created).toLocaleString()}</small>
              </div>
            </Fragment>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default App;
