export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  created_at: string;
  default_branch: string;
  fork: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
}

export interface NotebookCell {
  cell_type: 'markdown' | 'code';
  execution_count: number | null;
  metadata: any;
  outputs: Array<{
    output_type: string;
    text?: string[];
    data?: {
      'text/plain'?: string[];
      'text/html'?: string[];
      'image/png'?: string;
      'application/json'?: any;
      [key: string]: any;
    };
  }>;
  source: string[];
}

export interface JupyterNotebook {
  cells: NotebookCell[];
  metadata: any;
  nbformat: number;
  nbformat_minor: number;
}