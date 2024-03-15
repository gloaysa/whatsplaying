FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

COPY ./build ./dist

RUN npm install -g serve

EXPOSE 5000

# The command to start the application
CMD serve -s dist -l 5000