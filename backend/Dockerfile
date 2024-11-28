FROM node:20

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p data

RUN npm run build

EXPOSE 3010

# Verify the file exists
RUN ls -R
RUN ls -R dist
# RUN cat dist/db/index.js
# RUN cat dist/config/index.js

CMD ["node", "dist/index.js"]
