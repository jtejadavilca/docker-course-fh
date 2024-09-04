# Esta imagen tiene carpetas como: /app /usr /lib etc...
FROM node:19.2-alpine3.16 as Deps

# cd app
WORKDIR /app

# copiar package.json a ./ el cual es la referencia a /app (source: mi máquina, destination: imagen)
COPY package.json ./

# Comando RUN corre el comando en el terminal de la imagen al momento de crear la imagen
RUN npm install
# END Deps--------------------------------------------

FROM node:19.2-alpine3.16 as Builder

WORKDIR /app

COPY --from=Deps /app/node_modules ./node_modules

COPY . .

RUN npm run test
# END Builder--------------------------------------------


FROM node:19.2-alpine3.16 as ProdStage

WORKDIR /app

COPY package.json .

RUN npm install --prod
# END ProdStage--------------------------------------------


FROM node:19.2-alpine3.16 as Runner

WORKDIR /app

COPY --from=ProdStage /app/node_modules ./node_modules
COPY app.js .
COPY tasks ./tasks

#CMD ejecuta el comando en el terminal de la imagen pero al momento de montar/correr la imagen
CMD [ "node", "app.js" ]