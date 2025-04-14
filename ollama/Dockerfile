FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y curl gnupg ca-certificates bash

RUN curl -fsSL https://ollama.com/install.sh | sh

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
