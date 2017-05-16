FROM node:7.9-alpine

RUN apk --no-cache add nginx supervisor && mkdir -p /run/nginx/

# ENV USERNAME nodeuser

# RUN adduser -D "$USERNAME" && \
#     mkdir /code && \
#     chown "$USERNAME":"$USERNAME" /code

# USER $USERNAME
WORKDIR /code

ENV ETL_SCHEDULE=${ETL_SCHEDULE}

COPY yarn.lock package.json /code/
RUN  yarn install --ignore-optional --pure-lockfile

COPY . /code

# USER root

EXPOSE 80

RUN ln -s /code/output/ /code/html/json

# RUN find /code/output -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"
# USER $USERNAME

CMD [ "supervisord", "-n", "-c", "/code/supervisord.conf" ]
