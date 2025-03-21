defmodule RealworldWeb.RegistrationController do
  use RealworldWeb, :controller

  def index(conn, _params) do
    conn
    |> render_inertia("user/Register")
  end

  def register(conn, params) do
    case Realworld.Accounts.register_user(params) do
      {:ok, user} ->
        conn
        |> AshAuthentication.Phoenix.Plug.store_in_session(user)
        |> redirect(to: ~p"/")

      {:error, errors} ->
        conn
        |> assign_errors(errors)
        |> redirect(to: ~p"/register")
    end
  end
end
