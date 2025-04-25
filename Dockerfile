FROM node:18 AS node-builder

WORKDIR /app/node-app
COPY node-app/package*.json ./
RUN npm install
COPY node-app/ ./
RUN npm run build

FROM typesense/typesense:0.25.2
RUN apt-get update && apt-get install -y nodejs npm supervisor

WORKDIR /app/node-app
COPY --from=node-builder /app/node-app /app/node-app
RUN npm install --production

ENV TYPESENSE_DATA_DIR=/data
ENV TYPESENSE_API_KEY=please_set_in_environment
ENV TYPESENSE_API_PORT=8108

VOLUME /data

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8108 3000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]