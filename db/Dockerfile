FROM liquibase/liquibase:latest

COPY ./liquibase/changelog /liquibase/changelog
COPY ./liquibase/liquibase.docker.properties /liquibase/liquibase.docker.properties

WORKDIR /liquibase

# Default command - can be overridden
CMD ["--help"]