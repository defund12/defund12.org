FROM node:14.4.0-alpine
EXPOSE 8000
WORKDIR /usr/defund12
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .
ENTRYPOINT ["yarn"]
CMD ["start-dev"]
