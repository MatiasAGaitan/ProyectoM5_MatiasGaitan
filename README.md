# 🤖 GitHub AI Agent

Servidor MCP desarrollado con Node.js y TypeScript para gestionar repositorios, issues y commits de GitHub mediante instrucciones en lenguaje natural desde un host compatible, como Claude Desktop.

Proyecto Integrador del Módulo 5 de Henry — Especialización Backend.

## 📌 Índice

- [Descripción](#descripcion)
- [Tecnologías Usadas](#tecnologias)
- [Requisitos](#requisitos)
- [Instalación — Prueba Local](#instalacion)
- [Configuración de Claude Desktop](#claude-desktop)
- [Catálogo de Tools](#tools)
- [Ejemplos de Uso](#ejemplos)
- [Variables de Entorno y GitHub Token](#configuracion)
- [Arquitectura y Funcionamiento](#arquitectura)
- [Organización del Proyecto](#estructura)
- [Tests](#tests)
- [Troubleshooting](#troubleshooting)
- [Release Checklist](#release-checklist)
- [Notas y Limitaciones](#notas)
- [Autor](#autor)

<a id="descripcion"></a>
## ✨ Descripción

GitHub AI Agent permite que un agente de inteligencia artificial consulte y realice operaciones en GitHub a través de cinco herramientas MCP.

El proyecto se desarrolla en el contexto de **AutomateHub**, una startup dedicada a crear herramientas de automatización para desarrolladores. Su objetivo es conectar solicitudes en lenguaje natural con operaciones concretas de la API de GitHub.

### Funcionalidades

- 📦 Crear repositorios en la cuenta personal autenticada.
- 📝 Crear issues en repositorios existentes.
- 📚 Listar repositorios accesibles al usuario autenticado.
- 🌿 Crear commits agregando o modificando un archivo de texto.
- 🔎 Listar issues, abiertos por defecto, excluyendo pull requests.

El servidor valida los parámetros con Zod, delega las operaciones a Octokit y devuelve respuestas estructuradas. También incorpora errores personalizados, logging en `stderr` y reintentos con espera progresiva.

<a id="tecnologias"></a>
## ⚙️ Tecnologías Usadas

| Tecnología | Uso en el proyecto |
|------------|--------------------|
| 🟢 Node.js | Entorno de ejecución del servidor |
| 🔷 TypeScript | Tipado estático y contratos entre módulos |
| 🔌 `@modelcontextprotocol/sdk` | Protocolo MCP y transporte stdio |
| 🐙 `@octokit/rest` | Integración con la API de GitHub |
| 🛡️ Zod | Validación de inputs y generación de JSON Schema |
| 🔐 dotenv | Carga de variables de entorno desde `.env` |
| 🧪 Vitest | Herramienta de testing unitario |
| 🔍 MCP Inspector | Inspección y ejecución manual de herramientas MCP |
| ⚡ tsx | Ejecución de TypeScript durante el desarrollo |
| 🤖 Claude Desktop | Host MCP para utilizar el servidor con el modelo Claude |
| 🌿 Git y GitHub | Control de versiones y plataforma integrada |

<a id="requisitos"></a>
## 📋 Requisitos

- **Node.js 22 o superior**, según `package.json`.
- npm.
- Git, para clonar el repositorio.
- Una cuenta de GitHub y un Personal Access Token con los permisos necesarios.
- Conexión a internet para operar con GitHub.
- Claude Desktop u otro host MCP compatible con stdio para utilizar prompts en lenguaje natural.

MCP Inspector permite inspeccionar las tools sin utilizar un LLM.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila `src/` en `dist/` |
| `npm start` | Inicia el servidor compilado por stdio |
| `npm run dev` | Ejecuta el servidor desde TypeScript con recarga ante cambios |
| `npm run typecheck` | Verifica tipos sin emitir el JavaScript compilado |
| `npm run inspector` | Inicia MCP Inspector con el servidor compilado |
| `npm test` | Ejecuta Vitest una vez |
| `npm run test-watch` | Ejecuta Vitest en modo watch |


Después de modificar el código fuente, volvé a compilar antes de usar `npm start`, Inspector o la configuración de Claude Desktop basada en `dist/server.js`.

<a id="instalacion"></a>
## 🚀 Instalación — Prueba Local

### 1. Obtener el proyecto

```bash
git clone https://github.com/MatiasAGaitan/ProyectoM5_MatiasGaitan
cd ProyectoM5_MatiasGaitan
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el entorno

Creá un archivo `.env` en la raíz tomando como referencia `.env.example`:

```dotenv
GITHUB_TOKEN=REEMPLAZAR_POR_TU_TOKEN
LOG_LEVEL=info
```

`REEMPLAZAR_POR_TU_TOKEN` es un marcador de ejemplo, no una credencial válida. Consultá [Variables de Entorno y GitHub Token](#configuracion) para obtener y configurar el token.

### 4. Compilar el servidor

```bash
npm run build
```

TypeScript genera el código ejecutable en `dist/`. El entry point compilado es `dist/server.js`.

### 5. Probar con MCP Inspector

```bash
npm run inspector
```

Seguí la URL y las instrucciones que muestre Inspector en la terminal. Conectá el transporte stdio, consultá la lista de tools y seleccioná una herramienta para ingresar sus parámetros.

<a id="claude-desktop"></a>
## 🔌 Configuración de Claude Desktop

Para utilizar GitHub AI Agent desde Claude Desktop:

### 1. Abrir la configuración

1. Abrí **Claude Desktop**.
2. Ingresá a **Settings / Configuración** desde el menú de la aplicación.
3. Entrá en **Developer / Desarrollador**.
4. Seleccioná **Edit Config / Editar configuración**.
5. Abrí el archivo `claude_desktop_config.json` con un editor de texto.

### 2. Registrar el servidor MCP

Agregá la entrada `github-ai-agent` dentro de `mcpServers`:

```json
{
  "mcpServers": {
    "github-ai-agent": {
      "command": "node",
      "args": [
        "C:/ruta/absoluta/ProyectoM5_MatiasGaitan/dist/server.js"
      ]
    }
  }
}
```

Reemplazá la ruta de ejemplo por la ubicación real de `dist/server.js`.

Si ya tenés otros servidores configurados, conservá sus entradas y agregá
`github-ai-agent` dentro del mismo objeto `mcpServers`.

En Windows podés utilizar `/` en las rutas. Si utilizás barras invertidas,
deben escaparse como `\\`.

El servidor carga `GITHUB_TOKEN` desde el archivo `.env` de la raíz del
proyecto, por lo que no necesitás incluir el token en este JSON.

### 3. Reiniciar Claude Desktop

1. Guardá el archivo de configuración.
2. Cerrá Claude Desktop por completo, incluida su ejecución en segundo plano.
3. Volvé a abrir la aplicación.
4. Revisá que el servidor esté conectado y que sus cinco herramientas estén
   disponibles en el menú de herramientas o conectores.

Los nombres y la ubicación de las opciones pueden variar según la versión
de Claude Desktop.

### 4. Realizar la primera consulta

En una conversación, enviá este prompt:

> Listá hasta 10 repositorios accesibles a mi cuenta de GitHub, incluyendo públicos y privados, usando `list_repositories`. Mostrá el nombre completo y el enlace de cada uno.

Claude debería solicitar la ejecución de la herramienta con `type: "all"`
y `per_page: 10`. Si la aplicación pide autorización, revisá los argumentos
y permití la consulta.

Esta operación es de **solo lectura**: no crea ni modifica recursos en GitHub.

<a id="tools"></a>
## 🛠️ Catálogo de Tools

| Tool | Operación | Efecto |
|------|-----------|--------|
| `create_repository` | Crear un repositorio personal | Escritura |
| `create_issue` | Publicar un issue | Escritura |
| `list_repositories` | Consultar repositorios | Solo lectura |
| `create_commit` | Agregar o modificar un archivo mediante un commit | Escritura |
| `list_issues` | Consultar issues de un repositorio | Solo lectura |

### Formato de respuestas

En los éxitos, las tools devuelven los datos en `structuredContent` y también como JSON serializado en un bloque de texto de `content`. Los outputs de este catálogo muestran **los datos de negocio**, no el envoltorio completo del protocolo MCP.

En los fallos, la respuesta incluye `isError: true` y el payload del error serializado en `content`. Sus campos son `code`, `message`, `retryable`, `action`, `hint` y, cuando corresponde, `details`.

Todos los nombres de cuentas, repositorios, números de issues y SHA de los ejemplos son ilustrativos. Reemplazá `usuario-ejemplo` por una cuenta real a la que tenga acceso tu token.

### 📦 `create_repository`

**Descripción:** crea un repositorio en la cuenta personal del usuario autenticado. No crea repositorios dentro de organizaciones.

**Inputs:**

| Campo | Tipo | Requerido | Predeterminado | Restricciones / descripción |
|-------|------|-----------|----------------|-----------------------------|
| `name` | `string` | Sí | — | De 3 a 100 caracteres, letras ASCII, números y guiones. Se recortan espacios en los extremos |
| `description` | `string` | No | — | Hasta 350 caracteres; se recortan espacios en los extremos |
| `private` | `boolean` | No | `false` | `true`: privado; `false`: público |
| `auto_init` | `boolean` | No | `true` | Crea un README inicial cuando es `true` |

La restricción de `name` sigue la regla académica de Henry. Es más estricta que GitHub, que también admite nombres con puntos o guiones bajos.

**Prompt de ejemplo:**

> Creá en mi cuenta un repositorio privado llamado `demo-mcp`, con la descripción «Pruebas del servidor MCP» e inicializado con un README.

**Output ilustrativo:**

```json
{
  "repository": {
    "full_name": "usuario-ejemplo/demo-mcp",
    "owner": "usuario-ejemplo",
    "name": "demo-mcp",
    "private": true,
    "description": "Pruebas del servidor MCP",
    "html_url": "https://github.com/usuario-ejemplo/demo-mcp"
  }
}
```

**Errores y consideraciones:** un nombre inválido produce `VALIDATION_ERROR`; un nombre ya utilizado puede producir un rechazo de GitHub con estado HTTP 422. Si `auto_init` es `false`, el repositorio queda vacío y el flujo actual de `create_commit` necesita un primer commit previo.

### 📝 `create_issue`

**Descripción:** crea y publica un issue en un repositorio existente. Antes de publicarlo, consulta si el repositorio tiene los issues habilitados.

**Inputs:**

| Campo | Tipo | Requerido | Restricciones / descripción |
|-------|------|-----------|-----------------------------|
| `owner` | `string` | Sí | Usuario u organización. No vacío; se recortan espacios en los extremos |
| `repo` | `string` | Sí | Nombre del repositorio, sin owner. No vacío; se recortan espacios en los extremos |
| `title` | `string` | Sí | De 1 a 256 caracteres después de recortar espacios en los extremos |
| `body` | `string` | No | Cuerpo del issue, hasta 65.000 caracteres |
| `labels` | `string[]` | No | Hasta 10 etiquetas, cada una con al menos un carácter. Usar etiquetas existentes |

**Prompt de ejemplo:**

> Creá un issue en `usuario-ejemplo/demo-mcp` con el título «Documentar instalación» y el cuerpo «Agregar los pasos de configuración local al README».

**Output ilustrativo:**

```json
{
  "issue": {
    "number": 1,
    "title": "Documentar instalación",
    "state": "open",
    "html_url": "https://github.com/usuario-ejemplo/demo-mcp/issues/1",
    "labels": []
  }
}
```

**Errores y consideraciones:** los campos requeridos vacíos producen `VALIDATION_ERROR`. Si los issues están deshabilitados, la tool devuelve `GITHUB_API_ERROR` sin intentar crear el issue. La herramienta no implementa detección automática de duplicados.

### 📚 `list_repositories`

**Descripción:** consulta repositorios accesibles al usuario autenticado, según los permisos del token y los filtros seleccionados.

**Inputs:**

| Campo | Tipo | Requerido | Predeterminado | Restricciones / descripción |
|-------|------|-----------|----------------|-----------------------------|
| `type` | `string` | No | `public` | `all`, `public` o `private` |
| `sort` | `string` | No | `updated` | `created`, `updated`, `pushed` o `full_name` |
| `per_page` | `number` | No | `20` | Entero entre 1 y 50 |

**Prompt de ejemplo:**

> Listá hasta 10 repositorios accesibles a mi cuenta, públicos y privados, ordenados por actualización.

**Output ilustrativo:**

```json
{
  "count": 1,
  "repositories": [
    {
      "full_name": "usuario-ejemplo/demo-mcp",
      "owner": "usuario-ejemplo",
      "name": "demo-mcp",
      "private": true,
      "description": "Pruebas del servidor MCP",
      "html_url": "https://github.com/usuario-ejemplo/demo-mcp"
    }
  ]
}
```

**Errores y consideraciones:** `count` representa la cantidad devuelta, no el total disponible. Se consulta una sola página. Una lista vacía se devuelve como `count: 0` y `repositories: []`. La descripción de un repositorio puede ser `null`. Para incluir privados accesibles al token, indicá `type: "all"` o `type: "private"`.

### 🌿 `create_commit`

**Descripción:** agrega o modifica un único archivo de texto mediante la Git Data API. Si el archivo existe, reemplaza su contenido completo.

**Inputs:**

| Campo | Tipo | Requerido | Restricciones / descripción |
|-------|------|-----------|-----------------------------|
| `owner` | `string` | Sí | Usuario u organización; no vacío después de recortar espacios |
| `repo` | `string` | Sí | Nombre del repositorio, sin owner; no vacío después de recortar espacios |
| `path` | `string` | Sí | Ruta no vacía, sin `/` inicial ni segmentos `..`. Se recortan espacios en los extremos |
| `content` | `string` | Sí | Contenido completo del archivo. Puede ser una cadena vacía |
| `message` | `string` | Sí | Mensaje de 1 a 500 caracteres después de recortar espacios |
| `branch` | `string` | No | Rama existente. Si se omite, se utiliza la rama predeterminada del repositorio |

**Prompt de ejemplo:**

> En `usuario-ejemplo/demo-mcp`, creá el archivo `docs/notas.md` con el contenido «Primera prueba del servidor MCP». Usá la rama principal y el mensaje de commit «Agrega notas de prueba».

**Output ilustrativo:**

```json
{
  "commit": {
    "commit_sha": "0123456789abcdef0123456789abcdef01234567",
    "commit_url": "https://github.com/usuario-ejemplo/demo-mcp/commit/0123456789abcdef0123456789abcdef01234567",
    "branch": "main",
    "path": "docs/notas.md",
    "file_url": "https://github.com/usuario-ejemplo/demo-mcp/blob/main/docs/notas.md"
  }
}
```

**Errores y consideraciones:** requiere un repositorio con historial y una rama existente. No crea ramas ni inicializa repositorios vacíos. La actualización de la referencia usa `force: false`; puede fallar por restricciones o cambios concurrentes. Los archivos se escriben con modo Git `100644` y no se conserva un modo ejecutable previo.

### 🔎 `list_issues`

**Descripción:** lista issues de un repositorio, abiertos por defecto. Excluye los pull requests de la respuesta.

**Inputs:**

| Campo | Tipo | Requerido | Predeterminado | Restricciones / descripción |
|-------|------|-----------|----------------|-----------------------------|
| `owner` | `string` | Sí | — | Usuario u organización; no vacío después de recortar espacios |
| `repo` | `string` | Sí | — | Nombre del repositorio, sin owner; no vacío después de recortar espacios |
| `state` | `string` | No | `open` | `open`, `closed` o `all` |
| `sort` | `string` | No | `created` | `created`, `updated` o `comments` |
| `direction` | `string` | No | `desc` | `asc` o `desc` |
| `per_page` | `number` | No | `50` | Entero entre 1 y 100. Tamaño de página solicitado a GitHub antes de excluir PRs |

**Prompt de ejemplo:**

> Listá los issues abiertos de `usuario-ejemplo/demo-mcp`, ordenados por actualización, del más reciente al más antiguo.

**Output ilustrativo:**

```json
{
  "issues": [
    {
      "number": 1,
      "title": "Documentar instalación",
      "state": "open",
      "html_url": "https://github.com/usuario-ejemplo/demo-mcp/issues/1",
      "labels": []
    }
  ]
}
```

**Errores y consideraciones:** un estado fuera del enum produce `VALIDATION_ERROR`. Se consulta la primera página y luego se descartan los pull requests, por lo que pueden devolverse menos issues que `per_page`. Una respuesta `issues: []` no garantiza que no haya issues en páginas posteriores. No hay un parámetro de filtrado por etiqueta.

<a id="ejemplos"></a>
## 💬 Ejemplos de Uso

### Flujo de trabajo

Los siguientes prompts solicitan acciones reales. Utilizá una cuenta y un repositorio de práctica para las operaciones de escritura.

1. **Descubrir repositorios:** «Listá mis repositorios públicos y privados, hasta 10 resultados».
2. **Crear un repositorio:** «Creá un repositorio privado llamado `demo-mcp`, con un README y la descripción “Pruebas del servidor MCP”».
3. **Registrar una tarea:** «Creá en `usuario-ejemplo/demo-mcp` un issue titulado “Documentar instalación”, con un cuerpo que explique los pasos que falta documentar».
4. **Consultar tareas:** «Listá los issues abiertos de `usuario-ejemplo/demo-mcp`».
5. **Agregar un archivo:** «Creá `docs/notas.md` con el texto “Primera prueba del servidor MCP” y el mensaje de commit “Agrega notas de prueba”».

En el último paso, el agente debe conservar el contexto del repositorio o solicitar los datos que falten. No debe inventar `owner` ni `repo`.

### Ejemplo de validación

**Prompt:**

> Creá un repositorio llamado `ab`.

**Payload de error ilustrativo:**

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Input inválido: name: El nombre debe tener al menos 3 caracteres. No se llamó a GitHub.",
  "retryable": false,
  "action": "FIX_INPUT",
  "hint": "Corrige los campos indicados en details y volve a llamar a la tool",
  "details": {
    "issues": [
      {
        "path": "name",
        "message": "El nombre debe tener al menos 3 caracteres"
      }
    ]
  }
}
```

Este payload corresponde al caso en que el agente envía literalmente `name: "ab"`. El texto de un prompt no determina por sí solo los argumentos: el LLM puede solicitar una corrección antes de invocar la tool.

<a id="configuracion"></a>
## 🔐 Variables de Entorno y GitHub Token

### Variables

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `GITHUB_TOKEN` | Sí, para utilizar las operaciones autenticadas | Personal Access Token de GitHub |
| `LOG_LEVEL` | No | Nivel mínimo de logs: `debug`, `info`, `warn`, `error` o `silent`. El nivel predeterminado es `info` |

El cliente carga `.env` desde la raíz del proyecto, tanto al ejecutar `src/` como `dist/`. Las variables ya definidas en el entorno tienen prioridad sobre el archivo `.env`.

Si falta `GITHUB_TOKEN`, el servidor registra una advertencia al iniciar. Esto no equivale a comprobar que un token configurado sea válido: GitHub verifica la autenticación y los permisos al recibir las solicitudes.

### Obtener un token

1. Ingresá a GitHub y abrí **Settings → Developer settings → Personal access tokens**.
2. Elegí el tipo de token y una fecha de vencimiento.
3. Configurá los permisos de acuerdo con las operaciones y repositorios que vas a utilizar.
4. Guardá el valor en `GITHUB_TOKEN` dentro de tu `.env` local.
5. Reiniciá el proceso del servidor o reconectalo desde el host si cambiaste las credenciales.

### Permisos

Para un token **classic**:

- `public_repo`: operaciones sobre repositorios públicos compatibles con ese scope.
- `repo`: acceso a repositorios privados y operaciones sobre ellos, según los permisos de tu cuenta. Es un scope amplio.

Para un token **fine-grained**, verificá el propietario de recursos, la selección de repositorios y los permisos requeridos por cada endpoint:


Más información: [documentación de Personal Access Tokens de GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

### Manejo de secretos

- `.env` está excluido mediante `.gitignore`.
- `.env.example` contiene los nombres de las variables, sin credenciales reales.
- No incluyas tokens en prompts, capturas, commits ni ejemplos compartidos.
- Utilizá permisos acordes al uso previsto. Modificar archivos de workflows puede requerir permisos adicionales.

<a id="arquitectura"></a>
## 🏗️ Arquitectura y Funcionamiento

```text
Usuario: instrucción en lenguaje natural
                 │
                 ▼
Claude Desktop — Host con el modelo Claude
                 │
                 ▼
             Cliente MCP
                 │
                 │ stdio: solicitudes y respuestas MCP
                 ▼
       GitHub AI Agent — MCP Server
                 │
                 ├── Definición y selección de tools
                 ├── Validación Zod
                 ├── Operaciones y DTOs
                 └── Errores, logs y retry
                 │
                 ▼
          Octokit → GitHub API
```

### Cómo se procesa una solicitud

1. El host obtiene el catálogo de herramientas del servidor.
2. El LLM utiliza los nombres, descripciones y schemas para proponer una herramienta y sus argumentos.
3. El cliente envía la llamada MCP y `server.ts` busca la herramienta por su nombre.
4. El handler valida los argumentos con Zod. Si fallan, devuelve un error sin llamar a GitHub.
5. La capa `github` realiza las solicitudes mediante Octokit y transforma la respuesta a DTOs.
6. El handler devuelve el resultado MCP y el host lo pone a disposición del agente.

La autorización y presentación de las llamadas dependen del host. El servidor ejecuta las herramientas solicitadas; no contiene un LLM ni interpreta por sí mismo los prompts.

### Decisiones de diseño

- **Cliente separado de operaciones:** `client.ts` configura Octokit; `operations.ts` implementa las acciones de GitHub.
- **Inyección de dependencias:** las factories de tools reciben `GitHubOperations`, lo que permite sustituir esa dependencia por mocks.
- **Zod como contrato de entrada:** valida datos en ejecución y permite generar el JSON Schema publicado por MCP.
- **DTOs:** limitan las respuestas a datos relevantes para el agente, en lugar de devolver el objeto completo de Octokit.
- **Errores personalizados:** distinguen validación, autenticación, API y conexión, con indicaciones de recuperación.
- **Logging en `stderr`:** mantiene `stdout` reservado para mensajes del protocolo MCP. Los logs son líneas JSON con fecha, nivel, mensaje y contexto.

### Creación de commits mediante Git Data API

1. `getRef`: obtiene el SHA del commit al que apunta la rama.
2. `getCommit`: obtiene el árbol base de ese commit.
3. `createBlob`: guarda el contenido UTF-8, enviado codificado en Base64.
4. `createTree`: crea un árbol basado en el anterior, incorporando el archivo.
5. `createCommit`: crea el commit con el árbol nuevo y el commit base como padre.
6. `updateRef`: mueve la rama al commit nuevo, sin forzar la actualización.

Los SHA identifican objetos Git. El SHA de un blob, un árbol y un commit representa objetos diferentes y no es intercambiable entre esos pasos.

### Política de reintentos

- Hasta **3 reintentos adicionales** por llamada, después del intento inicial.
- Backoff exponencial con base de 1 segundo y tope propio de 10 segundos.
- Se prioriza `retry-after`; si no hay un valor válido, se utiliza `x-ratelimit-reset` cuando está disponible y es futuro.
- Una espera indicada por GitHub puede superar los 10 segundos: no se recorta al tope del backoff.
- Las lecturas usan la clasificación `retryable` del error normalizado.
- La creación de repositorios, la creación de issues y la actualización final de la rama restringen los reintentos automáticos a rate limits reconocidos.
- Los pasos de creación de blob, árbol y objeto commit utilizan la política general; la referencia de la rama se actualiza al final.

`retryable: true` describe el error, pero no garantiza que una operación de escritura concreta vaya a reintentarse automáticamente: también interviene la política de esa operación.

<a id="estructura"></a>
## 🗂️ Organización del Proyecto

```text
📦 GitHub AI Agent
├── 📁 src
│   ├── 📁 errors
│   │   └── 📄 index.ts
│   ├── 📁 github
│   │   ├── 📄 client.ts
│   │   └── 📄 operations.ts
│   ├── 📁 schemas
│   │   ├── 📄 commonSchema.ts
│   │   ├── 📄 createCommitSchema.ts
│   │   ├── 📄 createIssueSchema.ts
│   │   ├── 📄 createRepositorySchema.ts
│   │   ├── 📄 listIssuesSchema.ts
│   │   ├── 📄 listRepositoriesSchema.ts
│   │   └── 📄 index.ts
│   ├── 📁 tools
│   │   ├── 📄 createCommitTool.ts
│   │   ├── 📄 createIssuesTool.ts
│   │   ├── 📄 createRepositoryTool.ts
│   │   ├── 📄 listIssuesTool.ts
│   │   ├── 📄 listRepositoriesTool.ts
│   │   └── 📄 index.ts
│   ├── 📁 types
│   │   ├── 📄 DTOS.ts
│   │   ├── 📄 errorTypes.ts
│   │   ├── 📄 gitHubTypes.ts
│   │   ├── 📄 mcpTypes.ts
│   │   └── 📄 index.ts
│   ├── 📁 utils
│   │   ├── 📄 logging.ts
│   │   └── 📄 retry.ts
│   └── 📄 server.ts
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
└── 📄 tsconfig.json
```

| Área | Responsabilidad |
|------|-----------------|
| `server.ts` | Composición del servidor, registro de tools y transporte stdio |
| `tools/` | Definiciones MCP y handlers |
| `schemas/` | Validación, tipos inferidos y conversión a JSON Schema |
| `github/` | Autenticación del cliente y operaciones de GitHub |
| `types/` | Interfaces, DTOs y contratos compartidos |
| `errors/` | Clases de errores, normalización y respuestas de fallo |
| `utils/` | Logging y mecanismo de reintentos |

`dist/` se genera al compilar; `node_modules/` se genera al instalar dependencias. Ambas carpetas y `.env` están excluidas de Git.

<a id="tests"></a>
## 🧪 Tests

### Ejecutar Todos los Tests

```bash
npm test
```

### Modo Watch

```bash
npm run test-watch
```



<a id="troubleshooting"></a>
## 🔧 Troubleshooting

Los errores de las tools incluyen `code`, `message`, `retryable`, `action` y `hint`. Cuando corresponde, `details` aporta información adicional para corregir la solicitud.

| Error o síntoma | Causa probable | Acción recomendada |
|----------------|----------------|--------------------|
| `AUTH_ERROR` | Token inválido, vencido o autenticación no configurada | Revisar `GITHUB_TOKEN` y reiniciar o reconectar el servidor |
| `VALIDATION_ERROR` | Faltan parámetros o no cumplen el schema | Corregir los campos indicados en `details.issues` |
| `GITHUB_API_ERROR` | GitHub rechazó la operación | Leer `hint` y revisar los datos, el acceso al recurso y los permisos del token |
| `GITHUB_API_ERROR` por rate limit | Se alcanzó un límite de solicitudes | Respetar `retryAfter` o `reset` cuando estén disponibles antes de volver a consultar |
| `NETWORK_ERROR` | El servidor clasificó el fallo como problema de conexión | Revisar conectividad y contexto de la operación; consultar los logs |
| `UNKNOWN_ERROR` | Fallo no identificado | Revisar los logs disponibles en `stderr` y el contexto de la operación |
| No se encuentra `dist/server.js` | Falta compilar o la ruta configurada es incorrecta | Ejecutar `npm run build` y verificar la ruta absoluta en la configuración de Claude Desktop |
| Claude Desktop no encuentra `node` | Node.js no está disponible en el entorno del host | Configurar la ruta absoluta al ejecutable de Node.js en `command` |
| Las tools no reflejan cambios recientes | Se está ejecutando una compilación anterior | Volver a compilar y reiniciar o reconectar el servidor |
| `npm start` queda esperando | El servidor espera mensajes MCP por stdio | Conectarlo desde Claude Desktop o Inspector; no abrir una URL HTTP |

<a id="release-checklist"></a>
## ✅ Release Checklist

Guía de verificación previa a una publicación o revisión externa. Marcá cada punto después de comprobarlo en la versión que vas a entregar.

- [ ] `.env` no está versionado y no hay credenciales en archivos o ejemplos compartidos.
- [ ] `.env.example` incluye las variables utilizadas por el servidor.
- [ ] La versión de Node cumple el requisito de `package.json`.
- [ ] La instalación y los comandos documentados son reproducibles.
- [ ] `build`, `start` y `dev` funcionan en el entorno de revisión.
- [ ] Los logs van a `stderr` y no contaminan `stdout`.
- [ ] Claude Desktop e Inspector pueden descubrir las cinco tools.
- [ ] Los inputs y valores predeterminados del catálogo coinciden con los schemas.
- [ ] Los errores incluyen `code`, `action`, `retryable` y `hint`, sin exponer secretos.
- [ ] Los reintentos están limitados y respetan la política de cada operación.
- [ ] El README incluye configuración, prompts, outputs y troubleshooting.
- [ ] Los ejemplos de escritura se comprueban en un repositorio de práctica.

<a id="notas"></a>
## 📝 Notas y Limitaciones

- La conexión es local por stdio; no se configura un puerto HTTP para este servidor.
- Las cinco tools utilizan el mismo token configurado para el proceso.
- Los listados consultan una sola página y no ofrecen un parámetro `page`.
- El listado de repositorios usa `public` por defecto y puede incluir repositorios de otras cuentas u organizaciones a los que el usuario tenga acceso.
- `list_issues` excluye los pull requests después de consultar GitHub; una página filtrada puede quedar vacía.
- Crear un commit reemplaza el contenido completo de un archivo; no aplica un parche sobre el texto anterior.
- `create_commit` no crea ramas ni inicializa repositorios sin historial.
- `create_repository` inicializa un README por defecto y crea repositorios personales, no de organizaciones.
- Los campos compartidos `owner` y `repo` exigen texto no vacío. La regla académica de 3 a 100 caracteres alfanuméricos y guiones se aplica al nombre de creación.
- La clasificación actual considera error de red a las excepciones sin estado HTTP; por eso conviene revisar el contexto cuando un fallo persiste.
- La descripción de una tool orienta al LLM, pero no reemplaza validaciones ni constituye por sí misma una garantía de detección de duplicados o control de permisos.


<a id="autor"></a>
## 👨‍💻 Autor

Proyecto desarrollado por **Matías Gaitán**.

- GitHub: [MatiasAGaitan](https://github.com/MatiasAGaitan)
- Proyecto Integrador M5 — Henry, Especialización Backend.
