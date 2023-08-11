FROM node:19 AS build-stage

# make the 'app' folder the current working directory
WORKDIR /app
# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./ .

# build app for production with minification
RUN npm run build



FROM nginx:stable-alpine AS production-stage

# copy the build folder from 'build-stage' to the nginx html folder
COPY --from=build-stage /app/dist /app

# copy nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# expose port 80 to the host
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]