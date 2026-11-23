NUTRITRACK WEB - VERSION 2

NOVEDADES
- Catálogo personal de alimentos.
- Búsqueda rápida en el catálogo.
- Creación de alimentos personalizados a partir de etiquetas.
- Valores nutricionales guardados por 100 g.
- Registro de cantidades en gramos con cálculo automático de macros.
- Estadísticas de los últimos 7 días: promedios de calorías/proteínas y barras diarias.
- Conserva los registros, objetivos y peso guardados por la versión anterior.
- Exportación/importación de respaldo incluye ahora también el catálogo.

IMPORTANTE SOBRE LOS DATOS
Los datos se guardan en localStorage del navegador de este dispositivo.
No se envían a ningún servidor. Si borras los datos del sitio/navegador,
puedes perderlos. Exporta respaldos periódicamente desde el botón ↥.

CÓMO ACTUALIZAR TU SITIO DE GITHUB PAGES DESDE ANDROID
1. Descarga y descomprime NutriTrack-Web-v2.zip.
2. Abre https://github.com desde Chrome e inicia sesión.
3. Entra al repositorio soulshred/nutritrack-web.
4. Pulsa Add file > Upload files.
5. Sube los archivos de esta carpeta a la raíz del repositorio y acepta
   reemplazar los archivos existentes: index.html, app.js, styles.css y sw.js.
   También puedes volver a subir manifest.webmanifest e icon.svg.
6. Pulsa Commit changes.
7. Espera un momento y abre https://soulshred.github.io/nutritrack-web/.
8. Si sigue apareciendo la versión anterior, cierra la PWA y abre el sitio
   en una pestaña de Chrome; recarga. El service worker nuevo actualizará
   los archivos estáticos y retirará la caché anterior.

CÓMO USAR EL CATÁLOGO
1. Pulsa “Buscar alimento y registrar”.
2. Si el alimento existe, selecciónalo e indica los gramos consumidos.
3. Si no existe, pulsa “Crear alimento”.
4. Introduce los valores de la etiqueta nutricional por 100 g.
5. Guarda; el alimento quedará en tu catálogo y podrás añadir la cantidad
   consumida al día.

NOTAS
- No se inventan valores nutricionales: completa el catálogo usando las
  etiquetas reales de tus productos.
- La IA todavía no está conectada. La app funciona sin IA ni consumo API.
- La estadística semanal usa los días con alimentos registrados y se
  calcula tomando como referencia la fecha seleccionada.
