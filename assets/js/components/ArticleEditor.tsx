import React, { ChangeEvent, FormEvent } from "react";
import { KeyboardEventHandler } from "react";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/Button";
import { Article } from "@/types";
import { useForm } from "@inertiajs/react";
import { FieldError } from "./FieldError";

export const CreateArticleEditor = () => {
  return <ArticleEditor path="/articles" />;
};

interface UpdateArticleProps {
  article: Article;
}

export const UpdateArticleEditor = ({ article }: UpdateArticleProps) => {
  return (
    <ArticleEditor path={`/articles/${article.slug}`} defaultValues={article} />
  );
};

interface ArticleEditorProps {
  defaultValues?: Article;
  path: string;
}

export const ArticleEditor = ({ defaultValues, path }: ArticleEditorProps) => {
  const formData = useForm({
    slug: defaultValues?.slug || "",
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    bodyRaw: defaultValues?.bodyRaw || "",
    tags: defaultValues?.tags || [],
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    formData.setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.post(path);
  };

  const onTagFormKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case "Enter":
        // prevent form submit
        event.preventDefault();

        const tag = event.currentTarget.value;
        if (!tag) {
          return;
        }
        formData.setData((prev) => {
          return { ...prev, tags: [...prev.tags, tag] };
        });
        event.currentTarget.value = "";
      default:
        return;
    }
  };

  const onClickRemoveTag = (index: number) => {
    formData.setData((prev) => {
      const newTags = prev.tags.filter((val, idx) => idx != index);
      return { ...prev, tags: newTags };
    });
  };

  return (
    <>
      <form id={"edit-article-form"} onSubmit={handleSubmit} noValidate={true}>
        <input type="hidden" name={"slug"} value={formData.data.slug} />
        <fieldset>
          <fieldset className="form-group">
            <input
              type="text"
              name={"title"}
              value={formData.data.title}
              onChange={handleInput}
              placeholder="Article Title"
              className="form-control form-control-lg"
            />
            <FieldError error={formData.errors.slug} />
            <FieldError error={formData.errors.title} />
          </fieldset>
          <fieldset className="form-group">
            <input
              type="text"
              name={"description"}
              value={formData.data.description}
              onChange={handleInput}
              placeholder="What's this article about?"
              className="form-control"
            />
            <FieldError error={formData.errors.description} />
          </fieldset>
          <fieldset className="form-group">
            <textarea
              name={"bodyRaw"}
              value={formData.data.bodyRaw}
              onChange={handleInput}
              rows={8}
              placeholder="Write your article (in markdown)"
              className="form-control"
            />
            <FieldError error={formData.errors.bodyRaw} />
          </fieldset>
          <fieldset className="form-group">
            <input
              type="text"
              name={"tags"}
              placeholder="Enter tags"
              onKeyDown={onTagFormKeyDown}
              className="form-control"
            />
            <ul className="tag-list">
              {formData.data.tags.map((tag, index) => (
                <li key={tag}>
                  <Tag
                    component="span"
                    variant="filled"
                    className={".tag-form"}
                  >
                    <button
                      className="w-5 h-5"
                      onClick={() => onClickRemoveTag(index)}
                    >
                      x
                    </button>
                    {tag}
                  </Tag>
                </li>
              ))}
            </ul>
          </fieldset>
          <Button
            component="button"
            size="lg"
            color="primary"
            variant="filled"
            type="submit"
            className="pull-xs-right"
            disabled={formData.processing}
          >
            Publish Article
          </Button>
        </fieldset>
      </form>
    </>
  );
};
