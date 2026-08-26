# Cómo contribuir

Si nunca has enviado un pull request, este es el paso a paso completo. No necesitas
instalar nada: todo se puede hacer desde el navegador.

## 1. Haz fork

Botón **Fork**, arriba a la derecha. Eso te crea una copia del repositorio en tu propia
cuenta, donde sí puedes escribir.

## 2. Trabaja en una rama

Desde tu fork, en GitHub, puedes crear archivos y editarlos directamente. Cuando lo
hagas, escoge la opción **Create a new branch for this commit** y ponle un nombre que
diga qué estás haciendo:

```
registro-campana-tuusuario
reto-2-validacion-minima
fix-typo-readme
```

Si prefieres trabajar en tu máquina:

```bash
git clone https://github.com/TU-USUARIO/stellar-campus.git
cd stellar-campus
git checkout -b nombre-de-tu-rama
# haz tus cambios
git add .
git commit -m "Describe tu cambio en una línea"
git push origin nombre-de-tu-rama
```

## 3. Abre el pull request

GitHub te muestra un botón **Compare & pull request**. Escribe un título corto y, en la
descripción, explica qué hiciste y por qué. Si tu PR resuelve un issue, escribe
`Closes #12` con el número del issue.

## 4. Espera la revisión

Vamos a revisar los pull requests en vivo durante la sesión siguiente. Si te pedimos un
cambio, lo haces en la misma rama y el pull request se actualiza solo.

---

## Reglas de la casa

- **Un archivo por persona** en `campanas/`, con el nombre de tu usuario de GitHub. Así
  nadie pisa el trabajo de nadie.
- **No subas claves privadas ni frases de recuperación.** Nunca, ni de testnet. Si se te
  escapa una, avísanos y la rotamos.
- **Un pull request por reto.** Es más fácil de revisar y de premiar.
- Si algo no te funciona, abre un issue. No es molestar: es exactamente para eso.
