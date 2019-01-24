## Primeros pasos

#### Antes de empezar necesitas tener instalado lo siguiente

1. Descarga e instala [Node](https://nodejs.org/en/)
2. [Gulp](http://gulpjs.com/) `npm install gulp-cli -g`
3. php-cgi (TODO: Instrucciones)

#### Configuración

0. Clona el repositorio
1. `cd <dir>`
2. `npm install`
3. `gulp start`


#### Generación de builds para producción

Ejecutar la siguiente tarea gulp para generar los archivos de producción

1. `gulp build`


## Estructura de archivos

Todos los archivos que se modificarán se encuentran dentro de la carpeta `src`

Gulp se encargará de procesar todos los archivos de la carpeta `src` y colocarlos de forma ordenada en la carpeta `dist`, esta estructura generada hay que tenerla en cuenta a la hora de enlazar entre plantillas.

#### SCSS
Los archivos `.scss` se encuentran en el directorio `src/assets/styles`.

Dentro de cada carpeta, a su vez, encontraremos la siguiente estructura basada en ITCSS:

```
01_settings
02_tools
03_generic
04_base
05_objects
06_components
07_trumps
```

#### JS
Los archivos `.js` se encuentran en el directorio `src/assets/scripts`. Para incluir dependencias en los archivos `.js` basta con importarlas de la siguiente forma

**`main.js`**
```js

  // =include _utils.js

```

##### Estructura básica de un ficheo JS

Crear un objeto con las funciones del componente que necesitemos, luego en los eventos que necesitemos, hacemos la llamada a cada método.

```js
"use strict";
(function ($) {
  const ComponentName = {
    methodOne: function (param) {
      ...
    },
    methodTwo: function () {
      ...
    }
  };

  ComponentName.methodOne();
  $(window).on('scroll', function () {
    ComponentName.methodTwo();
  });
})(jQuery);
```


#### PHP
En este proyecto se usa PHP como sistema de plantillas que generan ficheros `.html` estáticos.

Los archivos `.php` se encuentran en la carpeta `src/templates/`, solo se compilarán los archivos que **NO** empiecen por el prejifo `_`, todos los componentes y partials por lo general deberán incluir este prefijo ya que son archivos que irán incluidos en otros.

La primera linea de cada archivo PHP deberá contener la siguiente linea, que permite utilizar nuestros propios helpers y variables para el contenido

```php

  <?php require_once($_SERVER['DOCUMENT_ROOT'] . '/src/lib/_lib.php'); ?>

```

Una vez incluida la librería podemos hacer uso de las siguientes funciones:

##### Incluir un template y pasarle variables

```php

<?php template('partials/_header', array('title' => 'Título de la página')) ?>

```

##### Insertar un icono o imágen .svg en linea (inline svg)

```php

<?= inline_svg($path = 'icon.svg', $alt = 'replace_this_dummy_text', $title = 'replace_this_dummy_text', $css_class = null) ?>

```

Esta función buscará el archivo indicado dentro de la carpeta `images/`

#### Construir plantillas con contenidos variables

Para los componentes, el contenido debe ser variable según el lugar donde se utilicen, por ello es conveniente usar una estructura parecida a esta:

**`src/templates/components/_cta.php`**
```php

<section class="c-cta c-cta--bubbles">
  <div class="o-container">
    <span class="c-cta__badge"><?= $cta__badge ?></span>
    <p class="c-cta__pretitle"><?= $cta__pretitle ?></p>
    <h2 class="c-cta__title"><?= $cta__title; ?></h2>
    <a href="#" class="c-button c-cta__button"><?= $cta__button ?></a>
  </div>
</section>

```

Estas variables, han de ser declaradas con su valor por defecto en el `array` en el fichero `src/lib/_variables.php`, por ejemplo:

**`src/lib/_variables.php`**
```php

<?php
$strings = array(
  'partials/_header' => array(
    'title' => 'Título de la página',
  ),
  'components/_cta' => array(
    'cta__badge' => 'Texto del badge',
    'cta__pretitle' => 'Esto es un pretítulo',
    'cta__title' => 'Esto es un título',
    'cta__button' => 'Texto del botón',
  )
);

```

A la hora de incluir el template podremos pasar las variables con otros valores, como hemos visto más arriba usando la función `template()`

**La clave del array `partials/_header` debe coincidir con la ruta del componente o partial que vayamos a parametrizar, y los nombres de variables nunca deben contener guiones medios `-`**


## Grid

Grid de 12 columnas construido con Flexbox

```html
<div class="o-grid">
  <div class="o-grid__col u-3">
    25%
  </div>
  <div class="o-grid__col u-9">
    75%
  </div>
</div>
```

El grid tiene modificadores que cambian su funcionamiento:

- `o-grid--reverse` : El flujo de los elementos se invierte.
- `o-grid--between` : distribuye todos los elementos a lo largo del contendor igualando el espacio entre ellos.
- `o-grid--center` : distribuye todos los elementos centrados en el contendor .
- `o-grid--align-center` : distribuye los elementos centrados verticalmente en el contendor.
- `o-grid--no-gutters` : grid y columnas sin separaciones.

Las columnas tienen los siguientes modificadores:

- `o-grid--fill` : ocupa todo el ancho disponible aplicando `flex: 1`.
- `o-grid--right` : envía un elemento a la derecha aplicando `margin-left: auto`.

Responsive

```html
<div class="o-grid">
  <div class="o-grid__col u-6 u-3@md">
    50% en todos los casos y 25% en pantallas más anchas que el breakpoint $md
  </div>
  <div class="o-grid__col u-6  u-9@md">
    50% en todos los casos y 75% en pantallas más anchas que el breakpoint $md
  </div>
</div>
```

Grid de orden inverso

```html
<div class="o-grid o-grid--reverse" />
```

Si se crean más modificadores para el grid (centrado, alineado a la izquierda, alineamiento vertical, etc.) añadir aquí.

#### Offsets columns

Permite desplazar cualquier columna hacia la derecha, las clases siguen el mismo patrón que las clases para columnas, solo que añadiendo la palabra `-offset-`, por ejemplo:

```html
<div class="o-grid">
  <div class="o-grid__col u-4 u-offset-4">
    Desplaza esta celda 4 columnas a la derecha.
  </div>
  <div class="o-grid__col u-4 u-offset-1@md">
    Desplaza esta celda 1 columna a la derecha en pantallas más anchas que el breakpoint $md
  </div>
</div>
```

## CSS

### IE10

Crear estilos específicos en `scr/assets/styles/ie10.scss`.

En el body incluir el data attribute data-ie10 con la ruta del css generado, ejemplo:

<body data-ie10="/assets/styles/ie10.css">

Este archivo solo se cargará cuando el navegador detectado sea IE10


### Z_INDEX

Para manejar z-index he creado una función que nos da mucho juego con dos parámetros `z-index: z(z-index, z-level)`.

¿Cómo usarla?.

Variables definidas:

```css
$z-index: (
  'under': -5,
  'zero': 0,
  'default': 5,
  'over': 10
);

$z-level: (
  'footer': 20,
  'header': 30,
  'tooltip': 100,
  'dropdown': 200,
  'modal': 500
);
```

Ejemplo de uso y resultado:

```css
.index {
  z-index: z(over);  /* Outputs: z-index: 10; */
}

.index-level {
  z-index: z(dropdown, under);  /* Outputs: z-index: 195; */
}

.null-level {
  z-index: z(null, dropdown);  /* Outputs: z-index: 200; */
}

.level {
  z-index: (z(dropdown) + z(default) * 4);  /* Outputs: z-index: 220; */
}

.auto {
  z-index: z(auto);  /* Outputs: z-index: auto; */
}

.null {
  z-index: z();  /* Outputs: z-index: auto; */
}
```

### RETINA IMAGES

Para dar soporte retina a imágenes tenemos dos posibilidades.

1. Para imágenes inline: `<img src="assets/images/logos/logo-confianza-online-color.png" width="49" height="49" srcset="assets/images/logo-confianza-online-color@2x.png 2x, assets/images/logo-confianza-online-color@3x.png 3x" alt="Confianza Online" title="<?= dummy_text() ?>">`
2. Para imágenes de fondo tenemos un mixin: `@include imgRetina( 'path/to/image', 'jpg', 100px, 100px, center center, repeat-x );`


### DEBUG

De cara a poder hacer debug del proyecto se han incluido dos archivos para este propósito:

1. `src/assets/styles/07_trumps/_debug.scss` Revisa que no utilicemos atributos o etiquetas obsoletas, links sin enlace o `title`, imágenes sin `alt` o `title`,... Ver el archivo para más info.
2.`src/assets/styles/07_trumps/_healthcheck.scss`Es para revisar que se usa bien nomenclatura BEM. Se pueden ir anulando unos u otros para hacer pruebas. Ver el archivo para más info.

Para activar/desactivar tanto debug como healthcheck, hay unas variables que se ponen a true o false en el archivo `src/assets/styles/01_settings/_settings__config.scss`

