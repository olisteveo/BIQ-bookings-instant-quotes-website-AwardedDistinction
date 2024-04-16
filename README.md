# Build

- Clone

    ```bash
    git clone git@github.com:olisteveo/BIQ.git biq3
    ```

- cd into cloned repo folder

    ```bash
    cd biq3
    ```

- Copy env example to env

    ```bash
    cp .env-example .env
    ```

- Build it

    ```bash
    docker compose  -f "docker-compose-build.yaml" up -d --build biq-handbook database-biq-local biq-phpmyadmin-local biq-webserver nginx-web-server
    ```
