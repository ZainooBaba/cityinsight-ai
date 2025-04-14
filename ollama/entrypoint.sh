#!/bin/bash

# Start the API in the background
ollama serve &

# Wait for API to be ready
until curl --silent http://localhost:11434 > /dev/null; do
  echo "Waiting for Ollama to start..."
  sleep 1
done

# Pull the model
ollama pull mistral

# Now run ollama serve in foreground so container stays alive
exec ollama serve
