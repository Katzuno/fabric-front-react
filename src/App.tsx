import React from 'react';
import './App.css';
import { Container } from 'reactstrap';
import RecordComponent from './RecordComponent';

function App() {
    return (
        <div className="App">
            <Container>
                <h1>Records API</h1>
                <RecordComponent />
            </Container>
        </div>
    );
}

export default App;
