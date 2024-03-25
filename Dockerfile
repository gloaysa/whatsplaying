FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

COPY ./dist ./dist

RUN npm install -g serve

ENV PORT=5000

EXPOSE $PORT

# Use the environment variable in the command
CMD serve -s dist -l $PORT
