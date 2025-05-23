# YudexMinds - Gestor de Ideas

![YudexMinds](https://user-images.githubusercontent.com/10100117/236206098-c4f7f1f2-e4a0-4c0a-a1a9-b4b2f3f8f4d7.png)

YudexMinds es una aplicación web minimalista y futurista para gestionar ideas. Permite a los usuarios crear, editar, eliminar y cambiar el estado de sus ideas con una interfaz limpia y moderna.

## Características

- ✨ Interfaz minimalista y futurista con tema oscuro
- 📝 Gestión completa de ideas (CRUD)
- 🔄 Estados personalizables (pendiente, en progreso, completado)
- 📱 Diseño totalmente responsive
- ⚡ Rendimiento optimizado con Next.js

## Requisitos Previos

- Node.js 18.x o superior
- npm, yarn o pnpm
- Git

## Instalación y Ejecución Local

### Clonar el repositorio

```bash
git clone https://github.com/yudexlabs/ideas_frontend.git
cd ideas_frontend
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

## Con npm

npm run dev

## Con yarn

yarn dev

## Con pnpm

pnpm dev

la aplicación se ejecutará en [http://localhost:3000]

### Despliegue en producción

construir la aplicación para producción

## Usando npm

npm run build

## Usando yarn

yarn build

## Usando pnpm

pnpm build

### Iniciando en modo producción

## npm

npm start

## yarn

yarn start

## pnpm

pnpm start

### Ejecución con Docker

## Usando Dockerfile

Crea un archivo `Dockerfile` en la raíz del proyecto:

FROM node:18-alpine AS base

## Instalar dependencias solo cuando sea necesario

FROM base AS deps
WORKDIR /app

## Copiar archivos de dependencias

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

## Construir la aplicación

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

## Construir la aplicación para producción

RUN npm run build

## Imagen de producción

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

## Crear usuario no-root

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

## Copiar archivos necesarios

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]

### Usando Docker Compose

Crea un archivo `docker-compose.yml` en la raíz del proyecto:

version: '3'

services:
  yudexminds:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always

### Construir y ejecutar con Docker

## Construir la imagen

docker build -t mindscape .

## Ejecutar el contenedor

docker run -p 3000:3000 mindscape

## O usando Docker Compose

docker-compose up -d

### Tecnologías Utilizadas

[Next.js](https://nextjs.org/) - Framework de React
[React](https://reactjs.org/) - Biblioteca de UI
[TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
[Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario
[shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
[Lucide React](https://lucide.dev/) - Iconos
[date-fns](https://date-fns.org/) - Utilidades de fecha
[UUID](https://github.com/uuidjs/uuid) - Generación de IDs únicos

## Licencia

[MIT](LICENSE)

## Contribuir

Si desea contribuir al proyecto, siga estos pasos:

1. Forkea el repositorio.
2. Crea una nueva rama para tus cambios.
3. Realiza los cambios en la rama.
4. Envía un pull request a la rama principal.

Recuerde que el proyecto está licenciado bajo la licencia MIT. Si desea agregar tus cambios a la licencia, asegúrate de incluir el copyright y la licencia MIT en todos los archivos modificados.

## Autor

[Yudex Labs](https://github.com/yudexlabs)
