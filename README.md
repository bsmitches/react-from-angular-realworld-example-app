# react-from-angular-realworld-example-app

A React implementation of the RealWorld example app, migrated from the Angular version.

## Features

### Articles Feature (Phase 3)

The articles feature provides complete article management functionality, migrated from the Angular RealWorld example app to React.

**Components:**
- **HomePage**: Displays article feeds with tab switching (Your Feed / Global Feed), tag filtering, and popular tags sidebar
- **ArticlePage**: Shows full article with markdown rendering, author info, follow/favorite buttons, and comments section
- **EditorPage**: Form for creating and editing articles with tag management
- **ArticleList**: Paginated list of article previews with offset-based pagination
- **ArticlePreview**: Article summary card with author info, favorite button, and tags
- **ArticleMeta**: Reusable component for displaying author information and date
- **FavoriteButton**: Handles favoriting/unfavoriting with authentication check
- **FollowButton**: Handles following/unfollowing users with authentication check
- **ArticleComment**: Displays individual comments with delete option for authors

**Services (React Query hooks):**
- `useArticles`: Fetch articles with filtering and pagination
- `useArticle`: Fetch single article by slug
- `useCreateArticle`: Create new article
- `useUpdateArticle`: Update existing article
- `useDeleteArticle`: Delete article
- `useFavoriteArticle` / `useUnfavoriteArticle`: Toggle article favorite status
- `useComments`: Fetch comments for an article
- `useAddComment` / `useDeleteComment`: Manage comments
- `useTags`: Fetch popular tags
- `useProfile` / `useFollowUser` / `useUnfollowUser`: Profile operations

**Key Implementation Details:**
- Uses React Query for data fetching and caching
- Markdown rendering with the `marked` library
- Zustand for authentication state management
- React Router for navigation
- Axios with JWT interceptor for API calls
- Offset-based pagination (offset = limit * (currentPage - 1))

## Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The app will be available at http://localhost:5173/

### API
This app connects to the RealWorld API at https://api.realworld.io/api

## Project Structure

```
src/app/features/article/
├── components/
│   ├── ArticleComment.tsx
│   ├── ArticleList.tsx
│   ├── ArticleMeta.tsx
│   ├── ArticlePreview.tsx
│   └── FavoriteButton.tsx
├── models/
│   ├── article.model.ts
│   ├── article-list-config.model.ts
│   └── comment.model.ts
├── pages/
│   ├── article/ArticlePage.tsx
│   ├── editor/EditorPage.tsx
│   └── home/HomePage.tsx
└── services/
    ├── articles.service.ts
    ├── comments.service.ts
    └── tags.service.ts
```

## License

MIT
