FROM gplane/pnpm as Builder

RUN mkdir -p /home/easy-editor/web
WORKDIR /home/easy-editor/web
COPY . /home/easy-editor/web

RUN pnpm install

RUN pnpm build

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:1.22.0-22.03-lts

COPY --from=Builder /home/easy-editor/web/dist /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf


RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /var/run/nginx.pid \
    && chown -R nginx:nginx /etc/nginx

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
