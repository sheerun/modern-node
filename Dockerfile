FROM node:10

COPY . /modern-node

RUN git config --global user.name "John Smith"

RUN git config --global user.email "email@example.com"

RUN /modern-node/create-modern-node/cli.js app --modern-version file:/modern-node

WORKDIR /app

RUN git status
