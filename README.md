# 💪 GymDuo

App de entrenamiento personal para **dos** (Franco y su novia). Sabes qué entrenar hoy,
registras lo que haces y ves tu progreso. Todo en español, pensada para el móvil y para
alguien que empieza de cero.

**Incluye:** plan semanal automático, mapa muscular (hombre y mujer), registro de
entrenamiento, medidas y gráficas (IMC + calorías), tips y dudas. Funciona sin internet
y se puede instalar como app en el móvil.

---

## 🔗 Opción 1 — Usarla YA (el link)

La app ya está publicada como link de Claude. Ábrelo en el móvil y listo.

> Pega aquí tu link (te lo di en el chat):
> `https://claude.ai/code/artifact/...`

**Sincronizar los dos teléfonos con el link:** abre el link en los dos móviles **con la
misma cuenta de Claude iniciada** (por ejemplo, los dos con tu cuenta). Cada uno toca su
perfil (Franco / Ella) y los datos se sincronizan solos entre los dos móviles.
Si cada uno usa una cuenta de Claude distinta, usa la **Opción 2 con Firebase** (abajo),
que sincroniza entre cuentas separadas.

Si abres el link sin sincronización, la app igual funciona: guarda los datos en ese teléfono.

### Instalarla en el móvil (icono en la pantalla de inicio)
- **iPhone (Safari):** botón *Compartir* → *Añadir a pantalla de inicio*.
- **Android (Chrome):** menú *⋮* → *Añadir a pantalla de inicio* / *Instalar app*.

Queda como una app más, a pantalla completa.

---

## 🌐 Opción 2 — Tu propia web en GitHub Pages (gratis, sin programar)

Esto te da tu propia dirección (ej. `https://tuusuario.github.io/gymduo/`) y, con Firebase,
sincronización entre **cuentas distintas**. No hay que instalar nada ni compilar: son
archivos sueltos.

### A) Subir la app a GitHub Pages
1. Crea una cuenta en [github.com](https://github.com) (gratis).
2. Crea un repositorio nuevo llamado **`gymduo`** (público).
3. Sube **todos los archivos de esta carpeta** (`index.html`, `app.js`, etc.).
   Puedes arrastrarlos en *Add file → Upload files*.
4. En el repo: *Settings → Pages → Branch: `main` / carpeta `/root`* → *Save*.
5. Espera 1-2 min. Tu web estará en `https://TUUSUARIO.github.io/gymduo/`.

> Si llamas al repositorio distinto de `gymduo`, la app funciona igual (usa rutas relativas).

### B) Firebase en 5 pasos (para sincronizar entre cuentas)
1. Entra en [console.firebase.google.com](https://console.firebase.google.com) y crea un
   proyecto (gratis, plan Spark).
2. Dentro del proyecto: **Firestore Database → Crear base de datos** → modo *producción*
   → elige región.
3. En **Firestore → Reglas**, pega esto y publica (permite leer/escribir sin login,
   suficiente para uso personal entre vosotros):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if true; }
     }
   }
   ```
4. En **⚙️ Configuración del proyecto → Tus apps → Web (</>)**, registra una app.
   Copia el objeto `firebaseConfig` que te da.
5. Abre el archivo **`firebase.js`** de esta carpeta y pega tus valores (apiKey, projectId,
   etc.) sustituyendo los `PON_AQUI_...`. Guarda y vuelve a subir el archivo a GitHub.

Listo: los dos móviles, aunque usen cuentas distintas, verán los mismos datos.

---

## 📁 Qué hace cada archivo

| Archivo | Para qué |
|---|---|
| `index.html` | La página. Carga todo lo demás. |
| `styles.css` | El diseño (oscuro, móvil). |
| `exercises.js` | Catálogo de 60+ ejercicios, tips y dudas. |
| `geometry.js` | El mapa muscular (hombre/mujer) dibujado con SVG. |
| `plan.js` | Genera el plan semanal y calcula IMC / calorías. |
| `sync.js` | Guarda y sincroniza los datos. |
| `app.js` | La app (pantallas, registro, navegación). |
| `firebase.js` | Tus credenciales de Firebase (opcional). |
| `sw.js` + `manifest.webmanifest` + `icon.svg` | Que funcione offline e instalable. |

## 🗂️ Cómo se guardan los datos
Colecciones (en Firestore o en la base del hosting):
- `profiles/{perfil}` → perfil + plan semanal.
- `workouts/{perfil__fecha}` → lo que entrenaste ese día.
- `body/{perfil__fecha}` → peso y medidas.

Las **fotos de progreso** se guardan **solo en el teléfono**, nunca se suben.

## ⚠️ Aviso
Los cálculos de calorías e IMC son **orientativos**, no son consejo médico.
