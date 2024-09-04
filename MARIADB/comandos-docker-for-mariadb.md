## Comandos para MARIADB

### Comando simple
```docker
$ docker run --detach --name some-mariadb --env MARIADB_ROOT_PASSWORD=my-secret-pw  mariadb:latest
```

### Comando simple en varias líneas (Para windows se usa backstick `, para linux y mac se usa backslash \ ). 

```docker
$ docker run -d `
--name some-mariadb `
--env MARIADB_ROOT_PASSWORD=my-secret-pw  `
mariadb:latest
```