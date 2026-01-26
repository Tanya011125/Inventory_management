import { Link } from 'react-router-dom';

export default function SparesManagement() {
  return (
    <div>
      <h2>Spares Management</h2>

      <Link to="/spares/master">
        <button>Spares Master List</button>
      </Link>

      <Link to="/spares/in">
        <button>Spares In</button>
      </Link>
    </div>
  );
}
