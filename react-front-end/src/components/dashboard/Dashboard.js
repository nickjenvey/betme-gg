import React, { Component } from "react";
import ActiveBetsList from "./ActiveBetsList";
import UpcomingMatches from "./UpcomingMatches";

class Dashboard extends Component {

  render() {
    return (
      <div className="container">
        <div className="dashboard">
          <UpcomingMatches upcomingMatches={this.props.upcomingMatches} />
          <ActiveBetsList activeBets={this.props.activeBets} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
