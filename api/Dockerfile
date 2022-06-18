FROM node:14
LABEL maintainer="Victor Diaz <vickoman.dev@gmail.com>"
LABEL version="0.0.1"

RUN npm i -g nodemon

WORKDIR /home/app

USER root

ENV PORT 3000

EXPOSE 3000

ADD entrypoint.sh  /home/app/
RUN chown -R node:node /home/app/entrypoint.sh && \
    chmod 777 /home/app/entrypoint.sh && \
    chmod +x /home/app/entrypoint.sh

USER node

CMD [ "/bin/bash", "entrypoint.sh" ]
