ARG POSTGRES_VERSION=16

FROM postgres:${POSTGRES_VERSION}-alpine

# Install locales for Russian support
RUN apk add --no-cache icu-data-full

# Set default locale
ENV LANG=ru_RU.UTF-8
ENV LC_ALL=ru_RU.UTF-8

EXPOSE 5432

