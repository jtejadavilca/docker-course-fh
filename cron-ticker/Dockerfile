# Esta imagen tiene carpetas como: /app /usr /lib etc...
#FROM --platform=linux/arm64/v8 node:19.2-alpine3.16
FROM --platform=$BUILDPLATFORM node:19.2-alpine3.16
#FROM node:19.2-alpine3.16

# cd app
WORKDIR /app

# copiar package.json a ./ el cual es la referencia a /app (source: mi máquina, destination: imagen)
COPY package.json ./

# Comando RUN corre el comando en el terminal de la imagen al momento de crear la imagen
RUN npm install

#copia el app.js a ./
COPY . .

# Realizamos testings
RUN npm run test

# Elimina archivos y directorios no necesarios en PROD
RUN rm -rf /test && rm -rf node_modules

# Unicamente instala las dependencias necesarias para correr la aplicación en PROD
RUN npm install --prod

#CMD ejecuta el comando en el terminal de la imagen pero al momento de montar/correr la imagen
CMD [ "node", "app.js" ]