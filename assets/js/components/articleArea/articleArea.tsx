import React, { ReactNode } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/Button";

import {
  showDeleteArticleButton,
  showEditArticleButton,
  showFollowButton,
} from "./functions";
// import { FollowButton } from "../followButton";
// import { DeleteArticleButton } from "../deleteArticleButton";
// import { FavoriteButton } from "../favoriteButton";
import { Article, User } from "@/types";
import { FavoriteButton } from "./FavoriteButton";

const FollowButton = (props) => {
  return <button type="button">Follow</button>;
};

interface DeleteArticleProps {
  path: string;
}

const DeleteArticleButton = ({ path }: DeleteArticleProps) => {
  const form = useForm();
  return (
    <form
      className={"inline action-btn"}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm("Delete this article?")) {
          form.delete(path);
        }
      }}
    >
      <Button
        component="button"
        color="danger"
        type="submit"
        disabled={form.processing}
      >
        <i className="ion-trash-a"></i> Delete Article
      </Button>
    </form>
  );
};

interface ArticleAreaProps {
  slug: string;
  article: Article;
  currentUser: User;
  children: ReactNode;
}

interface ActionsProps {
  article: Article;
  currentUser: User;
}

const Actions = ({ article, currentUser }: ActionsProps) => {
  const profile = article.author;

  return (
    <div className="article-meta">
      {profile && (
        <Link href={`/profile/${profile.username}`}>
          {profile.image && <img src={profile.image} alt="" />}
        </Link>
      )}
      <div className="info">
        <Link href={`/profile/${profile.username}`} className="author">
          {profile.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toDateString()}
        </span>
      </div>
      {showFollowButton(profile.username, currentUser) && (
        <FollowButton
          username={profile.username}
          following={false}
          className={"action-btn"}
        />
      )}
      <FavoriteButton
        isFavorited={article.isFavorited || false}
        favoritesCount={article.favoritesCount}
        showMessage={true}
        path={
          article.isFavorited
            ? `/articles/${article.slug}/unfavorite`
            : `/articles/${article.slug}/favorite`
        }
      />
      {showEditArticleButton(profile.username, currentUser) && (
        <Button
          component="a"
          href={`/articles/${article.slug}/edit`}
          color="secondary"
          className={"action-btn"}
        >
          <i className="ion-edit"></i> Edit Article
        </Button>
      )}
      {showDeleteArticleButton(profile.username, currentUser) && (
        <DeleteArticleButton path={`/articles/${article.slug}`} />
      )}
    </div>
  );
};

export const ArticleArea = ({
  slug,
  article,
  children,
  currentUser,
}: ArticleAreaProps) => {
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <Actions article={article} currentUser={currentUser} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
            <ul className="tag-list">
              {article.tags?.map((tag) => (
                <Tag component="li" variant="outline" key={tag}>
                  {tag}
                </Tag>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <Actions article={article} currentUser={currentUser} />
        </div>
        {children}
      </div>
    </div>
  );
};
