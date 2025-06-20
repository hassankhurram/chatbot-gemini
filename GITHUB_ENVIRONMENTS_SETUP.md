# GitHub Environments Setup for Cloud Run Deployment

This guide explains how to configure the necessary Environments, Variables, and Secrets in your GitHub repository to enable automated deployments to Google Cloud Run.

Our GitHub Actions workflow is designed to use different configurations depending on the branch that triggers the deployment. This is managed using GitHub Environments.

## 1. Understanding Environments

An Environment in GitHub is a way to group deployment rules, variables, and secrets. Our workflow is configured to use an environment that matches the name of the branch being deployed (e.g., `main`, `staging`, `dev`).

You will need to create an environment for each branch you intend to deploy from.

## 2. Creating an Environment

1.  Navigate to your GitHub repository.
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Environments**.
4.  Click the **New environment** button.
5.  Enter the name of your branch (e.g., `main`) as the environment name and click **Configure environment**.

Repeat this process for every branch you want to deploy, such as `staging`, `dev`, `scb`, etc.

## 3. Configuring Environment Variables and Secrets

For each environment you create, you must add specific variables and secrets.

### How to Add Variables and Secrets:

1.  Go to your repository's **Settings > Environments** page.
2.  Click on the name of the environment you want to configure (e.g., `main`).
3.  You will see sections for **Environment secrets** and **Environment variables**.
4.  Click **Add secret** or **Add variable** to add the required values listed below.

---

### Required Variables (`vars`)

These are non-sensitive configuration values.

| Variable Name      | Description                                                                                              | Example Value                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `GCP_PROJECT_ID`   | Your Google Cloud Project ID.                                                                            | `my-gcp-project-12345`                         |
| `GCP_REGION`       | The Google Cloud region where your Cloud Run service is deployed.                                        | `us-central1`                                  |
| `NEXTAUTH_URL`     | The public URL of your deployed application. This is crucial for NextAuth to function correctly.         | `https://gemini-chat-....a.run.app`             |

### Required Secrets (`secrets`)

These are sensitive, encrypted values.

| Secret Name             | Description                                                                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GCP_SA_KEY`            | The JSON key for the Google Cloud Service Account that has permissions to deploy to Cloud Run. You must paste the entire content of the JSON file here.                                                 |
| `DATABASE_URL`          | The full connection string for your database, including credentials.                                                                                                                                   |
| `NEXTAUTH_SECRET`       | A secret string used by NextAuth.js to sign tokens. You can generate a strong one using `openssl rand -base64 32`.                                                                                       |
| `GOOGLE_CLIENT_ID`      | The client ID for your Google OAuth 2.0 application, used for user authentication.                                                                                                                     |
| `GOOGLE_CLIENT_SECRET`  | The client secret for your Google OAuth 2.0 application.                                                                                                                                             |

---

## Summary of Steps

1.  **For each branch** (`main`, `staging`, `dev`, etc.) that you want to deploy:
2.  Create a corresponding **GitHub Environment**.
3.  In that environment, add all the **Required Variables** (`GCP_PROJECT_ID`, `GCP_REGION`, `NEXTAUTH_URL`).
4.  In that environment, add all the **Required Secrets** (`GCP_SA_KEY`, `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).

Once this is complete, pushing a commit to one of these branches will automatically trigger the GitHub Actions workflow, which will use the specific configuration you've provided for that environment to deploy your application. 