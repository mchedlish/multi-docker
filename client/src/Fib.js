import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
    error: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all");
    this.setState({
      seenIndexes: seenIndexes.data,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.state.index || this.state.index.trim() === "") {
      this.setState({ error: "Please enter a number" });
      return;
    }

    if (isNaN(this.state.index)) {
      this.setState({ error: "Please enter a valid number" });
      return;
    }

    if (parseInt(this.state.index) > 40) {
      this.setState({ error: "Index must be 40 or less" });
      return;
    }

    try {
      await axios.post("/api/values", {
        index: this.state.index,
      });
      this.setState({ index: "", error: "" });
      this.fetchValues();
      this.fetchIndexes();
    } catch (err) {
      this.setState({
        error: err.response?.data || "An error occurred. Please try again.",
      });
    }
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) =>
              this.setState({ index: event.target.value, error: "" })
            }
          />
          <button>Submit</button>
        </form>

        {this.state.error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {this.state.error}
          </div>
        )}

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
