import Game2048 from './Game-2048/Game-2048';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

function App() {
  return (
    <div>
      <Container>
        <Game2048 />
        <Alert variant="danger">
          <Alert.Heading>Notice!</Alert.Heading>
          <p>This is in beta testing, beware of the bugs!</p>
        </Alert>
      </Container>
    </div>
  );
}

export default App;
