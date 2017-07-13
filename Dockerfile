FROM node:7.10.1-alpine

RUN apk --no-cache add nginx supervisor && mkdir -p /run/nginx/

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir -p /code && \
    chown "$USERNAME":"$USERNAME" /code

USER $USERNAME
WORKDIR /code

ENV ETL_SCHEDULE=${ETL_SCHEDULE}

COPY yarn.lock package.json /code/
RUN if [ "$NODE_ENV" == "production" ]; then yarn install --production --ignore-optional --pure-lockfile; else yarn install --ignore-optional --pure-lockfile; fi

COPY . /code

USER root

EXPOSE 80

RUN find /code -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"

CMD [ "supervisord", "-n", "-c", "/code/supervisord.conf" ]
