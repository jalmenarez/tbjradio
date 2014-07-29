tbjradio
================== 

Solo es un demo para integrar la API Web de Spotify usando el framework sails para node. 

## instalacion

Si no tienes instalado node.js en tu computador tienes que instalarlo primero para poder continuar.

Se debe instalar el modulo de sails para lo cual se usa npm, el cual es el gestor de modulos de node
``` bash
npm -g install sails
```

Se debe instalar otro modulo que nos permitirá comunicarnos con la API Web de Spotify
``` bash
npm  -g install spotify-web-api-node
```

Despues de instalar las dependencias se entra a la carpeta del proyecto
``` bash
cd tbjradio
```

Se instalan las dependencias restantes del proyecto
``` bash
npm install
```

Estando dentro podemos echar a andar el proyecto con el siguiente comando
``` bash
sails lift
```

Si todo sale bien se podra entrar al sitio: localhost:1337, si no habrá que revisar la consola en busca de algún posible
error.

Si deseamos detener la aplicacion debemos presionar las teclas Control + C.
