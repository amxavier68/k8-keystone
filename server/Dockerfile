# -----------------------------------------------------
# BASE IMAGE
# -----------------------------------------------------
FROM node:22-slim AS base
WORKDIR /usr/src/app

# -----------------------------------------------------
# INSTALL PNPM (via Corepack)
# -----------------------------------------------------
RUN corepack enable

# -----------------------------------------------------
# COPY ONLY BACKEND DEPS
# This prevents monorepo bleed and 3-hour installs.
# -----------------------------------------------------
COPY package.json pnpm-lock.yaml ./

# -----------------------------------------------------
# INSTALL ONLY BACKEND DEPENDENCIES
# – frozen lockfile ensures deterministic builds
# – prod mode keeps image small
# -----------------------------------------------------
RUN pnpm install --prod --frozen-lockfile

# -----------------------------------------------------
# COPY BACKEND SOURCE CODE
# -----------------------------------------------------
COPY . .

# -----------------------------------------------------
# BUILD (Typescript → JS), if applicable
# -----------------------------------------------------
RUN if [ -f tsconfig.json ]; then pnpm exec tsc; fi

# -----------------------------------------------------
# EXPOSE & START SERVER
# -----------------------------------------------------
EXPOSE 3001
CMD ["node", "dist/index.js"]
