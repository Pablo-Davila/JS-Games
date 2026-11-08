FROM nginx:1.30.6-alpine

COPY html /usr/share/nginx/html/

EXPOSE 80
