import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  
    const navigate = useNavigate();
    console.log("GO TO HOME INDEX")
    const joinRoom = () => {
        if (room !== '' && username !== '') {
            console.log(username, room)
          socket.emit('join_room', { username, room });
        }
        navigate('/chat', { replace: true });
      };
    return (
        <div className={styles.container}>
        <div className={styles.formContainer}>
            <h1>{`QuickChat`}</h1>
            <input 
                className={styles.input}
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
            />

            <select 
                className={styles.input}
                onChange={(e) => setRoom(e.target.value)}
            >
            <option>-- Select Room --</option>
            <option value='Room 1'>Room 1</option>
            <option value='Room 2'>Room 2</option>
            <option value='Room 3'>Room 3</option>
            <option value='Room 4'>Room 4</option>
            </select>

            <button 
            className='btn btn-secondary' 
            style={{ width: '100%' }}
            onClick={joinRoom}
            >
                Join Room
            </button>
        </div>
    </div>
    );
};

export default Home;