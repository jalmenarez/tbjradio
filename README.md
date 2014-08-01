tbjradio
================== 

Solo es un demo para integrar la API Web de Spotify usando el framework sails para node. 

## instalación

Si no tienes instalado node.js (http://nodejs.org/) en tu computador tienes que instalarlo primero para poder continuar.

Se debe instalar el modulo de sails para lo cual se usa npm (https://www.npmjs.org/), el cual es el gestor de modulos de node el cual se instala cuando instalemos node.
``` bash
npm -g install sails
```

Despues de instalar las dependencias se entra a la carpeta del proyecto
``` bash
cd tbjradio
```

Se instalan las dependencias restantes del proyecto
``` bash
npm install
```

Se debe instalar otro modulo que nos permitirá comunicarnos con la API Web de Spotify.
``` bash
npm  -g install spotify-web-api-node
```

Se debe descargar este archivo de configuracion y dejarlo dentro de la carpeta config del proyecto para que funcione la comunicacion con Spotify
https://gist.github.com/jalmenarez/66c90d9a5a0e3c7d746b#file-local-js

Si no hay problemas en la instalación de las dependencias podremos echar andar el proyecto. 

Estando dentro de la carpeta del proyecto debemos ejecutar el siguiente comando para hacer andar el proyecto.
``` bash
sails lift
```

Si todo sale bien se podra entrar al sitio: localhost:1337, si no habrá que revisar la consola en busca de algún posible
error.

Si deseamos detener la aplicacion debemos presionar las teclas Control + C.
