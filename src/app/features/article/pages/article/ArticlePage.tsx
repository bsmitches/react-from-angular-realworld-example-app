import { useParams } from 'react-router-dom';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>Article: {slug}</h1>
          <div className="article-meta">
            <div className="info">
              <span className="author">Loading...</span>
              <span className="date">Loading...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>Loading article content...</p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <div className="card">
              <div className="card-block">
                <p className="card-text">Loading comments...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;
