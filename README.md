## TAREA SECCIÓN 3: MONTAR BD:

Montar la imagen de MariaDB con el tag jammy, publicar en el puerto 3306 del contenedor con el puerto 3306 de nuestro equipo, colocarle el nombre al contenedor de world-db (--name world-db) y definir las siguientes variables de entorno:

MARIADB_USER=example-user
MARIADB_PASSWORD=user-password
MARIADB_ROOT_PASSWORD=root-secret-password
MARIADB_DATABASE=world-db
Conectarse usando Table Plus a la base de datos con las credenciales del usuario (NO EL ROOT)

Conectarse a la base de datos world-db

Ejecutar el query de creación de tablas e inserción proporcionado

Revisar que efectivamente tengamos la data

___

### Resolución:

#### Se ejecuta el siguiente comando:
```Shell
docker run --name world-db `
-dp 3306:3306 `
-e MARIADB_USER=example-user `
-e MARIADB_ROOT_PASSWORD=secret-password `
-e MARIADB_PASSWORD=user-password `
-e MARIADB_DATABASE=world-db `
mariadb:latest
```

___
___


# VOLUMES:

Hay 3 tipos de volúmenes, son usados para hacer persistente la data entre reinicios y levantamientos de imágenes.
1. **Named Volumes**: Este es el volumen más usado.
    - Crear un nuevo volumen: <br />
    ```docker volume create todo-db```

    - Listar los volúmenes creados: <br />
    ```docker volume ls```

    - Inspeccionar el volumen específico: <br />
    ```docker volume inspect todo-db```

    - Remueve todos los volúmenes no usados: <br />
    ```docker volume prune```

    - Remueve uno o más volúmenes especificados: <br />
    ```docker volume rm VOLUME_NAME```

    - Usar un volumen al correr un contenedor: <br />
    ```docker run -v todo-db:/etc/todos getting-started```


2. **Bind volumes**: Trabaja con paths absolutos.

 _Terminal_:
```Shell
docker run -dp 3000:3000 \ 
    -w /app -v "$(pwd):/app" \ 
    node:18-alpine \ 
    sh -c "yarn install && yarn run dev"
```
_Powershell_:

```Powershell
 docker run -dp 3000:3000 `
    -w /app -v "$(pwd):/app" `
    node:18-alpine `
    sh -c "yarn install && yarn run dev"
```

#### Explicación:
```-w /app```: Working directory: donde el comando empezará a correr.

```-v "$(pwd):/app"```: Volumen vinculado: vinculamos el directorio del host con el directorio /app del contenedor.

```node:18-alpine```: Imagen a usar.

```sh -c "yarn install && yarn run dev"```:  Comando Shell: Iniciamos un shell y ejecutamos _yarn install_ y luego correr el _yarn run dev_


3. **Anonymous Volumes**:  Volúmenes donde sólo se especifica el path del contenedor y Docker lo asigna automáticamente en el host:
```
docker run -v /var/lib/mysql/data
```

### Ejemplo de la tarea usando **_volume_**:

```Shell
docker container run --name world-db `
-dp 3306:3306 `
-e MARIADB_USER=example-user `
-e MARIADB_ROOT_PASSWORD=secret-password `
-e MARIADB_PASSWORD=user-password `
-e MARIADB_DATABASE=world-db `
--volume world-db:/var/lib/mysql `
mariadb:latest
```


# NETWORK:

### Regla de oro: ###
Si dos o más contenedores están en la misma red, podrán hablar entre sí. Si no lo están, no podrán.

- Ver comandos de network:
```
docker network
```

- Crear una nueva red:
```
docker network create todo-app
```

- Listar todas las redes creadas:
```
docker network ls
```

- Inspeccionar una red:
```
docker network inspect <NAME o ID>
```

- Borrar todas las redes no usadas:
```
docker network prune
```
- Correr una imagen unida a la red:
#### _Terminal_
```Shell
 docker container run -d \ 
    --network todo-app --network-alias mysql \ 
    -v todo-mysql-data:/var/lib/mysql \ 
    -e MYSQL_ROOT_PASSWORD=secret \ 
    -e MYSQL_DATABASE=todos \ 
    mysql:8.0 
```


#### _Powerchell_
```powershell
docker run -d ` 
    --network todo-app --network-alias mysql ` 
    -v todo-mysql-data:/var/lib/mysql ` 
    -e MYSQL_ROOT_PASSWORD=secret ` 
    -e MYSQL_DATABASE=todos ` 
    mysql:8.0
```

#### Explicación:
```-e``` or ```--env```: **Variable de entorno**, MySQL necesita definir el root password y el nombre de la base de datos, y usamos este flag para establecer dichos valores al contenedor.

```-v todo-mysql-data:/var/lib/mysql```: **Volumen con nombre** hacia donde [MySQL](https://hub.docker.com/_/mysql) graba la base de datos.

```--network-alias```: **Crea un nombre o dominio de red**, nuestra aplicación solo necesita conectarse a un host llamado mysql y se comunicará con la base de datos.


### Ejemplo de la tarea usando **_network_**:

1. Creamos un PhpMyAdmin para conectarse al otro container de MySQL:
```
docker container run `
--name phpmyadmin `
-d `
-e PMA_ARBITRARY=1
-p 8080:80 `
phpmyadmin:5.2.0-apache
```

2. Luego creamos la red:
```
docker network create world-app
```

3. Conectamos un contenedor ya creado a una red:
```
docker network connect world-app <CONTAINER_ID>
```
> Este comando se ejecuta dos veces (o las que se necesiten según la cantidad de contenedores), y en cada uno se especifica el id del contenedor (CONTAINER_ID), para el ejemplo ejecutamos uno con el de MySQL y otro con el de PhpMyAdmin.

### Otro ejemplo conectando directamente los conteiner a la red al momento de crearlos:
eliminamos los contenedores creados previamente de MySQL y de PhpMyAdmin para crearlos nuevamente con la red. Luego seguimos los siguientes pasos:
1. Creamos el contenedor de **MySQL** usando la red (network curso_docker_fh) en la creación:
```
docker container run `
--name world-db `
-dp 3306:3306 `
-e MARIADB_USER=example-user `
-e MARIADB_ROOT_PASSWORD=secret-password `
-e MARIADB_PASSWORD=user-password `
-e MARIADB_DATABASE=world-db `
--volume world-db:/var/lib/mysql `
--network curso_docker_fh `
mariadb:latest
```

2. Creamos el contenedor de **PhpMyAdmin** usando la red (network curso_docker_fh) en la creación:
```
docker container run  `
--name pypmyadmin `
-dp 8080:80 `
-e PMA_ARBITRARY=1 `
--network curso_docker_fh `
phpmyadmin:5.2.0-apache
```

> Ambos contenedores ya apuntan a la misma red y pueden conectarse sin problemas.

___
# Creación de imágen para varias arquitecturas:

En ocasiones va a ser necesario generar una imagen que sea soportada en varias arquitecturas, y la mejor forma es usando el comando `docker buildx`. E.g.:

Pero lo primero es crear un *builder* y se hace de la siguiente forma:

```Shell
docker buildx create `
--name container-builder `
--driver docker-container `
--use --bootstrap
```

Si se tiene solo un builder creado, va a ser ese el que se usará por default. Luego es posible crear la imagen.

```Shell
docker buildx build `
--platform=linux/amd64,linux/arm64,linux/amd64/v2,linux/amd64/v3 `
-t jtejadavilca/cron-ticker `
--push .
```

También es posible examinar una imágen para saber las arquitecturas que soporta con el siguiente comando:
```
docker buildx imagetools inspect jtejadavilca/cron-ticker:latest
```