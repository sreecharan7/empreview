FROM ubuntu:latest
# RUN sudo apt-get update && sudo apt-get install -y curl &&\
# curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
# sudo apt-get install -y nodejs

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_21.x  | bash -
RUN apt-get -y install nodejs


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
COPY .env ./

EXPOSE 3000
CMD ["node", "index"]
