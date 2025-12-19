import { useEffect, useState } from 'react';
import { ArticleListConfig } from '../models';
import { useArticles } from '../services';
import { ArticlePreview } from './ArticlePreview';

interface ArticleListProps {
  config: ArticleListConfig;
  limit?: number;
}

export function ArticleList({ config, limit = 10 }: ArticleListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const queryConfig: ArticleListConfig = {
    ...config,
    filters: {
      ...config.filters,
      limit,
      offset: limit * (currentPage - 1),
    },
  };

  const { data, isLoading, isError } = useArticles(queryConfig);

  useEffect(() => {
    setCurrentPage(1);
  }, [config.type, config.filters.tag, config.filters.author, config.filters.favorited]);

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (isError) {
    return <div className="article-preview">Error loading articles.</div>;
  }

  if (!data || data.articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  const totalPages = Math.ceil(data.articlesCount / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {data.articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {pageNumbers.map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(pageNumber)}
                  style={{ cursor: 'pointer' }}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

export default ArticleList;
