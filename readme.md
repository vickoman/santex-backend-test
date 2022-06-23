# Santex Backend Test

Welcome to Santex Backend test, the purpose of this project is to validate knowledge of Nodejs, Graphql.

**Project Folder:**

![Captura de Pantalla 2022-06-23 a la(s) 00.05.58.png](images/Captura_de_Pantalla_2022-06-23_a_la(s)_00.05.58.png)

- **api.-** This folder containt the Graphql API
- **infra.-** This folder containt files related to the infraestructure behind managed by docker and docker-compose.

**Stack of the project:**

1. Nodejs
2. Graphql
3. Docker
4. Docker-compose
5. Redis
6. Mongodb

> It’s important to get installed Docker. If you dont have knowledge about how to use docker-compose commands to start the services. I created Makefile to handle the docker stuff.
> 

**How To run?**

After uncompressed our folder or cloned the reposity from [Github](https://www.notion.so/Santex-Backend-Test-28507e38cfa24ec39d93341a41441b71). we need to follow the next steps:

**Step 1.-**  Run `npm install` within `api` folder:

```bash
# Using Makefile
make api-deps

# Normal way:
cd api
npm i
cd ..
```

**Step 2.-** within **`api`** folder there is a file called **`env.example`**, please copy this file into another file with the name **`.env`**, and keep that file withi **`api`** folder. If you are using a mac you can run the command from the root of the project:

```bash
cp ./api/env.example ./api/.env
```

After you should add the API_KEY of footbal API and, and also you can change the default admin user if you need:

```bash
PORT=3000
MONGO_URI=mongodb://mongouser:weakpassword@mongodb:27017/santex-mongo?authSource=admin
REDIS_URI=redis://redis:6379
SECRET=santexvictortest
FOOTBALL_TOKEN=FILLWITHTOKEN
FOOTBALL_API_URL=http://api.football-data.org/v4
ADMIN_NAME="Super"
ADMIN_LASTNAME="Admin"
ADMIN_EMAIL="admin@santex.com"
ADMIN_PASSWORD="S@ntexPassword"
```

**Step 2.-**  we need to follow the same step 1 but in **infra** folder:

```bash
cp ./infra/env.example ./infra/.env
```

You can change the values of the **`./infra/.env`** if you want add custom user and password to mongodb, the dafult values are:

```bash
MONGO_VERSION=5.0
MONGO_PORT=27017
MONGO_USER=mongouser
MONGO_ROOT_PASSWORD=weakpassword
MONGO_CN_NAME=santex-mongo
```

**Step 3.-** Build the stack with docker-compose or using makefile:

```bash
# using make file
make build

# using docker-compose
docker-compose build
```

Now we can start the application.

**Step 4.-** Start the application using docker-compose or makefile:

```bash
# using make file
make up

# using docker-compose
docker-compose up -d
```

**Step 5.-** Check that all container are running: **Redis**, **Mongo** and **Api**:

```bash
# Using Makefile
make status

# Using Docker compose
docker-compose -f ./infra/docker-compose.yml ps
```

We should be able to see this list:

```bash
Name                   Command               State            Ports
---------------------------------------------------------------------------------
infra_api_1     docker-entrypoint.sh /bin/ ...   Up      0.0.0.0:8689->3000/tcp
infra_redis_1   /opt/bitnami/scripts/redis ...   Up      0.0.0.0:6379->6379/tcp
santex-mongo    docker-entrypoint.sh mongod      Up      0.0.0.0:27017->27017/tcp
```

Also if we can check the logs of the api we can get from this command:

```bash
make logs c=api
```

![Captura de Pantalla 2022-06-23 a la(s) 01.11.34.png](images/Captura_de_Pantalla_2022-06-23_a_la(s)_01.11.34.png)

The Api is serving in port `3000` whitin Docker but we can hit in the brower following: [http://localhost:8689](http://localhost:8689) please press the button `Query your server`

🚀 We are good so far. but to play or fill the database and execute Mutations and Query we need to Authenticate the default user and get the JWT and Fill JWT in all requests:

![Captura de Pantalla 2022-06-23 a la(s) 01.15.05.png](images/Captura_de_Pantalla_2022-06-23_a_la(s)_01.15.05.png)

The `Auth` Mutation allow us to authenticate the default user is the user that you put in the `.env` file in **api** folder. if we run the mutation with those values we will able to get the token as you can see in the image above.

If we execute mutation `importLeague` We need to setup the headers with **Authorization** and the value `Bearer TOKEN`

![Captura de Pantalla 2022-06-23 a la(s) 01.22.56.png](images/Captura_de_Pantalla_2022-06-23_a_la(s)_01.22.56.png)

Video Setup from MacOs:

[santex-test-1.mp4](images/santex-test-1.mp4)

Mutation `importLeague` in action:

[santex-test-2.mp4](images/santex-test-2.mp4)

• **team: takes a name and returns the corresponding team. Additionally, if requested in the query, it should resolve the players for that team.**

[santex-test-3.mp4](images/santex-test-3.mp4)

**players**: takes **leagueCode** as a parameter and returns the players that belong to all teams participating in the given league. If the given leagueCode is not present in the DB, it should respond with an error message. Add an optional input to the query to filter players also by team name.

[santex-test-5.mp4](images/santex-test-5.mp4)

Author: Victor Diaz [ [vickoman.dev@gmail.com](mailto:vickoman.dev@gmail.com) ], Thanks