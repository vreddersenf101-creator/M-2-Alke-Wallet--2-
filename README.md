# Alke Wallet - Módulo 2 - Fundamentos del Desarrollo Front-end

Hola, soy Frida Rosa Vistoso Reddersen, estudiante del bootcamp. Este es mi proyecto del Módulo 2, una billetera digital que desarrollé como parte de la evaluación integradora.

## Sobre el proyecto

Alke Wallet nace de la necesidad de crear una solución simple y segura para administrar dinero de forma digital. La idea es que una persona pueda ingresar a su cuenta, ver su saldo, hacer depósitos, enviar dinero a sus contactos y revisar todos sus movimientos en un solo lugar.

Me propuse que fuera una aplicación clara, fácil de usar y que se viera bien tanto en el computador como en el celular.

## Qué hace la aplicación

En esta versión implementé lo que pedía la consigna del Módulo 2:

- Inicio de sesión con validación de correo y contraseña.
- Visualización del saldo disponible en todo momento.
- Opción para realizar depósitos y retiros simulados y ver cómo se actualiza el saldo.
- Opción para simular la recepción de fondos propios.
- Envío de dinero a contactos agendados, con búsqueda y autocompletado para facilitar la selección.
- Posibilidad de agregar nuevos contactos.
- Historial completo de transacciones con detalle de fecha, tipo y monto.
- Filtro para buscar movimientos por tipo o detalle.

Todo funciona de forma simulada, guardando la información en el navegador para poder probar el flujo completo.

## Tecnologías que utilicé

Para este módulo trabajamos con lo básico del front-end:

- HTML semántico para estructurar cada pantalla.
- CSS con diseño responsive, pensando en una paleta tipo fintech con azules y tarjetas redondeadas.
- Bootstrap para agilizar la maquetación, los formularios, la barra de navegación y los modales.
- JavaScript para la lógica de validaciones, manejo del saldo y registro de transacciones.
- jQuery para los efectos visuales, el autocompletado de contactos y la actualización dinámica del saldo.

## Cómo organicé el proyecto

Siguiendo la Lección 1, definí una estructura simple y ordenada:

```text
alke-wallet/
├── index.html (pantalla de bienvenida)
├── login.html (inicio de sesión)
├── menu.html (menú principal con resumen financiero)
├── deposit.html (depósitos)
├── sendmoney.html (envío de dinero)
├── transactions.html (últimos movimientos)
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       ├── deposit.js
│       ├── sendmoney.js
│       └── transactions.js
```

El flujo que planteé es: index → login → menu → deposit / sendmoney / transactions → cerrar sesión.

Para probar la demo, use las credenciales asignadas: `frida@alkewallet.cl` / `123456`.

En la Lección 2 me enfoqué en usar etiquetas semánticas como header, nav, main, section y footer, y en crear formularios con validaciones básicas. Para la Lección 3 trabajé los estilos y la visualización de datos, especialmente en la pantalla de movimientos.

## Lo que aprendí

Este módulo me ayudó a entender mejor la relación entre HTML, CSS y JavaScript. Aprendí a darle estructura clara a un proyecto, a usar Bootstrap para no partir de cero y a darle interactividad con jQuery sin complicarme. También entendí la importancia de validar formularios y de entregar mensajes claros al usuario cuando algo sale bien o mal.

Me costó al principio el tema del autocompletado y la actualización del saldo, pero al separar la lógica en archivos como deposit.js y sendmoney.js todo se hizo más ordenado y fácil de mantener.

## Próximos pasos

Quiero seguir mejorando la experiencia de usuario y pulir el diseño de la pantalla de movimientos. Este proyecto lo subo a mi portafolio como parte de mi avance en el bootcamp.

---
Frida Rosa Vistoso Reddersen - Antofagasta - 2026
