import React, { useEffect, useState } from 'react';

function App() {
    //   const [getMessage, setGetMessage] = useState({})
    //   const [currentTime, setCurrentTime] = useState(0);

    //   useEffect(() => {
    //     fetch('http://localhost:5000/time').then(res => res.json()).then(data => {
    //       setCurrentTime(data.time);
    //     });
    //   }, []);

    //   useEffect(()=>{
    //     axios.get('http://localhost:5000/').then(response => {
    //       console.log("SUCCESS", response)
    //       setGetMessage(response)
    //     }).catch(error => {
    //       console.log(error)
    //     })  }, [])
    return (
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                {/* <Sidenav /> */}
                {/* <p>The current time is {currentTime}.</p> */}
                {/* <div>{getMessage.status === 200 ? 
          <h3>{getMessage.data.message}</h3>
          :
          <h3>LOADING</h3>}</div> */}
            </header>
        </div>
    );
}

export default App;