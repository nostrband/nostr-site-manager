export type Post = {
  id: string;
  title: string;
  plaintext: string;
  slug: string;
  published_at: string;
  created_at: string;
  summary: string;
  custom_excerpt: string;
  feature_image: string | null;
  lexical: string;
  type: "post" | "page";
};

export type ClientPost = Post & {
  tags: Tag[];
  author?: Author;
  url?: string;
  conflict?: boolean;
  d_tag: string;
};

export type Author = {
  created_at: string;
  email: string;
  id: string;
  name: string;
  profile_image: string | null;
};

export type Tag = {
  created_at: string;
  id: string;
  name: string;
  slug: string;
};

export type PostAuthor = {
  author_id: string;
  id: string;
  post_id: string;
  sort_order: number;
};

export type PostTag = {
  tag_id: string;
  id: string;
  post_id: string;
  sort_order: number;
};

export type DBReturnType = {
  data: {
    posts: Post[];
    users: Author[];
    posts_authors: PostAuthor[];
    tags: Tag[];
    posts_tags: PostTag[];
  };
  meta: {};
};

export type JSONDataReturnType = {
  db: DBReturnType[];
};
