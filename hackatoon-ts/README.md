# Puesto Sol 7

Prototipo en React y TypeScript para probar las dos decisiones del Sol 1.

## Ejecutar

```sh
npm ci
npm run dev
```

Abre la dirección que imprima Vite. En **Misión** puedes limpiar los paneles o cambiar el filtro de aire. **Estado** muestra los cambios en el puesto y **Hitos** reúne las fichas descubiertas. Al repetir o probar la otra opción se restauran los recursos iniciales y se conservan las fichas hasta que recargues la página.

- `src/components` contiene las vistas y los elementos compartidos.
- `src/data` contiene el calendario, las fichas y los textos de prueba.
- `src/game` contiene el estado de la misión y la lógica de cada minijuego.
- `src/styles` contiene los estilos.

`npm run lint` revisa el código y `npm run build` compila la aplicación.
