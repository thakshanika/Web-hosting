const { Octokit } = require("@octokit/rest");

function client() {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured");
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}
const owner = () => process.env.GITHUB_OWNER;
const dbRepo = () => process.env.GITHUB_DB_REPO;
const projectRepo = () => process.env.GITHUB_PROJECT_REPO;

async function getFile(repo, path, fallback) {
  const api = client();
  try {
    const r = await api.repos.getContent({ owner: owner(), repo, path });
    if (Array.isArray(r.data)) return fallback;
    return JSON.parse(Buffer.from(r.data.content, "base64").toString("utf8"));
  } catch (e) {
    if (e.status === 404) {
      await putFile(repo, path, JSON.stringify(fallback, null, 2), `Initialize ${path}`);
      return fallback;
    }
    throw e;
  }
}
async function putFile(repo, path, content, message) {
  const api = client();
  let sha;
  try {
    const r = await api.repos.getContent({ owner: owner(), repo, path });
    if (!Array.isArray(r.data)) sha = r.data.sha;
  } catch (e) { if (e.status !== 404) throw e; }
  const body = { owner: owner(), repo, path, message, content: Buffer.from(content).toString("base64") };
  if (sha) body.sha = sha;
  return api.repos.createOrUpdateFileContents(body);
}
async function readText(repo, path) {
  const api = client();
  const r = await api.repos.getContent({ owner: owner(), repo, path });
  if (Array.isArray(r.data)) throw new Error("Path is a directory");
  return Buffer.from(r.data.content, "base64").toString("utf8");
}
async function saveDB(data) {
  return putFile(dbRepo(), "db.json", JSON.stringify(data, null, 2), "Update DINUX HOST database");
}
async function loadDB() {
  return getFile(dbRepo(), "db.json", {users: [], projects: []});
}
module.exports = { putFile, readText, saveDB, loadDB, projectRepo };
