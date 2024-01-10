FROM python:3.10-slim as build-biq-be

# Set some image labels
LABEL olisteveo.image.authors="ucasolusteveo@gmail.com" \
    olisteveo.image.python.version="3.10"

ARG APP_VER=local
ENV APP_VER=$APP_VER

# Set the working directory
WORKDIR /code

# Copy the Python dependency requirements for the project
COPY ./build-assets/python/requirements.txt ./
# Upgrade PIP & install the requirements
RUN pip install --upgrade pip; \
    pip install --no-cache-dir -r requirements.txt

# Copy the project source code
COPY ./backend/src ./src

# Set the Command to launch the FAPI server
CMD [ "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80", "--reload" ]

FROM node:lts-alpine as build-biq-fe

WORKDIR /app

ENV PATH /app/node/modules/.bin:$PATH

RUN npm install @vue/cli@5.0.8 -g

CMD [ "npm", "run", "serve" ]
