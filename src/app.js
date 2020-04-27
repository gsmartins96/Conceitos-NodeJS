const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idExists(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;
  const likes = 0;

  const repository = { id: uuid(), title, techs, url, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", idExists, (request, response) => {
  const { title, techs, url } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const likes = repositories[repositoryIndex].likes;

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const repository = {
    id,
    title,
    techs,
    url,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repositories);
});

app.delete("/repositories/:id", idExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", idExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repository = repositories[repositoryIndex];

  repository.likes = repository.likes + 1;

  repositories.push(repository);

  return response.json(repository);
});

module.exports = app;
