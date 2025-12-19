import { useParams } from 'react-router-dom';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src=""
                className="user-img"
                alt={username}
              />
              <h4>{username}</h4>
              <p>Loading bio...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active" href="">
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="">
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            <div className="article-preview">Loading articles...</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
