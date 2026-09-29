FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN mkdir -p .git
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_OPENPANEL_CLIENT_ID
ARG NEXT_PUBLIC_OPENPANEL_API_URL
ARG NEXT_PUBLIC_TORRENT_PROXY
ARG NEXT_PUBLIC_VERCEL_ENV=production
ARG NEXT_PUBLIC_VERCEL_URL=watchnext.noisy-silence.duckdns.org
ARG NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL=watchnext.noisy-silence.duckdns.org
ARG NEXT_PUBLIC_TITLE=Movie Advisor
ENV NEXT_PUBLIC_OPENPANEL_CLIENT_ID=$NEXT_PUBLIC_OPENPANEL_CLIENT_ID \
    NEXT_PUBLIC_OPENPANEL_API_URL=$NEXT_PUBLIC_OPENPANEL_API_URL \
    NEXT_PUBLIC_TORRENT_PROXY=$NEXT_PUBLIC_TORRENT_PROXY \
    NEXT_PUBLIC_VERCEL_ENV=$NEXT_PUBLIC_VERCEL_ENV \
    NEXT_PUBLIC_VERCEL_URL=$NEXT_PUBLIC_VERCEL_URL \
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL=$NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL \
    NEXT_PUBLIC_TITLE=$NEXT_PUBLIC_TITLE
RUN --mount=type=cache,target=/app/.next/cache npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
