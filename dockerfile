FROM node:18.14-slim

RUN apt update && apt install -y \
    procps

RUN npm install -g @nestjs/cli@9.2.0

USER node

WORKDIR /home/node/app

CMD ["tail",  "-f" , "/dev/null"]
