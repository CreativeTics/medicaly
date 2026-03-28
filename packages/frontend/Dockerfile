FROM node:19 AS build-stage

RUN echo "API: $VITE_API_URL"

# 👇 Declarar los build args
ARG VITE_API_URL
ARG VITE_WS_URL

# 👇 Convertirlos en variables de entorno para Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

WORKDIR /app/packages/frontend
COPY packages/frontend/package*.json ./
RUN npm install
COPY packages/frontend/ .
COPY docs/ /app/docs
RUN npm run build



FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/packages/frontend/dist /usr/share/nginx/html

COPY packages/frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
