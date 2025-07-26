--liquibase formatted sql

--changeset ricky:initial-schema
CREATE TABLE test_table (id UUID PRIMARY KEY, stuff TEXT NOT NULL) 