defmodule Realworld.Repo.Migrations.CreateAuthTables do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_sqlite.generate_migrations`
  """

  use Ecto.Migration

  def up do
    create table(:user, primary_key: false) do
      add :hashed_password, :text, null: false
      add :email, :citext, null: false
      add :last_name, :text, null: false
      add :first_name, :text, null: false
      add :id, :uuid, null: false, primary_key: true
      add :confirmed_at, :utc_datetime_usec
    end

    create unique_index(:user, [:email], name: "user_unique_email_index")

    create table(:token, primary_key: false) do
      add :updated_at, :utc_datetime_usec, null: false
      add :inserted_at, :utc_datetime_usec, null: false
      add :extra_data, :map
      add :purpose, :text, null: false
      add :expires_at, :utc_datetime, null: false
      add :subject, :text, null: false
      add :jti, :text, null: false, primary_key: true
      add :id, :uuid, null: false, primary_key: true
      add :created_at, :utc_datetime_usec, null: false
    end
  end

  def down do
    drop table(:token)

    drop_if_exists unique_index(:user, [:email], name: "user_unique_email_index")

    drop table(:user)
  end
end
