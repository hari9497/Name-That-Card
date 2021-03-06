import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LeaderboardEntry from './LeaderboardEntry.jsx';
import * as leaderboardActions from '../actions/leaderboardActions';

const mapStateToProps = store => ({
  results: store.leaderboardReducer.results,
  sortDirection: store.leaderboardReducer.sortDirection,
  sortCategory: store.leaderboardReducer.sortCategory,
});

const mapDispatchToProps = dispatch => ({
  changeLeaderboardSortCategory: (category) => {
    dispatch(leaderboardActions.changeLeaderboardSortCategory(category));
  },
  toggleSortDirection: () => {
    dispatch(leaderboardActions.toggleSortDirection());
  },
});

const Leaderboard = (props) => {
  const { selectedGame, changeLeaderboardDifficulty, leaderboardDifficulty, results, sortCategory, changeLeaderboardSortCategory, sortDirection } = props;
  const selectedGameRoute = `/gameMenu/${selectedGame}`;
  let difficultyFilteredResults = [];

  results.forEach((resultsObj, i) => {
    if(resultsObj.difficulty_level === leaderboardDifficulty) {
      difficultyFilteredResults.push(resultsObj)
    }
  });

  function sortResults(arr) {
    console.log('sort cat ', sortCategory)
    if (sortCategory === 'user') {
      if (sortDirection) {
        console.log('ran 1')
        return arr.sort((a, b) => {
          console.log('a user ', a.user)
          console.log('b user ', b.user)
          const x = a.user.toLowerCase();
          const y = b.user.toLowerCase();
          if(x < y) {return -1;}
          if(x > y) {return 1;}
          return 0;
          //return a.user.toLowerCase() < b.user.toLowerCase();
        // arr.sort((a, b) => a.game.toLowerCase() < b.game.toLowerCase())
        })
      }
      console.log('ran 2')
      return arr.sort((a, b) => {
        console.log('a user 2', a.user)
        console.log('b user 2', b.user)
        const x = a.user.toLowerCase();
        const y = b.user.toLowerCase();
        if(x > y) {return -1;}
        if(x < y) {return 1;}
        return 0;
        //return a.user.toLowerCase() < b.user.toLowerCase();
      })
    }
    if (sortDirection) {
      console.log('ran 3')
      return arr.sort((a, b) => Number(b[sortCategory]) - Number(a[sortCategory]));
    }
    console.log('ran 4')
    return arr.sort((a, b) => Number(a[sortCategory]) - Number(b[sortCategory]));
  }

  difficultyFilteredResults = sortResults(difficultyFilteredResults);
  console.log('difficultyFilteredResults ', difficultyFilteredResults);

  const leaderboardEntries = difficultyFilteredResults.map((resultObj, i) => {
    return <LeaderboardEntry numEntries={difficultyFilteredResults.length} key={i} entryContents={resultObj} rank={i} sortDirection={sortDirection}/>;
  })

  return (
    <div className="leaderboardContainer">
      <h1 className="headers">{selectedGame}</h1>
      <div className="right-menu"><NavLink to={selectedGameRoute}>X</NavLink></div>
      <div>
        Leaderboard
      </div>
      <div>
        <div className="right-menu">
          <span className="leaderboardFilter" onClick={() => changeLeaderboardDifficulty('ALL')}>ALL</span>
          <span className="leaderboardFilter" onClick={() => changeLeaderboardDifficulty('EASY')}>EASY</span>
          <span className="leaderboardFilter" onClick={() => changeLeaderboardDifficulty('MEDIUM')}>MEDIUM</span>
          <span className="leaderboardFilter" onClick={() => changeLeaderboardDifficulty('HARD')}>HARD</span>
        </div>
      </div>
      <div>
        <table className="leaderboard">
          <tbody>
            <tr className="leaderboardRow">
              <th>RANK</th>
              <th onClick={() => changeLeaderboardSortCategory('user')}>PLAYER</th>
              <th onClick={() => changeLeaderboardSortCategory('sum')}>TOTAL POINTS</th>
              <th onClick={() => changeLeaderboardSortCategory('avg')}>AVERAGE SCORE</th>
              <th onClick={() => changeLeaderboardSortCategory('gamecount')}> TOTAL GAMES PLAYED</th>
            </tr>
            {leaderboardEntries}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
