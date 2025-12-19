import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

export function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>

        {!isAuthenticated ? (
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                to="/login"
              >
                Sign in
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                to="/register"
              >
                Sign up
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                to="/editor"
              >
                <i className="ion-compose"></i>&nbsp;New Article
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                to="/settings"
              >
                <i className="ion-gear-a"></i>&nbsp;Settings
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active' : ''}`
                  }
                  to={`/profile/${user.username}`}
                >
                  {user.image && (
                    <img
                      src={user.image}
                      className="user-pic"
                      alt={user.username}
                    />
                  )}
                  {user.username}
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;
