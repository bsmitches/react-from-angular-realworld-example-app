import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/core/auth/hooks/useAuth';
import { ArticleListConfig } from '../../models';
import { useTags } from '../../services';
import { ArticleList } from '../../components';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: tags, isLoading: tagsLoading } = useTags();

  const [listConfig, setListConfig] = useState<ArticleListConfig>({
    type: 'all',
    filters: {},
  });

  useEffect(() => {
    if (isAuthenticated) {
      setListConfig({ type: 'feed', filters: {} });
    } else {
      setListConfig({ type: 'all', filters: {} });
    }
  }, [isAuthenticated]);

  const setListTo = (type: 'all' | 'feed', filters: ArticleListConfig['filters'] = {}) => {
    if (type === 'feed' && !isAuthenticated) {
      navigate('/login');
      return;
    }
    setListConfig({ type, filters });
  };

  const handleTagClick = (tag: string) => {
    setListConfig({ type: 'all', filters: { tag } });
  };

  return (
    <div className="home-page">
      {!isAuthenticated && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <a
                      className={`nav-link ${listConfig.type === 'feed' ? 'active' : ''}`}
                      onClick={() => setListTo('feed')}
                      style={{ cursor: 'pointer' }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link ${listConfig.type === 'all' && !listConfig.filters.tag ? 'active' : ''}`}
                    onClick={() => setListTo('all')}
                    style={{ cursor: 'pointer' }}
                  >
                    Global Feed
                  </a>
                </li>
                {listConfig.filters.tag && (
                  <li className="nav-item">
                    <a className="nav-link active">
                      <i className="ion-pound"></i> {listConfig.filters.tag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList config={listConfig} limit={10} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              {tagsLoading && <div>Loading tags...</div>}

              {!tagsLoading && tags && tags.length > 0 && (
                <div className="tag-list">
                  {tags.map((tag) => (
                    <a
                      key={tag}
                      className="tag-default tag-pill"
                      onClick={() => handleTagClick(tag)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}

              {!tagsLoading && (!tags || tags.length === 0) && (
                <div>No tags are here... yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
