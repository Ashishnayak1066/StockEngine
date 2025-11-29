import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function createRepository() {
  const octokit = await getUncachableGitHubClient();
  
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);
  
  const repoName = 'mockup-js';
  
  try {
    const { data: existingRepo } = await octokit.repos.get({
      owner: user.login,
      repo: repoName
    });
    console.log(`Repository already exists: ${existingRepo.html_url}`);
    return { repo: existingRepo, user };
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
  }
  
  console.log(`Creating repository: ${repoName}`);
  const { data: repo } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    description: 'Mockup JS - A rapid front-end prototype application',
    private: false,
    auto_init: false
  });
  
  console.log(`Repository created: ${repo.html_url}`);
  return { repo, user };
}

async function main() {
  try {
    const { repo, user } = await createRepository();
    
    console.log('\n=== Repository Ready ===');
    console.log(`URL: ${repo.html_url}`);
    console.log(`Clone URL: ${repo.clone_url}`);
    console.log(`\nTo push your code, use the Git pane in Replit:`);
    console.log(`1. Click on "Git" in the left sidebar`);
    console.log(`2. Add the remote: ${repo.clone_url}`);
    console.log(`3. Stage, commit, and push your changes`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
