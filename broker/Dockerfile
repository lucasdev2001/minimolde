FROM node:18-alpine
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
RUN npx tsc
EXPOSE 1883
EXPOSE 8888
CMD [ "node", "dist/index.js" ]
