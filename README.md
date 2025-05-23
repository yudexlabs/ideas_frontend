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

```bash
npm run dev
```

## Con yarn

```bash
yarn dev
```

## Con pnpm

```bash
pnpm dev
```

la aplicación se ejecutará en [http://localhost:3000]

### Despliegue en producción

construir la aplicación para producción

## Usando npm

```bash
npm run build
```

## Usando yarn

```bash
yarn build
```

## Usando pnpm

```bash
pnpm build
```

### Iniciando en modo producción

## npm

```bash
npm start
```

## yarn

```bash
yarn start
```

## pnpm

```bash
pnpm start
```

### Construir y ejecutar con Docker

```bash
# Construir la imagen
docker build -t yudexminds .

# Ejecutar el contenedor
docker run -p 3000:3000 yudexminds

# O usando Docker Compose
docker-compose up -d
```

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
