import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/app/core/auth/hooks/useAuth';
import { ListErrors } from '@/app/shared/components';
import { Errors } from '@/app/shared/types';
import { useArticle, useCreateArticle, useUpdateArticle } from '../../services';

export function EditorPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagField, setTagField] = useState('');
  const [errors, setErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: article, isLoading } = useArticle(slug || '');
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  useEffect(() => {
    if (slug && article) {
      if (user?.username !== article.author.username) {
        navigate('/');
        return;
      }
      setTitle(article.title);
      setDescription(article.description);
      setBody(article.body);
      setTagList(article.tagList);
    }
  }, [slug, article, user, navigate]);

  const addTag = () => {
    const tag = tagField.trim();
    if (tag && !tagList.includes(tag)) {
      setTagList([...tagList, tag]);
    }
    setTagField('');
  };

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors(null);

    addTag();

    const articleData = {
      title,
      description,
      body,
      tagList,
    };

    try {
      if (slug) {
        const updatedArticle = await updateArticle.mutateAsync({ ...articleData, slug });
        navigate(`/article/${updatedArticle.slug}`);
      } else {
        const newArticle = await createArticle.mutateAsync(articleData);
        navigate(`/article/${newArticle.slug}`);
      }
    } catch (err) {
      setErrors(err as Errors);
      setIsSubmitting(false);
    }
  };

  if (slug && isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={errors} />

            <form>
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tagField}
                    onChange={(e) => setTagField(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="tag-list">
                    {tagList.map((tag) => (
                      <span key={tag} className="tag-default tag-pill">
                        <i
                          className="ion-close-round"
                          onClick={() => removeTag(tag)}
                          style={{ cursor: 'pointer' }}
                        ></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
