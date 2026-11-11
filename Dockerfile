# 1. Etapa de instalación y construcción (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente del frontend
COPY . .

# Compila la aplicación para producción (genera la carpeta .next)
RUN npm run build

# 2. Etapa de producción (Ejecución ligera)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=development

# Copia los archivos necesarios generados en la compilación
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expone el puerto por defecto de Next.js
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para arrancar la aplicación en producción
CMD ["node", "server.js"]