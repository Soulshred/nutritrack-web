NUTRITRACK WEB - PRIMERA VERSION

Qué incluye:
- Registro diario de alimentos y macros.
- Objetivo inicial de 2.300 kcal (editable).
- Resumen de calorías, proteínas, carbohidratos y grasas.
- Selector de fecha para revisar días anteriores.
- Registro de peso.
- Exportación e importación de copia de seguridad JSON.
- Diseño adaptable a Android.
- PWA con caché para uso posterior sin conexión.

IMPORTANTE SOBRE LOS DATOS
Los datos se guardan en localStorage del navegador de este dispositivo.
No se envían a ningún servidor. Si borras los datos del sitio/navegador,
puedes perderlos. Exporta respaldos periódicamente desde el botón ↥.

CÓMO PUBLICAR DESDE EL CELULAR (GRATIS CON GITHUB PAGES)
1. Descarga y descomprime NutriTrack-Web.zip en tu teléfono.
2. En Chrome abre https://github.com y crea una cuenta o inicia sesión.
3. Crea un repositorio nuevo llamado nutritrack-web.
4. En el repositorio, usa Add file > Upload files.
5. Sube TODOS los archivos y carpetas de esta carpeta (index.html,
   styles.css, app.js, manifest.webmanifest, sw.js, icon.svg).
6. Pulsa Commit changes.
7. En Settings > Pages, en Build and deployment selecciona Deploy from a branch.
8. Elige la rama main y la carpeta /(root), y guarda.
9. Espera a que GitHub Pages publique el sitio. La dirección será
   https://TU-USUARIO.github.io/nutritrack-web/
10. Abre esa dirección en Chrome Android. Menú ⋮ > Añadir a pantalla
    de inicio (o Instalar aplicación, si aparece).

NOTAS
- Para instalar una PWA y activar el modo sin conexión se necesita HTTPS
  o localhost. GitHub Pages ofrece HTTPS.
- La IA todavía no está conectada. El asistente se muestra como próximamente.
  La integración opcional requerirá un backend seguro; nunca pongas una
  clave de API directamente en app.js ni en el navegador.
- Esta es una primera versión funcional de la interfaz y el registro local,
  no una aplicación auditada ni una solución de respaldo automático.
