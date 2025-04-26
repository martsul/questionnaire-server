FROM node:20

RUN apt-get update && \
    apt-get install -y wget && \
    wget https://dl.typesense.org/releases/0.25.2/typesense-server-0.25.2-linux-amd64.tar.gz && \
    tar -xvzf typesense-server-0.25.2-linux-amd64.tar.gz && \
    mv typesense-server /usr/local/bin/typesense-server

RUN npm install -g concurrently

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 10000
EXPOSE 8108

CMD concurrently --kill-others-on-fail \
  "typesense-server --data-dir /data --api-key $TYPESENSE_API_KEY --listen-port 8108" \
  "npm run start"
